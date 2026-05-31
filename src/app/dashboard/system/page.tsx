"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/roles";
import { Lock, Wrench, Server, Shield, RefreshCw, Database, Users, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const systemStatus = [
  { label: "الموقع الإلكتروني", status: "يعمل", uptime: "99.9٪", icon: Server, color: "text-sky-500", bg: "bg-sky-50" },
  { label: "قاعدة البيانات", status: "يعمل", uptime: "99.8٪", icon: Database, color: "text-sky-500", bg: "bg-sky-50" },
  { label: "المصادقة", status: "يعمل", uptime: "100٪", icon: Shield, color: "text-sky-500", bg: "bg-sky-50" },
  { label: "التخزين السحابي", status: "تحذير", uptime: "98.5٪", icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-50" },
];

const recentTickets = [
  { id: 1, title: "مشكلة في تسجيل الدخول لأحد المستخدمين", user: "سارة الأحمدي", priority: "عالية", status: "مفتوح", date: "منذ ساعتين" },
  { id: 2, title: "طلب إعادة تعيين كلمة المرور", user: "خالد الزهراني", priority: "متوسطة", status: "قيد المعالجة", date: "منذ ٤ ساعات" },
  { id: 3, title: "استفسار عن صلاحيات الوصول", user: "نورة القحطاني", priority: "منخفضة", status: "محلول", date: "أمس" },
  { id: 4, title: "خطأ في رفع الملفات", user: "فيصل الدوسري", priority: "عالية", status: "محلول", date: "أمس" },
];

const PRIORITY_COLORS: Record<string, string> = {
  "عالية": "bg-red-100 text-red-700",
  "متوسطة": "bg-amber-100 text-amber-700",
  "منخفضة": "bg-gray-100 text-gray-600",
};

const TICKET_STATUS_COLORS: Record<string, string> = {
  "مفتوح": "bg-red-50 text-red-600",
  "قيد المعالجة": "bg-amber-50 text-amber-600",
  "محلول": "bg-sky-50 text-sky-700",
};

export default function SystemPage() {
  const { profile } = useAuth();
  const [tickets, setTickets] = useState(recentTickets);

  if (!profile || !hasPermission(profile, "canManageSystem")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
          <p className="text-gray-400 mt-2 text-sm">هذا القسم مخصص للمدير التنفيذي ومدير الدعم الفني</p>
        </div>
      </div>
    );
  }

  const resolveTicket = (id: number) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "محلول" } : t));
  };

  const openCount = tickets.filter(t => t.status === "مفتوح").length;
  const inProgressCount = tickets.filter(t => t.status === "قيد المعالجة").length;
  const resolvedCount = tickets.filter(t => t.status === "محلول").length;

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700 flex items-center gap-3">
            <Wrench size={30} className="text-orange-500" />
            الدعم الفني وإدارة النظام
          </h1>
          <p className="text-gray-400 mt-1">مراقبة النظام وإدارة التذاكر التقنية</p>
        </div>
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-2xl px-4 py-2">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-sky-700">النظام يعمل بشكل طبيعي</span>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-8">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Server size={18} className="text-primary-500" />
          حالة الخدمات
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatus.map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-primary-50">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-bold ${s.status === "يعمل" ? "text-sky-600" : "text-amber-600"}`}>
                  {s.status === "يعمل"
                    ? <CheckCircle2 size={13} />
                    : <AlertTriangle size={13} />}
                  {s.status}
                </span>
              </div>
              <p className="font-bold text-gray-800 text-sm mb-1">{s.label}</p>
              <p className="text-xs text-gray-400">وقت التشغيل: {s.uptime}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "تذاكر مفتوحة", value: openCount, color: "from-red-400 to-red-600", icon: AlertTriangle },
          { label: "قيد المعالجة", value: inProgressCount, color: "from-amber-400 to-amber-600", icon: Clock },
          { label: "محلولة", value: resolvedCount, color: "from-sky-400 to-sky-600", icon: CheckCircle2 },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i + 5}
            className="bg-white rounded-2xl p-5 shadow-sm border border-primary-50">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Support Tickets */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
        className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <Users size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold text-primary-700">تذاكر الدعم الفني</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {tickets.map((ticket, i) => (
            <motion.div key={ticket.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-gray-800 text-sm">{ticket.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{ticket.user}</span>
                  <span>•</span>
                  <span>{ticket.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${TICKET_STATUS_COLORS[ticket.status]}`}>
                  {ticket.status}
                </span>
                {ticket.status !== "محلول" && (
                  <button onClick={() => resolveTicket(ticket.id)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-xl transition-colors">
                    حل التذكرة
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
