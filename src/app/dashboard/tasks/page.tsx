"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Save, Search, Filter, Calendar,
  User, Flag, Trash2, Edit3, Clock,
  CheckCircle2, AlertCircle, Circle, RotateCcw, Eye,
  StickyNote, History, Lock, BellRing, Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  useTasks, Task, TaskStatus, TaskPriority,
  STATUS_LABELS, STATUS_COLORS, STATUS_DOT, STATUS_PROGRESS,
  PRIORITY_LABELS, PRIORITY_COLORS,
} from "@/lib/tasks-context";
import { hasPermission, ROLE_LABELS } from "@/lib/roles";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

// ── Circular Progress ─────────────────────────────────────────────────────────
function CircleProgress({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${(pct/100)*c} ${c-(pct/100)*c}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

// ── Status Icon ───────────────────────────────────────────────────────────────
function StatusIcon({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, React.ReactNode> = {
    created:     <Circle size={16} className="text-slate-400" />,
    in_progress: <RotateCcw size={16} className="text-blue-500 animate-spin" style={{ animationDuration:"3s" }} />,
    review:      <Eye size={16} className="text-amber-500" />,
    completed:   <CheckCircle2 size={16} className="text-sky-500" />,
    late:        <AlertCircle size={16} className="text-red-500" />,
  };
  return <>{map[status]}</>;
}

// ── Progress Steps (delivery tracker style) ───────────────────────────────────
// ── Progress Steps (Ticket tracker style) ───────────────────────────────────
const STEPS: { id: TaskStatus, label: string }[] = [
  { id: "created", label: "تم الإنشاء" },
  { id: "in_progress", label: "قيد التنفيذ" },
  { id: "review", label: "المراجعة" },
  { id: "completed", label: "مكتمل" }
];
function ProgressSteps({ status, isModal = false }: { status: TaskStatus, isModal?: boolean }) {
  const idx = status === "late" ? 1 : STEPS.findIndex(s => s.id === status);
  return (
    <div className="flex items-center w-full mx-auto" style={{ maxWidth: isModal ? "100%" : "220px" }}>
      {STEPS.map((step, i) => {
        const done   = i <= idx;
        const color  = done ? "#10B981" : "#E2E8F0"; // Emerald for passed
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 relative z-10 w-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500"
                style={{
                  background: done ? "#10B981" : "#fff",
                  boxShadow: done ? "0 0 0 2px #10B981" : "inset 0 0 0 2px #CBD5E1"
                }} />
              <span className="text-[10px] whitespace-nowrap absolute top-4 font-bold"
                style={{ color: done ? "#10B981" : "#94A3B8" }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-[-2px] transition-all duration-500"
                style={{ background: i < idx ? "#10B981" : "#E2E8F0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Task Card (Kanban) ────────────────────────────────────────────────────────
function TaskCard({
  task, canAssign, isOwner,
  onView, onEdit, onDelete,
}: {
  task: Task;
  canAssign: boolean;
  isOwner: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isLate = new Date(task.dueDate) < new Date() && task.status !== "completed";
  return (
    <motion.div layout variants={fadeUp} initial="hidden" animate="visible"
      whileHover={{ y: -2, boxShadow:"0 8px 24px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer"
      onClick={onView}>
      {/* Priority + status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <StatusIcon status={task.status} />
      </div>

      <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{task.title}</h3>
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">التقدم</span>
          <span className="font-bold" style={{ color: STATUS_PROGRESS[task.status] }}>
            {task.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width:`${task.progress}%`, background:STATUS_PROGRESS[task.status] }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
            {task.assignedToName.charAt(0)}
          </div>
          <span className="text-xs text-gray-500 truncate max-w-20">{task.assignedToName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${isLate?"text-red-500":"text-gray-400"}`}>
            {new Date(task.dueDate).toLocaleDateString("ar-SA",{month:"short",day:"numeric"})}
          </span>
          {(canAssign || isOwner) && (
            <button onClick={e=>{e.stopPropagation();onEdit();}}
              className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-primary-100 flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors">
              <Edit3 size={11}/>
            </button>
          )}
          {canAssign && (
            <button onClick={e=>{e.stopPropagation();onDelete();}}
              className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={11}/>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TasksPage() {
  const { profile, allUsers } = useAuth();
  const { getVisibleTasks, addTask, updateTask, deleteTask, updateProgress, updateStatus } = useTasks();

  const [view,      setView]      = useState<"board"|"list">("list");
  const [search,    setSearch]    = useState("");
  const [filterPri, setFilterPri] = useState<TaskPriority|"all">("all");
  const [filterSt,  setFilterSt]  = useState<TaskStatus|"all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editId,    setEditId]    = useState<string|null>(null);
  const [detailId,  setDetailId]  = useState<string|null>(null);
  const [showLog,   setShowLog]   = useState(false);
  const [isCronRunning, setIsCronRunning] = useState(false);
  const [cronDone, setCronDone] = useState(false);

  const emptyForm = () => ({
    title: "", description: "", notes: "",
    assignedTo: allUsers[0]?.uid || "u1",
    assignedToName: allUsers[0]?.name || "",
    dueDate: "",
    priority: "medium" as TaskPriority,
    status:   "created" as TaskStatus,
    progress: 0,
    tags: [] as string[],
    attachments: [] as string[],
  });

  const [form, setForm] = useState(emptyForm);

  if (!profile) return null;

  const canAssign  = hasPermission(profile, "canAssignTasks");
  const canDelete  = hasPermission(profile, "canDeleteTasks");

  // Visible tasks (RBAC filtered)
  const visibleTasks = getVisibleTasks(profile);

  const filtered = useMemo(() => visibleTasks.filter(t => {
    const matchSearch = t.title.includes(search) || t.assignedToName.includes(search);
    const matchPri    = filterPri === "all" || t.priority === filterPri;
    const matchSt     = filterSt  === "all" || t.status   === filterSt;
    return matchSearch && matchPri && matchSt;
  }), [visibleTasks, search, filterPri, filterSt]);

  const stats = {
    total:       visibleTasks.length,
    in_progress: visibleTasks.filter(t => t.status === "in_progress").length,
    completed:   visibleTasks.filter(t => t.status === "completed").length,
    late:        visibleTasks.filter(t => t.status === "late").length,
  };

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setShowModal(true);
  };
  const openEdit = (t: Task) => {
    setEditId(t.id);
    setForm({
      title: t.title, description: t.description, notes: t.notes || "",
      assignedTo: t.assignedTo, assignedToName: t.assignedToName,
      dueDate: t.dueDate.slice(0, 10),
      priority: t.priority, status: t.status, progress: t.progress,
      tags: t.tags, attachments: t.attachments,
    });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.title || !form.dueDate) return;
    const member = allUsers.find(u => u.uid === form.assignedTo);
    const payload = {
      ...form,
      assignedToName: member?.name || form.assignedToName,
      assignedBy:     profile.uid,
      assignedByName: profile.name,
      assignedByRole: profile.role,
      dueDate:        new Date(form.dueDate).toISOString(),
    };
    if (editId) updateTask(editId, payload, profile);
    else        addTask(payload, profile);
    setShowModal(false);
  };

  const triggerReminders = async () => {
    setIsCronRunning(true);
    try {
      await fetch("/api/tasks/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: visibleTasks, users: allUsers }),
      });
      setCronDone(true);
      setTimeout(() => setCronDone(false), 3000);
    } catch (err) {
      console.error("Cron trigger failed:", err);
    } finally {
      setIsCronRunning(false);
    }
  };

  const detailTask = visibleTasks.find(t => t.id === detailId);

  // Kanban
  const COLS: TaskStatus[] = ["created","in_progress","review","completed","late"];
  const colMeta: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    created:     { label:"تم الإنشاء",   color:"#64748B", bg:"#F8FAFC" },
    in_progress: { label:"قيد التنفيذ",  color:"#3B82F6", bg:"#EFF6FF" },
    review:      { label:"قيد المراجعة", color:"#F59E0B", bg:"#FFFBEB" },
    completed:   { label:"مكتملة",       color:"#10B981", bg:"#ECFDF5" },
    late:        { label:"متأخرة",        color:"#EF4444", bg:"#FEF2F2" },
  };

  return (
    <div>
      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700">إدارة المهام</h1>
          <p className="text-gray-400 mt-1">
            {canAssign
              ? "رؤية وإدارة جميع مهام الفريق"
              : "مهامك الشخصية المُسندة إليك"}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          {canAssign && (
            <button
              onClick={triggerReminders}
              disabled={isCronRunning}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                cronDone
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-white border-primary-100 text-primary-600 hover:bg-primary-50"
              }`}
            >
              {isCronRunning ? <Loader2 size={18} className="animate-spin" /> : <BellRing size={18} />}
              {cronDone ? "تم إرسال التنبيهات!" : "فحص المواعيد"}
            </button>
          )}
          {canAssign && (
            <button onClick={openAdd} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> مهمة جديدة
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label:"إجمالي المهام", value:stats.total,       color:"from-primary-400 to-primary-600" },
          { label:"قيد التنفيذ",   value:stats.in_progress, color:"from-blue-400 to-blue-600" },
          { label:"مكتملة",        value:stats.completed,   color:"from-sky-400 to-sky-600" },
          { label:"متأخرة",        value:stats.late,        color:"from-red-400 to-red-600" },
        ].map((s,i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-primary-50 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md flex-shrink-0`}>
              <span className="text-2xl font-black text-white">{s.value}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Filters ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="بحث في المهام..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="relative">
          <Flag size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filterPri} onChange={e=>setFilterPri(e.target.value as TaskPriority|"all")}
            className="pr-8 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none appearance-none cursor-pointer">
            <option value="all">كل الأولويات</option>
            {(Object.entries(PRIORITY_LABELS) as [TaskPriority,string][]).map(([k,v])=>(
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filterSt} onChange={e=>setFilterSt(e.target.value as TaskStatus|"all")}
            className="pr-8 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none appearance-none cursor-pointer">
            <option value="all">كل الحالات</option>
            {(Object.entries(STATUS_LABELS) as [TaskStatus,string][]).map(([k,v])=>(
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white mr-auto">
          <button onClick={()=>setView("board")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${view==="board"?"bg-primary-500 text-white":"text-gray-500 hover:bg-gray-50"}`}>
            لوحة
          </button>
          <button onClick={()=>setView("list")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${view==="list"?"bg-primary-500 text-white":"text-gray-500 hover:bg-gray-50"}`}>
            قائمة
          </button>
        </div>
      </motion.div>

      {/* ── BOARD VIEW ── */}
      {view === "board" && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {COLS.map(col => {
            const ct   = filtered.filter(t => t.status === col);
            const meta = colMeta[col];
            return (
              <div key={col} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`w-3 h-3 rounded-full ${STATUS_DOT[col]}`} />
                  <span className="font-bold text-sm text-gray-700">{meta.label}</span>
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background:meta.bg, color:meta.color }}>
                    {ct.length}
                  </span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {ct.map(t => (
                      <TaskCard key={t.id} task={t}
                        canAssign={canAssign}
                        isOwner={t.assignedTo === profile.uid || t.assignedBy === profile.uid}
                        onView={() => setDetailId(t.id)}
                        onEdit={() => openEdit(t)}
                        onDelete={() => deleteTask(t.id, profile)}
                      />
                    ))}
                  </AnimatePresence>
                  {ct.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center text-gray-300 text-xs">
                      لا توجد مهام
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100 bg-white">
                <th className="text-right px-4 py-4 font-bold text-gray-400 text-xs tracking-wider">#</th>
                <th className="text-right px-4 py-4 font-bold text-gray-400 text-xs tracking-wider">النشاط (المهمة)</th>
                <th className="text-right px-4 py-4 font-bold text-gray-400 text-xs tracking-wider">الأولوية</th>
                <th className="text-right px-4 py-4 font-bold text-gray-400 text-xs tracking-wider">الحالة</th>
                <th className="text-center px-4 py-4 font-bold text-gray-400 text-xs tracking-wider w-64">مسار المهمة</th>
                <th className="text-right px-4 py-4 font-bold text-gray-400 text-xs tracking-wider">المُسند إليه</th>
                <th className="text-right px-4 py-4 font-bold text-gray-400 text-xs tracking-wider">ملاحظات والتحديثات</th>
                <th className="px-3 py-4 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filtered.map((t, index) => {
                  const isOwner = t.assignedTo === profile.uid || t.assignedBy === profile.uid;
                  return (
                    <motion.tr key={t.id} layout
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer bg-white group"
                      onClick={() => setDetailId(t.id)}>
                      <td className="px-4 py-5 text-gray-500 font-mono text-xs">{filtered.length - index}</td>
                      <td className="px-4 py-5 font-bold text-gray-800 truncate max-w-48">{t.title}</td>
                      <td className="px-4 py-5">
                        <span className={`text-[10px] px-2.5 py-1 rounded-sm font-bold ${PRIORITY_COLORS[t.priority]} bg-transparent border-none`}>
                          • {PRIORITY_LABELS[t.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`flex items-center gap-1.5 text-[10px] ${STATUS_COLORS[t.status]} px-2.5 py-1 rounded-sm font-bold w-fit bg-transparent`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`}/>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex justify-center pb-5 pt-1">
                          <ProgressSteps status={t.status} />
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="font-semibold text-gray-600 text-xs">{t.assignedToName}</span>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-[11px] text-gray-500 line-clamp-1 max-w-48 leading-relaxed">
                          {t.updateLog.length > 0 ? t.updateLog[t.updateLog.length - 1].newValue : t.description || "—"}
                        </p>
                      </td>
                      <td className="px-3 py-5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e=>e.stopPropagation()}>
                          {(canAssign || isOwner) && (
                            <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-primary-600 transition-colors"><Edit3 size={14}/></button>
                          )}
                          {canDelete && (
                            <button onClick={() => deleteTask(t.id, profile)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Lock size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="font-semibold">لا توجد مهام مرئية</p>
              <p className="text-xs mt-1">يمكنك رؤية المهام المُسندة إليك فقط</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {detailTask && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setDetailId(null); setShowLog(false); }}>
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.92, opacity:0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="p-7 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_COLORS[detailTask.priority]}`}>
                        {PRIORITY_LABELS[detailTask.priority]}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${STATUS_COLORS[detailTask.status]} px-2 py-0.5 rounded-full font-semibold`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[detailTask.status]}`}/>
                        {STATUS_LABELS[detailTask.status]}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900">{detailTask.title}</h3>
                    {detailTask.description && (
                      <p className="text-sm text-gray-500 mt-2">{detailTask.description}</p>
                    )}
                  </div>
                  <button onClick={() => { setDetailId(null); setShowLog(false); }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <X size={22}/>
                  </button>
                </div>
              </div>

              {/* Circle + Steps */}
              <div className="px-7 pt-6 pb-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative flex-shrink-0">
                    <CircleProgress pct={detailTask.progress} color={STATUS_PROGRESS[detailTask.status]} size={80} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black" style={{ color:STATUS_PROGRESS[detailTask.status] }}>
                        {detailTask.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pb-6">
                    <ProgressSteps status={detailTask.status} isModal={true} />
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User size={11}/>مُسند إلى</p>
                    <p className="font-bold text-gray-700">{detailTask.assignedToName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar size={11}/>تاريخ التسليم</p>
                    <p className={`font-bold ${new Date(detailTask.dueDate)<new Date()&&detailTask.status!=="completed"?"text-red-500":"text-gray-700"}`}>
                      {new Date(detailTask.dueDate).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User size={11}/>أُسندت من</p>
                    <p className="font-bold text-gray-700">{detailTask.assignedByName}</p>
                    <p className="text-xs text-gray-400">{ROLE_LABELS[detailTask.assignedByRole]}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={11}/>تاريخ الإنشاء</p>
                    <p className="font-bold text-gray-700">
                      {new Date(detailTask.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>

                {detailTask.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5">
                    <p className="text-xs text-amber-700 font-semibold flex items-center gap-1 mb-1">
                      <StickyNote size={12}/> ملاحظات
                    </p>
                    <p className="text-sm text-amber-800">{detailTask.notes}</p>
                  </div>
                )}

                {/* Quick progress (only if user is assignee or admin) */}
                {(detailTask.assignedTo === profile.uid || canAssign) && detailTask.status !== "completed" && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 mb-2">تحديث التقدم السريع</p>
                    <input type="range" min={0} max={100} value={detailTask.progress}
                      onChange={e => updateProgress(detailTask.id, Number(e.target.value), profile)}
                      className="w-full accent-primary-500" />
                  </div>
                )}

                {/* Quick status buttons (only if user is assignee or admin) */}
                {(detailTask.assignedTo === profile.uid || canAssign) && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(["in_progress","review","completed"] as TaskStatus[]).map(s => (
                      <button key={s} onClick={() => updateStatus(detailTask.id, s, profile)}
                        disabled={detailTask.status === s}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${STATUS_COLORS[s]}`}>
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                )}

                {/* Update Log */}
                <div>
                  <button onClick={() => setShowLog(!showLog)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors mb-3">
                    <History size={15}/>
                    سجل التحديثات ({detailTask.updateLog.length})
                    <span className={`text-xs transition-transform ${showLog?"rotate-180":""}`}>▼</span>
                  </button>
                  {showLog && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[...detailTask.updateLog].reverse().map(entry => (
                        <div key={entry.id}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-xs">
                          <div className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center font-bold text-primary-700 flex-shrink-0">
                            {entry.actorName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-gray-700">{entry.actorName}</span>
                            {" "}غيّر{" "}
                            <span className="font-semibold text-primary-600">{entry.field}</span>
                            {entry.oldValue && (
                              <> من <span className="line-through text-gray-400">{entry.oldValue}</span></>
                            )}
                            {" "}إلى{" "}
                            <span className="font-bold text-gray-800">{entry.newValue}</span>
                          </div>
                          <span className="text-gray-400 flex-shrink-0">
                            {new Date(entry.timestamp).toLocaleDateString("ar-SA",{month:"short",day:"numeric"})}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-7 pb-7 flex gap-3">
                {(detailTask.assignedTo === profile.uid || canAssign) && (
                  <button onClick={() => { setDetailId(null); openEdit(detailTask); }}
                    className="flex-1 btn-primary flex items-center justify-center gap-2">
                    <Edit3 size={15}/> تعديل المهمة
                  </button>
                )}
                <button onClick={() => { setDetailId(null); setShowLog(false); }} className="flex-1 btn-outline">
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create/Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.92, opacity:0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-gray-100">
                <h2 className="text-xl font-black text-primary-700">
                  {editId ? "تعديل المهمة" : "إنشاء مهمة جديدة"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24}/>
                </button>
              </div>

              <div className="p-8 space-y-5">
                {/* Title */}
                <div>
                  <label className="label">عنوان المهمة *</label>
                  <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                    placeholder="أدخل عنوان المهمة..." className="input"/>
                </div>

                {/* Description */}
                <div>
                  <label className="label">الوصف</label>
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                    placeholder="وصف تفصيلي للمهمة..." rows={3} className="input resize-none"/>
                </div>

                {/* Assignee (only admins can assign) */}
                {canAssign && (
                  <div>
                    <label className="label flex items-center gap-1"><User size={13}/> المُسند إليه *</label>
                    <select value={form.assignedTo}
                      onChange={e => {
                        const u = allUsers.find(u => u.uid === e.target.value);
                        setForm({ ...form, assignedTo: e.target.value, assignedToName: u?.name || "" });
                      }}
                      className="input">
                      {allUsers.filter(u => u.status === "active").map(u => (
                        <option key={u.uid} value={u.uid}>
                          {u.name} — {ROLE_LABELS[u.role]}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Priority + Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label flex items-center gap-1"><Flag size={13}/> الأولوية</label>
                    <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value as TaskPriority})}
                      className="input">
                      {(Object.entries(PRIORITY_LABELS) as [TaskPriority,string][]).map(([k,v])=>(
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label flex items-center gap-1"><Calendar size={13}/> تاريخ التسليم *</label>
                    <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}
                      className="input" dir="ltr"/>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="label flex items-center gap-1"><StickyNote size={13}/> ملاحظات</label>
                  <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
                    placeholder="أي ملاحظات إضافية..." rows={2} className="input resize-none"/>
                </div>

                {/* Progress + Status (edit only) */}
                {editId && (
                  <>
                    <div>
                      <label className="label">نسبة الإنجاز: {form.progress}%</label>
                      <input type="range" min={0} max={100} value={form.progress}
                        onChange={e=>setForm({...form,progress:Number(e.target.value)})}
                        className="w-full accent-primary-500"/>
                    </div>
                    <div>
                      <label className="label">الحالة</label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(STATUS_LABELS) as TaskStatus[]).map(s => (
                          <button key={s} type="button"
                            onClick={() => setForm({...form, status:s})}
                            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all border-2 ${
                              form.status === s
                                ? "border-primary-500 " + STATUS_COLORS[s]
                                : "border-transparent " + STATUS_COLORS[s] + " opacity-60"
                            }`}>
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="px-8 pb-8 flex gap-3">
                <button onClick={handleSave} disabled={!form.title || !form.dueDate}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save size={16}/> {editId ? "تحديث المهمة" : "إنشاء المهمة"}
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
