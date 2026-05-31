"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit3, Trash2, Search, X, Save, UserCheck,
  Shield, Lock, Eye, EyeOff, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/auth-context";
import { permissions, hasPermission, ROLE_LABELS, ROLE_COLORS, ROLE_BG, ROLE_EMOJI, ROLE_PERMISSIONS_LIST, ALL_ROLES, PERMISSION_LABELS, ROLE_PERMISSION_KEYS, PermissionKey } from "@/lib/roles";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

const emptyForm = { name: "", email: "", role: "media" as UserRole, password: "", customPermissions: ROLE_PERMISSION_KEYS["media"] as PermissionKey[] };

export default function UsersPage() {
  const { profile, allUsers, createUser, updateUser, deleteUser, toggleStatus } = useAuth();

  const [search,    setSearch]    = useState("");
  const [roleFilter,setRoleFilter]= useState<UserRole|"all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [showPass,  setShowPass]  = useState(false);
  const [detailId,  setDetailId]  = useState<string|null>(null);
  const [form,      setForm]      = useState(emptyForm);
  const [error,     setError]     = useState("");
  const [saving,    setSaving]    = useState(false);
  const [showPerms, setShowPerms] = useState(false);

  // ── Access guard ────────────────────────────────────────────────────────────
  if (!profile || !hasPermission(profile, "canManageUsers")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
          <p className="text-gray-400 mt-2 text-sm">
            يحتاج هذا القسم صلاحيات المدير التنفيذي أو مدير الموارد البشرية
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = permissions.isAdmin(profile.role);

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Modal helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowPerms(false);
    setShowModal(true);
  };

  const openEdit = (uid: string) => {
    const u = allUsers.find(x => x.uid === uid);
    if (!u) return;
    setEditingId(uid);
    setForm({ name: u.name, email: u.email, role: u.role, password: "", customPermissions: u.customPermissions ?? ROLE_PERMISSION_KEYS[u.role] });
    setError("");
    setShowPerms(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError("الاسم والبريد مطلوبان"); return; }
    if (!editingId && !form.password) { setError("كلمة المرور مطلوبة للحسابات الجديدة"); return; }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateUser(editingId, { name: form.name, email: form.email, role: form.role, customPermissions: form.customPermissions });
      } else {
        await createUser({ name: form.name, email: form.email, password: form.password, role: form.role, customPermissions: form.customPermissions });
      }
      setShowModal(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!isAdmin) return;
    try { await deleteUser(uid); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "لا يمكن الحذف");
    }
  };

  const handleToggle = async (uid: string) => {
    try { await toggleStatus(uid); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "لا يمكن التعديل");
    }
  };

  const detailUser = allUsers.find(u => u.uid === detailId);

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700">إدارة المستخدمين</h1>
          <p className="text-gray-400 mt-1">نظام RBAC — إنشاء الحسابات وتعيين الصلاحيات ({allUsers.length} مستخدم)</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} /> مستخدم جديد
        </button>
      </motion.div>

      {/* Role stats */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {ALL_ROLES.map((role, i) => {
          const count = allUsers.filter(u => u.role === role).length;
          return (
            <motion.button key={role} variants={fadeUp} initial="hidden" animate="visible" custom={i}
              onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all text-right ${
                roleFilter === role ? "border-primary-400 ring-2 ring-primary-200" : "border-primary-50 hover:border-primary-200"
              }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ROLE_EMOJI[role]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ROLE_COLORS[role]}`}>
                  {count}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-600 leading-tight">{ROLE_LABELS[role]}</p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Search + filter */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as UserRole|"all")}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
          <option value="all">كل الأدوار</option>
          {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </motion.div>

      {/* Users grid */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((u, i) => (
            <motion.div key={u.uid} layout
              variants={fadeUp} initial="hidden" animate="visible"
              exit={{ opacity:0, scale:0.95 }} custom={i}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${
                u.status === "inactive" ? "opacity-60 border-gray-200" : "border-primary-50"
              }`}>
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ROLE_BG[u.role]} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-32">{u.email}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setDetailId(u.uid)}
                    className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                    <Shield size={14}/>
                  </button>
                  <button onClick={() => openEdit(u.uid)}
                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                    <Edit3 size={14}/>
                  </button>
                  {isAdmin && u.uid !== profile.uid && (
                    <button onClick={() => handleDelete(u.uid)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                      <Trash2 size={14}/>
                    </button>
                  )}
                </div>
              </div>

              {/* Role badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{ROLE_EMOJI[u.role]}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ROLE_COLORS[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
              </div>

              {/* Permission preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ROLE_PERMISSIONS_LIST[u.role].slice(0, 2).map(p => (
                  <span key={p} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg border border-gray-100 truncate max-w-32">{p}</span>
                ))}
                {ROLE_PERMISSIONS_LIST[u.role].length > 2 && (
                  <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg border border-gray-100">
                    +{ROLE_PERMISSIONS_LIST[u.role].length - 2}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">
                  {u.lastSeen ? `آخر ظهور: ${u.lastSeen}` : `انضم: ${u.joinDate}`}
                </span>
                <button onClick={() => handleToggle(u.uid)}
                  disabled={u.uid === profile.uid}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    u.status === "active"
                      ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${u.status==="active"?"bg-sky-500":"bg-gray-400"}`}/>
                  {u.status === "active" ? "نشط" : "معطّل"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <UserCheck size={48} className="mx-auto mb-4 text-gray-200" />
            لا توجد نتائج مطابقة
          </div>
        )}
      </motion.div>

      {/* ── Permission Detail Modal ── */}
      <AnimatePresence>
        {detailUser && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDetailId(null)}>
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.92, opacity:0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="p-7 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ROLE_BG[detailUser.role]} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                      {detailUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{detailUser.name}</h3>
                      <p className="text-sm text-gray-400">{detailUser.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-base">{ROLE_EMOJI[detailUser.role]}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ROLE_COLORS[detailUser.role]}`}>
                          {ROLE_LABELS[detailUser.role]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={22}/>
                  </button>
                </div>
              </div>

              <div className="p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-primary-500"/>
                  <h4 className="font-bold text-gray-800">الصلاحيات الممنوحة</h4>
                </div>
                <div className="space-y-2">
                  {ROLE_PERMISSIONS_LIST[detailUser.role].map(p => (
                    <div key={p} className="flex items-center gap-3 py-2.5 px-4 bg-primary-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"/>
                      <span className="text-sm font-medium text-primary-700">{p}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">تاريخ الانضمام</span>
                    <span className="font-semibold text-gray-700">
                      {new Date(detailUser.joinDate).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">الحالة</span>
                    <span className={`font-semibold ${detailUser.status==="active"?"text-sky-600":"text-gray-400"}`}>
                      {detailUser.status === "active" ? "نشط" : "معطّل"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-7 pb-7 flex gap-3">
                <button onClick={() => { setDetailId(null); openEdit(detailUser.uid); }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Edit3 size={15}/> تعديل الصلاحيات
                </button>
                <button onClick={() => setDetailId(null)} className="flex-1 btn-outline">إغلاق</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.92, opacity:0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-black text-primary-700 flex items-center gap-2">
                  <UserCheck size={22}/>
                  {editingId ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24}/>
                </button>
              </div>

              <div className="p-8 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="label">الاسم الكامل *</label>
                  <input value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                    placeholder="أدخل الاسم..." className="input"/>
                </div>

                <div>
                  <label className="label">البريد الإلكتروني *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                    placeholder="example@alhamni.sa" className="input" dir="ltr"/>
                </div>

                {!editingId && (
                  <div>
                    <label className="label">كلمة المرور *</label>
                    <div className="relative">
                      <input type={showPass?"text":"password"} value={form.password}
                        onChange={e => setForm({...form, password:e.target.value})}
                        placeholder="كلمة مرور قوية..." className="input pl-10"/>
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">القسم</label>
                  <select
                    value={form.role}
                    onChange={e => {
                      const newRole = e.target.value as UserRole;
                      setForm({ ...form, role: newRole, customPermissions: [...ROLE_PERMISSION_KEYS[newRole]] });
                    }}
                    className="input">
                    {ALL_ROLES.map(r => (
                      <option key={r} value={r}>{ROLE_EMOJI[r]} {ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>

                {/* Permissions accordion */}
                <div className="border border-primary-100 rounded-2xl overflow-hidden">
                  <button type="button"
                    onClick={() => setShowPerms(p => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-primary-50 hover:bg-primary-100 transition-colors">
                    <span className="text-sm font-bold text-primary-700 flex items-center gap-2">
                      <Shield size={14}/>
                      الصلاحيات
                      <span className="text-xs font-normal bg-primary-200 text-primary-700 px-2 py-0.5 rounded-full">
                        {form.customPermissions.length} محددة
                      </span>
                    </span>
                    <ChevronDown size={16} className={`text-primary-500 transition-transform duration-200 ${showPerms ? "rotate-180" : ""}`}/>
                  </button>

                  {showPerms && (
                    <div className="p-4 bg-white">
                      <div className="flex justify-end gap-3 mb-3">
                        <button type="button"
                          onClick={() => setForm({ ...form, customPermissions: [...ROLE_PERMISSION_KEYS[form.role]] })}
                          className="text-xs text-primary-500 hover:text-primary-700 underline">
                          افتراضي القسم
                        </button>
                        <button type="button"
                          onClick={() => setForm({ ...form, customPermissions: [] })}
                          className="text-xs text-red-400 hover:text-red-600 underline">
                          مسح الكل
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map(key => {
                          const isDefault = ROLE_PERMISSION_KEYS[form.role].includes(key);
                          return (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={form.customPermissions.includes(key)}
                                onChange={e => {
                                  const next = e.target.checked
                                    ? [...form.customPermissions, key]
                                    : form.customPermissions.filter(k => k !== key);
                                  setForm({ ...form, customPermissions: next });
                                }}
                                className="w-4 h-4 accent-primary-600 rounded flex-shrink-0"
                              />
                              <span className={`text-sm flex-1 ${isDefault ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                                {PERMISSION_LABELS[key]}
                              </span>
                              {isDefault && (
                                <span className="text-xs bg-primary-50 text-primary-500 px-1.5 py-0.5 rounded-md flex-shrink-0">افتراضي</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
                )}
              </div>

              <div className="px-8 pb-8 flex gap-3">
                <button onClick={handleSave} disabled={saving || !form.name || !form.email}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    : <Save size={16}/>}
                  {editingId ? "تحديث" : "إنشاء الحساب"}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 btn-outline">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
