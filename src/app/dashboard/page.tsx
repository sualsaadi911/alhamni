"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/tasks-context";
import { ROLE_LABELS, ROLE_EMOJI, hasPermission } from "@/lib/roles";
import {
  CheckSquare, AlertTriangle, TrendingUp,
  Clock, CheckCircle2, RotateCcw,
  ChevronLeft, BarChart3, Users, ShieldCheck,
} from "lucide-react";
import {
  STATUS_LABELS, STATUS_COLORS, STATUS_DOT, STATUS_PROGRESS,
  PRIORITY_LABELS, PRIORITY_COLORS,
} from "@/lib/tasks-context";

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

function MiniCircle({ pct, color }: { pct: number; color: string }) {
  const r = 14; const c = 2 * Math.PI * r;
  return (
    <svg width={36} height={36} className="rotate-[-90deg] flex-shrink-0">
      <circle cx={18} cy={18} r={r} fill="none" stroke="#E2E8F0" strokeWidth={4} />
      <circle cx={18} cy={18} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${(pct/100)*c} ${c}`} strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const { profile, allUsers } = useAuth();
  const { getVisibleTasks }   = useTasks();

  if (!profile) return null;

  const visibleTasks = getVisibleTasks(profile);
  const myTasks      = visibleTasks.filter(t => t.assignedTo === profile.uid);

  // Stats based on visible tasks (executive/hr see all; others see only theirs)
  const allDone    = visibleTasks.filter(t => t.status === "completed").length;
  const allLate    = visibleTasks.filter(t => t.status === "late").length;
  const allActive  = visibleTasks.filter(t => t.status === "in_progress").length;
  const avgProgress = visibleTasks.length
    ? Math.round(visibleTasks.reduce((s, t) => s + t.progress, 0) / visibleTasks.length)
    : 0;

  const myActiveTasks = myTasks.filter(t => t.status !== "completed");
  const myLateTasks   = myTasks.filter(t => t.status === "late");

  const canViewAll = hasPermission(profile, "canViewAllTasks");

  const statCards = [
    {
      label: canViewAll ? "إجمالي المهام" : "مهامي",
      value: visibleTasks.length,
      icon:  CheckSquare,
      color: "from-primary-400 to-primary-600",
      sub:   `${allDone} مكتملة`,
    },
    {
      label: "قيد التنفيذ",
      value: allActive,
      icon:  RotateCcw,
      color: "from-blue-400 to-blue-600",
      sub:   "نشطة الآن",
    },
    {
      label: "مكتملة",
      value: allDone,
      icon:  CheckCircle2,
      color: "from-sky-400 to-sky-600",
      sub:   `نسبة ${visibleTasks.length ? Math.round((allDone/visibleTasks.length)*100) : 0}%`,
    },
    {
      label: "متأخرة",
      value: allLate,
      icon:  AlertTriangle,
      color: "from-red-400 to-red-600",
      sub:   allLate > 0 ? "تحتاج متابعة عاجلة" : "لا يوجد تأخير",
    },
  ];

  const recentTasks = [...visibleTasks].slice(0, 4);

  const statusBreakdown = (["created","in_progress","review","completed","late"] as const).map(s => ({
    status: s,
    count:  visibleTasks.filter(t => t.status === s).length,
    pct:    visibleTasks.length ? Math.round((visibleTasks.filter(t=>t.status===s).length / visibleTasks.length)*100) : 0,
  }));

  return (
    <div>
      {/* ── Welcome ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{ROLE_EMOJI[profile.role]}</span>
          <div>
            <h1 className="text-3xl font-black text-primary-700">
              أهلاً، {profile.name}
            </h1>
            <p className="text-gray-400 mt-0.5">
              {ROLE_LABELS[profile.role]} —{" "}
              {new Date().toLocaleDateString("ar-SA", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
        </div>

        {/* My tasks quick bar */}
        {myActiveTasks.length > 0 && (
          <div className="mt-4 bg-primary-50 border border-primary-100 rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="relative">
              <MiniCircle pct={avgProgress} color="#3B5BA0" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-primary-700">
                {avgProgress}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-primary-700 text-sm">
                لديك {myActiveTasks.length} مهام نشطة مُسندة إليك
              </p>
              <p className="text-xs text-primary-400 mt-0.5">
                {myLateTasks.length > 0
                  ? `⚠️ ${myLateTasks.length} مهمة متأخرة تحتاج اهتماماً`
                  : "أنت على المسار الصحيح 🎯"}
              </p>
            </div>
            <Link href="/dashboard/tasks" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              عرض المهام <ChevronLeft size={14}/>
            </Link>
          </div>
        )}

        {visibleTasks.length === 0 && (
          <div className="mt-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-center text-gray-400">
            <p className="text-sm">لا توجد مهام مُسندة إليك حالياً</p>
          </div>
        )}
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-md`}>
              <s.icon size={22} className="text-white" />
            </div>
            <p className="text-3xl font-black text-gray-800 mb-1">{s.value}</p>
            <p className="text-sm font-semibold text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Two-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Tasks */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-primary-50 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary-500"/>
              <h2 className="text-lg font-bold text-primary-700">
                {canViewAll ? "آخر المهام" : "مهامي الأخيرة"}
              </h2>
            </div>
            <Link href="/dashboard/tasks"
              className="text-sm font-semibold text-primary-500 hover:text-primary-700 flex items-center gap-1 transition-colors">
              عرض الكل <ChevronLeft size={14}/>
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">لا توجد مهام بعد</p>
            )}
            {recentTasks.map((t, i) => (
              <motion.div key={t.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="relative flex-shrink-0">
                  <MiniCircle pct={t.progress} color={STATUS_PROGRESS[t.status]} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black"
                    style={{ color:STATUS_PROGRESS[t.status] }}>
                    {t.progress}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800 text-sm truncate">{t.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${PRIORITY_COLORS[t.priority]}`}>
                      {PRIORITY_LABELS[t.priority]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{t.assignedToName}</span>
                    <span className={`flex items-center gap-1 text-xs ${STATUS_COLORS[t.status]} px-2 py-0.5 rounded-full font-semibold`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`}/>
                      {STATUS_LABELS[t.status]}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-semibold ${new Date(t.dueDate)<new Date()&&t.status!=="completed"?"text-red-500":"text-gray-400"}`}>
                    {new Date(t.dueDate).toLocaleDateString("ar-SA",{month:"short",day:"numeric"})}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Status breakdown + quick links */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="bg-white rounded-2xl shadow-sm border border-primary-50 p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-primary-500"/>
            <h2 className="text-lg font-bold text-primary-700">توزيع المهام</h2>
          </div>

          {/* Big circle */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg width={100} height={100} className="rotate-[-90deg]">
                <circle cx={50} cy={50} r={40} fill="none" stroke="#E2E8F0" strokeWidth={8} />
                <circle cx={50} cy={50} r={40} fill="none" stroke="#3B5BA0" strokeWidth={8}
                  strokeDasharray={`${(avgProgress/100)*2*Math.PI*40} ${2*Math.PI*40}`}
                  strokeLinecap="round"
                  style={{ transition:"stroke-dasharray 1s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-primary-700">{avgProgress}%</span>
                <span className="text-xs text-gray-400">متوسط</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {statusBreakdown.map(({ status, count, pct }) => (
              <div key={status} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`}/>
                <span className="text-xs text-gray-600 flex-1">{STATUS_LABELS[status]}</span>
                <span className="text-xs font-bold text-gray-500">{count}</span>
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${pct}%`, background:STATUS_PROGRESS[status] }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links (role-sensitive) */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <Link href="/dashboard/tasks"
              className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors py-1">
              <CheckSquare size={15}/> إدارة المهام <ChevronLeft size={13} className="mr-auto"/>
            </Link>
            {hasPermission(profile, "canManageUsers") && (
              <Link href="/dashboard/users"
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors py-1">
                <Users size={15}/> إدارة المستخدمين <ChevronLeft size={13} className="mr-auto"/>
              </Link>
            )}
            {hasPermission(profile, "canViewAuditLog") && (
              <Link href="/dashboard/audit"
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors py-1">
                <ShieldCheck size={15}/> سجل العمليات <ChevronLeft size={13} className="mr-auto"/>
              </Link>
            )}
            {hasPermission(profile, "canViewFinance") && (
              <Link href="/dashboard/finance"
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors py-1">
                <TrendingUp size={15}/> الشؤون المالية <ChevronLeft size={13} className="mr-auto"/>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
