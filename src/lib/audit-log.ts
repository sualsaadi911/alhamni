// ── Audit Log — تسجيل العمليات للشفافية ───────────────────────────────────────

export type AuditAction =
  | "login"
  | "logout"
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "user_deactivated"
  | "user_activated"
  | "task_created"
  | "task_updated"
  | "task_deleted"
  | "task_status_changed"
  | "task_progress_updated"
  | "content_published"
  | "content_updated";

export interface AuditEntry {
  id: string;
  timestamp: string;       // ISO
  actorUid: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  targetId?: string;       // id of affected resource
  targetName?: string;     // human-readable name
  details?: string;        // additional info
}

const STORAGE_KEY = "alhamni_audit_log";
const MAX_ENTRIES = 500;

function load(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(entries: AuditEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch { /* storage full — skip */ }
}

export const auditLog = {
  getAll(): AuditEntry[] {
    return load();
  },

  add(entry: Omit<AuditEntry, "id" | "timestamp">): void {
    const entries = load();
    const newEntry: AuditEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    save([newEntry, ...entries]);
  },

  clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};

// ── Human-readable labels ──────────────────────────────────────────────────────
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  login:                "تسجيل دخول",
  logout:               "تسجيل خروج",
  user_created:         "إنشاء مستخدم",
  user_updated:         "تعديل مستخدم",
  user_deleted:         "حذف مستخدم",
  user_deactivated:     "تعطيل حساب",
  user_activated:       "تفعيل حساب",
  task_created:         "إنشاء مهمة",
  task_updated:         "تعديل مهمة",
  task_deleted:         "حذف مهمة",
  task_status_changed:  "تغيير حالة مهمة",
  task_progress_updated:"تحديث تقدم مهمة",
  content_published:    "نشر محتوى",
  content_updated:      "تعديل محتوى",
};
