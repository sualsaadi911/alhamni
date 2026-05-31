"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { UserRole, PermissionKey, ROLE_PERMISSION_KEYS } from "./roles";
import { auditLog } from "./audit-log";

export type { UserRole };

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "inactive";
  joinDate: string;
  lastSeen?: string;
  avatar?: string;
  supervisorId?: string;
  customPermissions?: PermissionKey[];
  jobTitle?: string;
}

interface AuthContextType {
  // Current session
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;

  // Auth actions
  login:    (email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  updateUserProfile: (data: Partial<Pick<UserProfile, "name" | "avatar">>) => Promise<void>;

  // User management (admin/hr only)
  allUsers:     UserProfile[];
  createUser:   (data: { name: string; email: string; password: string; role: UserRole; customPermissions?: PermissionKey[] }) => Promise<void>;
  updateUser:   (uid: string, data: Partial<Omit<UserProfile, "uid">>) => Promise<void>;
  deleteUser:   (uid: string) => Promise<void>;
  toggleStatus: (uid: string) => Promise<void>;
}

// ── Canonical user store ───────────────────────────────────────────────────────
// Single source of truth — both auth + user-management read from here.
interface StoredUser extends UserProfile {
  password: string;
}

const INITIAL_USERS: StoredUser[] = [
  {
    uid: "u1", email: "admin@alhamni.sa",     password: "admin123",
    name: "أ. عبدالعزيز بونيان",  role: "executive_director",
    status: "active", joinDate: "2024-01-10", lastSeen: "اليوم",
  },
  {
    uid: "u2", email: "hr@alhamni.sa",        password: "hr1234",
    name: "أ. عبدالله العقيل",    role: "hr_manager",
    status: "active", joinDate: "2024-02-15", lastSeen: "اليوم",
  },
  {
    uid: "u7", email: "volunteer@alhamni.sa", password: "vol123",
    name: "أ. ولاء الشريف",       role: "volunteer_manager",
    status: "active", joinDate: "2024-05-01", lastSeen: "اليوم",
  },
  {
    uid: "u3", email: "finance@alhamni.sa",   password: "fin123",
    name: "أ. حاتم الشهراني",     role: "finance",
    status: "active", joinDate: "2024-03-01", lastSeen: "أمس",
  },
  {
    uid: "u4", email: "legal@alhamni.sa",     password: "leg123",
    name: "أ. حصة أباحسين",       role: "legal",
    status: "active", joinDate: "2024-03-20", lastSeen: "اليوم",
  },
  {
    uid: "u5", email: "media@alhamni.sa",     password: "med123",
    name: "أ. رهف هزازي",         role: "media",
    status: "active", joinDate: "2024-04-05", lastSeen: "أمس",
  },
  {
    uid: "u6", email: "tech@alhamni.sa",      password: "tec123",
    name: "أ. سلطان السعدي",      role: "tech_support",
    status: "active", joinDate: "2024-04-20", lastSeen: "اليوم",
  },
  {
    uid: "u8", email: "vp@alhamni.sa",        password: "vp1234",
    name: "أ. رهف الشيباني",      role: "hr_manager",
    status: "active", joinDate: "2024-01-15", lastSeen: "اليوم",
  },
  {
    uid: "u9",  email: "dev@alhamni.sa",       password: "dev123",
    name: "أ. أفنان الشهري",      role: "tech_support",
    status: "active", joinDate: "2024-05-10", lastSeen: "اليوم",
    customPermissions: ["canManageSystem"],
    jobTitle: "مسؤولة تطوير المواقع والذكاء الاصطناعي",
  },
  {
    uid: "u12", email: "maram@alhamni.sa",    password: "mar123",
    name: "أ. مرام فرحان",        role: "tech_support",
    status: "active", joinDate: "2024-06-01", lastSeen: "اليوم",
    customPermissions: ["canViewAnalytics"],
    jobTitle: "أخصائية البيانات",
  },
  {
    uid: "u10", email: "sabreen@alhamni.sa",  password: "sab123",
    name: "أ. صابرين ثابت",       role: "media",
    status: "active", joinDate: "2024-05-15", lastSeen: "أمس",
  },
];

// Runtime-added users (reset on page refresh — acceptable for demo)
let runtimeUsers: StoredUser[] = [];

function getAllStoredUsers(): StoredUser[] {
  return [...INITIAL_USERS, ...runtimeUsers];
}

function findByEmail(email: string): StoredUser | undefined {
  return getAllStoredUsers().find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
}

function findByUid(uid: string): StoredUser | undefined {
  return getAllStoredUsers().find(u => u.uid === uid);
}

// ── Session persistence ────────────────────────────────────────────────────────
const SESSION_KEY = "alhamni_session";

function loadSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(p: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (p) sessionStorage.setItem(SESSION_KEY, JSON.stringify(p));
  else    sessionStorage.removeItem(SESSION_KEY);
}

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  // Reactive snapshot of all users (excluding passwords)
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() =>
    INITIAL_USERS.map(({ password: _pw, ...u }) => u)
  );

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      // Refresh from store (status may have changed)
      const fresh = findByUid(saved.uid);
      if (fresh && fresh.status === "active") {
        const { password: _pw, ...p } = fresh;
        setProfile(p);
        saveSession(p);
      } else {
        saveSession(null);
      }
    }
    setLoading(false);
  }, []);

  const refreshUsers = useCallback(() => {
    setAllUsers(getAllStoredUsers().map(({ password: _pw, ...u }) => u));
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const account = findByEmail(email.trim());
    if (!account || account.password.trim() !== password.trim()) {
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    if (account.status === "inactive") {
      throw new Error("هذا الحساب معطّل. تواصل مع مدير الموارد البشرية");
    }
    const { password: _pw, ...profileData } = account;
    setProfile(profileData);
    saveSession(profileData);

    auditLog.add({
      actorUid: account.uid, actorName: account.name, actorRole: account.role,
      action: "login", details: `دخول من ${email}`,
    });
  }, []);

  const logout = useCallback(async () => {
    if (profile) {
      auditLog.add({
        actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
        action: "logout",
      });
    }
    setProfile(null);
    saveSession(null);
  }, [profile]);

  const updateUserProfile = useCallback(async (data: Partial<Pick<UserProfile, "name" | "avatar">>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);
    saveSession(updated);
    // Persist into runtime store if not a seeded user
    const idx = runtimeUsers.findIndex(u => u.uid === profile.uid);
    if (idx !== -1) runtimeUsers[idx] = { ...runtimeUsers[idx], ...data };
    refreshUsers();
  }, [profile, refreshUsers]);

  // Public register (for non-admin signup pages)
  const register = useCallback(async (
    email: string, password: string, name: string, _role?: string
  ) => {
    if (findByEmail(email)) throw new Error("هذا البريد الإلكتروني مستخدم بالفعل");
    const newProfile: UserProfile = {
      uid: `u-${Date.now()}`,
      email, name,
      role: "media",   // lowest-privilege default for public signups
      status: "active",
      joinDate: new Date().toISOString().slice(0, 10),
    };
    runtimeUsers = [{ ...newProfile, password }, ...runtimeUsers];
    setProfile(newProfile);
    saveSession(newProfile);
    refreshUsers();
  }, [refreshUsers]);

  // ── User Management ───────────────────────────────────────────────────────────
  const createUser = useCallback(async (data: {
    name: string; email: string; password: string; role: UserRole; customPermissions?: PermissionKey[];
  }) => {
    if (findByEmail(data.email)) throw new Error("هذا البريد الإلكتروني مستخدم بالفعل");

    // Validate: supervisor cannot grant permissions they don't have
    if (profile && data.customPermissions && data.customPermissions.length > 0) {
      const supervisorPerms = new Set(ROLE_PERMISSION_KEYS[profile.role]);
      const forbidden = data.customPermissions.filter(p => !supervisorPerms.has(p));
      if (forbidden.length > 0) {
        throw new Error("لا يمكنك منح صلاحيات لا تملكها");
      }
    }

    const newUser: StoredUser = {
      uid: `u-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      status: "active",
      joinDate: new Date().toISOString().slice(0, 10),
      lastSeen: "الآن",
      supervisorId: profile?.uid,
      customPermissions: data.customPermissions ?? [],
    };
    runtimeUsers = [newUser, ...runtimeUsers];
    refreshUsers();

    // Send welcome email in background
    fetch("/api/users/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    }).catch(err => console.error("Welcome email failed:", err));

    if (profile) {
      auditLog.add({
        actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
        action: "user_created", targetId: newUser.uid, targetName: newUser.name,
        details: `الدور: ${newUser.role} | البريد: ${newUser.email}`,
      });
    }
  }, [profile, refreshUsers]);

  const updateUser = useCallback(async (uid: string, data: Partial<Omit<UserProfile, "uid">>) => {
    // Update in runtime store
    const rIdx = runtimeUsers.findIndex(u => u.uid === uid);
    if (rIdx !== -1) {
      runtimeUsers[rIdx] = { ...runtimeUsers[rIdx], ...data };
    } else {
      // It's a seeded user — move to runtime with override
      const seed = INITIAL_USERS.find(u => u.uid === uid);
      if (seed) runtimeUsers = [{ ...seed, ...data }, ...runtimeUsers];
    }
    refreshUsers();
    // If editing current session user, refresh profile too
    if (profile?.uid === uid) {
      const updated = { ...profile, ...data };
      setProfile(updated as UserProfile);
      saveSession(updated as UserProfile);
    }

    if (profile) {
      auditLog.add({
        actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
        action: "user_updated", targetId: uid,
        details: JSON.stringify(data),
      });
    }
  }, [profile, refreshUsers]);

  const deleteUser = useCallback(async (uid: string) => {
    if (uid === profile?.uid) throw new Error("لا يمكنك حذف حسابك الخاص");
    const target = findByUid(uid);
    runtimeUsers = runtimeUsers.filter(u => u.uid !== uid);
    // Note: seeded users cannot be truly deleted — just deactivate them instead
    refreshUsers();

    if (profile && target) {
      auditLog.add({
        actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
        action: "user_deleted", targetId: uid, targetName: target.name,
      });
    }
  }, [profile, refreshUsers]);

  const toggleStatus = useCallback(async (uid: string) => {
    if (uid === profile?.uid) throw new Error("لا يمكنك تعطيل حسابك الخاص");
    const target = findByUid(uid);
    if (!target) return;
    const newStatus: "active" | "inactive" = target.status === "active" ? "inactive" : "active";
    await updateUser(uid, { status: newStatus });

    if (profile) {
      auditLog.add({
        actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
        action: newStatus === "active" ? "user_activated" : "user_deactivated",
        targetId: uid, targetName: target.name,
      });
    }
  }, [profile, updateUser]);

  return (
    <AuthContext.Provider value={{
      user: profile,
      profile,
      loading,
      login,
      logout,
      register,
      updateUserProfile,
      allUsers,
      createUser,
      updateUser,
      deleteUser,
      toggleStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
