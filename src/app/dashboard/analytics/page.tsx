"use client";
import { motion } from "framer-motion";
import { Users, HeartHandshake, CheckCircle, Clock, MapPin, Activity } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useVolunteerApplications } from "@/lib/volunteer-applications-context";
import { auditLog, AUDIT_ACTION_LABELS } from "@/lib/audit-log";
import { useMemo } from "react";

export default function AnalyticsPage() {
  const { allUsers } = useAuth();
  const { applications } = useVolunteerApplications();
  const logs = useMemo(() => auditLog.getAll().slice(0, 8), []);

  const activeUsers  = allUsers.filter(u => u.status === "active").length;
  const pending      = applications.filter(a => a.status === "قيد المراجعة").length;
  const accepted     = applications.filter(a => a.status === "مقبول").length;
  const rejected     = applications.filter(a => a.status === "مرفوض").length;

  // توزيع طلبات التطوع حسب البرنامج
  const programMap: Record<string, number> = {};
  applications.forEach(a => {
    programMap[a.program] = (programMap[a.program] || 0) + 1;
  });
  const programs = Object.entries(programMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxProg = programs[0]?.[1] || 1;

  const stats = [
    { label: "المستخدمون النشطون",       value: activeUsers,           icon: Users,          color: "bg-purple-50 text-purple-600" },
    { label: "إجمالي طلبات التطوع",      value: applications.length,   icon: HeartHandshake, color: "bg-emerald-50 text-emerald-600" },
    { label: "طلبات قيد المراجعة",       value: pending,               icon: Clock,          color: "bg-amber-50 text-amber-600" },
    { label: "طلبات مقبولة",             value: accepted,              icon: CheckCircle,    color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">تحليلات البيانات</h1>
        <p className="text-sm text-gray-400 mt-1">بيانات حقيقية من النظام</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-3xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* حالة الطلبات */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-5">حالة طلبات التطوع</h2>
          <div className="flex items-end gap-6 h-36 justify-center">
            {[
              { label: "قيد المراجعة", value: pending,  color: "bg-amber-400"  },
              { label: "مقبول",         value: accepted, color: "bg-emerald-500" },
              { label: "مرفوض",         value: rejected, color: "bg-red-400"    },
            ].map(b => {
              const max = Math.max(pending, accepted, rejected, 1);
              const h = Math.round((b.value / max) * 100);
              return (
                <div key={b.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-lg font-black text-gray-800">{b.value}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.7 }}
                    className={`w-full rounded-t-xl ${b.color}`}
                    style={{ minHeight: b.value > 0 ? 8 : 0 }}
                  />
                  <span className="text-xs text-gray-500 text-center">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* توزيع البرامج */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={18} className="text-emerald-500" />
            <h2 className="font-bold text-gray-800">طلبات التطوع حسب البرنامج</h2>
          </div>
          {programs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-4">
              {programs.map(([prog, count]) => (
                <div key={prog}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{prog}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxProg) * 100}%` }}
                      transition={{ duration: 0.7 }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* آخر طلبات التطوع */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-5">آخر طلبات التطوع</h2>
          {applications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">لا توجد طلبات</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.program} • {a.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    a.status === "مقبول"           ? "bg-emerald-100 text-emerald-700" :
                    a.status === "مرفوض"           ? "bg-red-100 text-red-700" :
                                                    "bg-amber-100 text-amber-700"
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* سجل النشاط */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-blue-500" />
            <h2 className="font-bold text-gray-800">سجل النشاط الأخير</h2>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">لا توجد عمليات مسجلة بعد</p>
          ) : (
            <div className="space-y-3">
              {logs.map(l => (
                <div key={l.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{AUDIT_ACTION_LABELS[l.action]}</p>
                    <p className="text-xs text-gray-400">{l.actorName} {l.targetName ? `← ${l.targetName}` : ""}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
