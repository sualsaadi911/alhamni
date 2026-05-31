"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, permissions } from "@/lib/roles";
import { auditLog, AuditEntry, AUDIT_ACTION_LABELS } from "@/lib/audit-log";

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

const ACTION_COLORS: Record<string, string> = {
  login:                "bg-sky-50 text-sky-700",
  logout:               "bg-slate-100 text-slate-600",
  user_created:         "bg-blue-50 text-blue-700",
  user_updated:         "bg-amber-50 text-amber-700",
  user_deleted:         "bg-red-50 text-red-700",
  user_deactivated:     "bg-orange-50 text-orange-700",
  user_activated:       "bg-cyan-50 text-cyan-700",
  task_created:         "bg-indigo-50 text-indigo-700",
  task_updated:         "bg-purple-50 text-purple-700",
  task_deleted:         "bg-red-50 text-red-700",
  task_status_changed:  "bg-blue-50 text-blue-600",
  task_progress_updated:"bg-cyan-50 text-cyan-700",
  content_published:    "bg-indigo-50 text-indigo-700",
  content_updated:      "bg-lime-50 text-lime-700",
};

export default function AuditPage() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    setEntries(auditLog.getAll());
  }, []);

  if (!profile || !hasPermission(profile, "canViewAuditLog")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
          <p className="text-gray-400 mt-2 text-sm">سجل العمليات متاح للمدير التنفيذي ومدير الموارد البشرية فقط</p>
        </div>
      </div>
    );
  }

  const refresh = () => setEntries(auditLog.getAll());

  const clearLog = () => {
    if (confirm("هل تريد مسح جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء.")) {
      auditLog.clear();
      setEntries([]);
    }
  };

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700">سجل العمليات</h1>
          <p className="text-gray-400 mt-1">تتبع جميع الأنشطة لضمان الشفافية والمساءلة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={15}/> تحديث
          </button>
          {permissions.isAdmin(profile.role) && entries.length > 0 && (
            <button onClick={clearLog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
              <Trash2 size={15}/> مسح السجل
            </button>
          )}
        </div>
      </motion.div>

      {entries.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <ShieldCheck size={56} className="mx-auto mb-4 text-gray-200" />
          <p className="font-semibold text-lg">لا توجد عمليات مسجّلة بعد</p>
          <p className="text-sm mt-1">ستظهر العمليات هنا بمجرد تسجيل الدخول أو إجراء أي تعديل</p>
        </div>
      ) : (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">{entries.length} عملية مسجّلة</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
            {entries.map((entry, i) => (
              <motion.div key={entry.id}
                variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Actor avatar */}
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0">
                  {entry.actorName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-800 text-sm">{entry.actorName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ACTION_COLORS[entry.action] || "bg-gray-100 text-gray-600"}`}>
                      {AUDIT_ACTION_LABELS[entry.action] || entry.action}
                    </span>
                    {entry.targetName && (
                      <span className="text-xs text-gray-500">← <span className="font-semibold">{entry.targetName}</span></span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{entry.actorRole}</span>
                    {entry.details && (
                      <span className="text-gray-400 truncate max-w-xs">{entry.details}</span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                  {new Date(entry.timestamp).toLocaleString("ar-SA", {
                    month:"short", day:"numeric",
                    hour:"2-digit", minute:"2-digit",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
