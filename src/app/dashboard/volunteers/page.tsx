"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit3, Archive, Search, X, Save,
  Users, Clock, MapPin, Phone, Mail, ChevronDown,
  HeartHandshake, Lock, Hash, FileText, Star,
  CalendarDays, CheckCircle2, XCircle, AlertCircle,
  TrendingUp, Award, Bell,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/roles";
import { useVolunteerApplications } from "@/lib/volunteer-applications-context";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

type VolunteerStatus = "نشط" | "مؤرشف";
type ApplicationStatus = "قيد المراجعة" | "مقبول" | "مرفوض";

interface Volunteer {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  location: string;
  program: string;
  hours: number;
  joinDate: string;
  status: VolunteerStatus;
  notes: string;
}

interface Application {
  id: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  date: string;
  status: ApplicationStatus;
}

interface VolunteerEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  program: string;
  spots: number;
  registered: number;
  description: string;
}

const INITIAL: Volunteer[] = [
  {
    id: "1", name: "أحمد الدوسري", nationalId: "1056781234",
    phone: "0501234567", email: "ahmed@example.com",
    location: "الرياض — مركز الملك عبدالعزيز",
    program: "برنامج القيادة الشبابية",
    hours: 45, joinDate: "2024-01-15", status: "نشط",
    notes: "متحمس، يُفضّل العمل الميداني",
  },
  {
    id: "2", name: "سارة المطيري", nationalId: "1072345678",
    phone: "0557654321", email: "sara@example.com",
    location: "جدة — مدرسة الأمل",
    program: "برنامج ريادة الأعمال",
    hours: 120, joinDate: "2024-02-10", status: "نشط",
    notes: "",
  },
  {
    id: "3", name: "محمد الغامدي", nationalId: "1048765432",
    phone: "0509876543", email: "mohammed@example.com",
    location: "الدمام — مركز التدريب",
    program: "الدعم الفني والتقني",
    hours: 8, joinDate: "2023-11-20", status: "مؤرشف",
    notes: "انقطع بسبب ظروف دراسية",
  },
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "a1", name: "نورة القحطاني", phone: "0551234567",
    email: "noura@example.com", program: "برنامج القيادة الشبابية",
    message: "أرغب في المشاركة في برامج التوعية المجتمعية وتنمية مهاراتي القيادية.",
    date: "2026-04-22", status: "قيد المراجعة",
  },
  {
    id: "a2", name: "فيصل الدوسري", phone: "0509876543",
    email: "faisal@example.com", program: "الدعم الفني والتقني",
    message: "لدي خبرة في البرمجة وأريد المساهمة في دعم المبادرات التقنية.",
    date: "2026-04-20", status: "قيد المراجعة",
  },
  {
    id: "a3", name: "منال الشهري", phone: "0567891234",
    email: "manal@example.com", program: "برنامج ريادة الأعمال",
    message: "خريجة إدارة أعمال وأريد دعم رواد الأعمال الشباب.",
    date: "2026-04-18", status: "مقبول",
  },
  {
    id: "a4", name: "خالد الزهراني", phone: "0512345678",
    email: "khalid@example.com", program: "التوعية المجتمعية",
    message: "أحب العمل التطوعي وأريد المساهمة في مجتمعي.",
    date: "2026-04-15", status: "مرفوض",
  },
];

const INITIAL_EVENTS: VolunteerEvent[] = [
  {
    id: "e1",
    title: "يوم التطوع الوطني",
    date: "2026-05-10",
    location: "الرياض — حديقة الملك عبدالله",
    program: "الفعاليات والأنشطة",
    spots: 50, registered: 32,
    description: "فعالية تطوعية كبرى بمناسبة يوم التطوع الوطني — توزيع هدايا وأنشطة ترفيهية.",
  },
  {
    id: "e2",
    title: "ورشة القيادة الشبابية",
    date: "2026-05-18",
    location: "جدة — مركز الأعمال",
    program: "برنامج القيادة الشبابية",
    spots: 20, registered: 15,
    description: "ورشة عمل تدريبية لتطوير مهارات القيادة لدى الشباب.",
  },
  {
    id: "e3",
    title: "زيارة مراكز رعاية الأطفال",
    date: "2026-06-01",
    location: "الدمام — مركز الأمل",
    program: "التوعية المجتمعية",
    spots: 15, registered: 7,
    description: "زيارة ميدانية لدعم الأطفال في مراكز الرعاية الاجتماعية.",
  },
];

const emptyForm: Omit<Volunteer, "id" | "status"> = {
  name: "", nationalId: "", phone: "", email: "",
  location: "", program: "", hours: 0,
  joinDate: new Date().toISOString().split("T")[0], notes: "",
};

const PROGRAMS = [
  "برنامج القيادة الشبابية",
  "برنامج ريادة الأعمال",
  "الدعم الفني والتقني",
  "برنامج التوجيه المهني",
  "الفعاليات والأنشطة",
  "التوعية المجتمعية",
  "أخرى",
];

const APP_STATUS_CONFIG: Record<ApplicationStatus, { color: string; icon: typeof CheckCircle2; bg: string }> = {
  "قيد المراجعة": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: AlertCircle },
  "مقبول":        { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  "مرفوض":        { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function VolunteersPage() {
  const { profile } = useAuth();

  const { applications, updateStatus, pendingCount: ctxPending } = useVolunteerApplications();
  const [tab, setTab] = useState<"volunteers" | "applications" | "events">("volunteers");
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL);
  const [events]                    = useState<VolunteerEvent[]>(INITIAL_EVENTS);
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilter]         = useState<VolunteerStatus | "الكل">("الكل");
  const [filterProgram, setProgram]       = useState("الكل");
  const [showModal, setShowModal]         = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [form, setForm]                   = useState<Omit<Volunteer, "id" | "status">>(emptyForm);
  const [detailId, setDetailId]           = useState<string | null>(null);
  const [saving, setSaving]               = useState(false);
  const [selectedApp, setSelectedApp]     = useState<Application | null>(null);

  if (!profile || !hasPermission(profile, "canManageVolunteers")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
        </div>
      </div>
    );
  }

  const totalHours    = volunteers.reduce((s, v) => s + v.hours, 0);
  const activeCount   = volunteers.filter(v => v.status === "نشط").length;
  const pendingApps   = ctxPending;

  const allPrograms = ["الكل", ...Array.from(new Set(volunteers.map(v => v.program).filter(Boolean)))];

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase();
    const matchSearch  = !q || v.name.includes(q) || v.phone.includes(q) || v.location.includes(q) || v.program.includes(q);
    const matchStatus  = filterStatus === "الكل" || v.status === filterStatus;
    const matchProgram = filterProgram === "الكل" || v.program === filterProgram;
    return matchSearch && matchStatus && matchProgram;
  });

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = (id: string) => {
    const v = volunteers.find(x => x.id === id);
    if (!v) return;
    setEditingId(id);
    const { status: _s, id: _id, ...rest } = v;
    setForm(rest);
    setDetailId(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editingId) {
      setVolunteers(prev => prev.map(v => v.id === editingId ? { ...v, ...form } : v));
    } else {
      setVolunteers(prev => [{ id: `v-${Date.now()}`, ...form, status: "نشط" }, ...prev]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleArchive = (id: string) => {
    setVolunteers(prev => prev.map(v =>
      v.id === id ? { ...v, status: v.status === "نشط" ? "مؤرشف" : "نشط" } : v
    ));
  };

  const handleAppStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null);
  };

  const detailV = volunteers.find(v => v.id === detailId);

  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return diff;
  };

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-primary-700 flex items-center gap-3">
            <HeartHandshake size={28} className="text-emerald-500"/> إدارة المتطوعين
          </h1>
          <p className="text-gray-400 mt-1 text-sm">تسجيل المتطوعين، مراجعة الطلبات، ومتابعة الفعاليات</p>
        </div>
        <div className="flex items-center gap-3 self-start">
          {pendingApps > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-sm font-bold px-3 py-2 rounded-xl border border-amber-200">
              <Bell size={15}/> {pendingApps} طلب جديد
            </div>
          )}
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={18}/> تسجيل متطوع جديد
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "إجمالي المتطوعين", value: volunteers.length,   icon: Users,       color: "text-emerald-600 bg-emerald-50" },
          { label: "المتطوعون النشطون", value: activeCount,         icon: Star,        color: "text-sky-600 bg-sky-50" },
          { label: "إجمالي ساعات التطوع", value: `${totalHours} ساعة`, icon: Clock,   color: "text-amber-600 bg-amber-50" },
          { label: "طلبات قيد المراجعة", value: pendingApps,       icon: TrendingUp,  color: "text-purple-600 bg-purple-50" },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-primary-50 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={22}/>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 w-fit">
        {[
          { key: "volunteers",   label: "المتطوعون",       count: volunteers.length },
          { key: "applications", label: "طلبات التطوع",    count: pendingApps, badge: true },
          { key: "events",       label: "الفعاليات القادمة", count: events.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              tab === t.key ? "bg-white text-primary-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.key
                ? t.badge && t.count > 0 ? "bg-amber-100 text-amber-700" : "bg-primary-100 text-primary-600"
                : "bg-gray-200 text-gray-500"
            }`}>{t.count}</span>
          </button>
        ))}
      </motion.div>

      {/* ── Tab: المتطوعون ── */}
      {tab === "volunteers" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="بحث بالاسم، الجوال، المكان..."
                className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"/>
            </div>
            <div className="relative">
              <select value={filterStatus} onChange={e => setFilter(e.target.value as VolunteerStatus | "الكل")}
                className="appearance-none pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                {["الكل", "نشط", "مؤرشف"].map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
            <div className="relative">
              <select value={filterProgram} onChange={e => setProgram(e.target.value)}
                className="appearance-none pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none max-w-52">
                {allPrograms.map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((v, i) => (
                <motion.div key={v.id} layout variants={fadeUp} initial="hidden" animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }} custom={i}
                  className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${
                    v.status === "مؤرشف" ? "opacity-60 border-gray-200" : "border-emerald-100"
                  }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{v.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Phone size={10}/> {v.phone}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      v.status === "نشط" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>{v.status}</span>
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-gray-400 flex-shrink-0"/>
                      <span className="truncate">{v.location || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartHandshake size={12} className="text-gray-400 flex-shrink-0"/>
                      <span className="truncate">{v.program || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-amber-500 flex-shrink-0"/>
                      <span className="font-bold text-amber-600">{v.hours} ساعة تطوع</span>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-50 pt-4">
                    <button onClick={() => setDetailId(v.id)}
                      className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors">
                      عرض الملف
                    </button>
                    <button onClick={() => openEdit(v.id)}
                      className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                      <Edit3 size={14}/>
                    </button>
                    <button onClick={() => handleArchive(v.id)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        v.status === "نشط"
                          ? "bg-amber-50 text-amber-500 hover:bg-amber-100"
                          : "bg-sky-50 text-sky-500 hover:bg-sky-100"
                      }`}>
                      <Archive size={14}/>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <Users size={48} className="mx-auto mb-4 text-gray-200"/>
                لا يوجد متطوعون مطابقون
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Tab: طلبات التطوع ── */}
      {tab === "applications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-3">
            <h2 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary-500"/> الطلبات الواردة ({applications.length})
            </h2>
            {applications.map((app, i) => {
              const cfg = APP_STATUS_CONFIG[app.status];
              const Icon = cfg.icon;
              return (
                <motion.div key={app.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-white rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all ${
                    selectedApp?.id === app.id ? "border-primary-300 ring-2 ring-primary-100" : "border-gray-100"
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{app.name}</p>
                        <p className="text-xs text-gray-400">{app.program}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      <Icon size={11}/> {app.status}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{app.message}</p>
                  <p className="text-[10px] text-gray-300 mt-2">{new Date(app.date).toLocaleDateString("ar-SA")}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Detail */}
          <div className="sticky top-4">
            {selectedApp ? (
              <motion.div key={selectedApp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      APP_STATUS_CONFIG[selectedApp.status].bg
                    } ${APP_STATUS_CONFIG[selectedApp.status].color}`}>
                      {selectedApp.status}
                    </span>
                    <button onClick={() => setSelectedApp(null)} className="text-white/60 hover:text-white">
                      <X size={18}/>
                    </button>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-2xl mb-3">
                    {selectedApp.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-black">{selectedApp.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{selectedApp.program}</p>
                </div>

                <div className="p-6 space-y-3">
                  {[
                    { icon: Phone, label: "رقم الجوال",        value: selectedApp.phone },
                    { icon: Mail,  label: "البريد الإلكتروني", value: selectedApp.email },
                    { icon: CalendarDays, label: "تاريخ الطلب", value: new Date(selectedApp.date).toLocaleDateString("ar-SA") },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <row.icon size={14} className="text-primary-600"/>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{row.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{row.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">رسالة المتطوع</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedApp.message}</p>
                  </div>
                </div>

                {selectedApp.status === "قيد المراجعة" && (
                  <div className="px-6 pb-6 flex gap-3">
                    <button onClick={() => handleAppStatus(selectedApp.id, "مقبول")}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors">
                      <CheckCircle2 size={15}/> قبول الطلب
                    </button>
                    <button onClick={() => handleAppStatus(selectedApp.id, "مرفوض")}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold transition-colors border border-red-200">
                      <XCircle size={15}/> رفض الطلب
                    </button>
                  </div>
                )}
                {selectedApp.status === "مقبول" && (
                  <div className="px-6 pb-6">
                    <button onClick={() => {
                      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: "قيد المراجعة" } : a));
                      setSelectedApp(prev => prev ? { ...prev, status: "قيد المراجعة" } : null);
                    }}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">
                      إعادة للمراجعة
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
                <FileText size={40} className="mx-auto mb-3 text-gray-200"/>
                <p className="text-sm">اختر طلباً لعرض تفاصيله</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: الفعاليات القادمة ── */}
      {tab === "events" && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-700 text-sm flex items-center gap-2">
            <CalendarDays size={16} className="text-primary-500"/> الفعاليات التطوعية القادمة
          </h2>
          {events.map((ev, i) => {
            const days    = daysUntil(ev.date);
            const pct     = Math.round((ev.registered / ev.spots) * 100);
            const isFull  = ev.registered >= ev.spots;
            return (
              <motion.div key={ev.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className="bg-white rounded-2xl p-6 border border-primary-50 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Date badge */}
                  <div className="flex-shrink-0 bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center min-w-[72px]">
                    <p className="text-2xl font-black text-primary-700">{new Date(ev.date).getDate()}</p>
                    <p className="text-xs text-primary-500 font-semibold">
                      {new Date(ev.date).toLocaleDateString("ar-SA", { month: "short" })}
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-black text-gray-800 text-lg">{ev.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{ev.program}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold flex-shrink-0 ${
                        days <= 7  ? "bg-red-50 text-red-700 border border-red-200" :
                        days <= 14 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                     "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}>
                        {days === 0 ? "اليوم" : days === 1 ? "غداً" : `بعد ${days} يوم`}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{ev.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><MapPin size={11}/> {ev.location}</span>
                      <span className="flex items-center gap-1"><Users size={11}/> {ev.registered} / {ev.spots} مسجل</span>
                      <span className="flex items-center gap-1"><Award size={11}/> {ev.program}</span>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>نسبة التسجيل</span>
                        <span className={isFull ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : "bg-emerald-400"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      {isFull && <p className="text-xs text-red-500 font-semibold mt-1">اكتملت المقاعد</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {detailV && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDetailId(null)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-white/20">{detailV.status}</span>
                  <button onClick={() => setDetailId(null)} className="text-white/70 hover:text-white"><X size={20}/></button>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-2xl mb-3">
                  {detailV.name.charAt(0)}
                </div>
                <h3 className="text-xl font-black">{detailV.name}</h3>
                <p className="text-white/70 text-sm mt-1">{detailV.program}</p>
              </div>

              <div className="p-6 space-y-3">
                {[
                  { icon: Hash,           label: "رقم الهوية",        value: detailV.nationalId },
                  { icon: Phone,          label: "رقم الجوال",        value: detailV.phone },
                  { icon: Mail,           label: "البريد الإلكتروني", value: detailV.email },
                  { icon: MapPin,         label: "مكان التطوع",       value: detailV.location },
                  { icon: HeartHandshake, label: "البرنامج",          value: detailV.program },
                  { icon: Clock,          label: "ساعات التطوع",      value: `${detailV.hours} ساعة` },
                  { icon: Save,           label: "تاريخ الانضمام",    value: new Date(detailV.joinDate).toLocaleDateString("ar-SA") },
                ].map(row => row.value ? (
                  <div key={row.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <row.icon size={14} className="text-emerald-600"/>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{row.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{row.value}</p>
                    </div>
                  </div>
                ) : null)}
                {detailV.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 mt-2">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FileText size={11}/> ملاحظات</p>
                    <p className="text-sm text-gray-700">{detailV.notes}</p>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => openEdit(detailV.id)} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Edit3 size={15}/> تعديل
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-black text-primary-700 flex items-center gap-2">
                  <HeartHandshake size={22} className="text-emerald-500"/>
                  {editingId ? "تعديل بيانات المتطوع" : "تسجيل متطوع جديد"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">الاسم الرباعي *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="أدخل الاسم..." className="input"/>
                  </div>
                  <div>
                    <label className="label">رقم الهوية</label>
                    <input value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })}
                      placeholder="10xxxxxxxx" className="input" dir="ltr"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">رقم الجوال *</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="05xxxxxxxx" className="input" dir="ltr"/>
                  </div>
                  <div>
                    <label className="label">البريد الإلكتروني</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="example@mail.com" className="input" dir="ltr"/>
                  </div>
                </div>
                <div>
                  <label className="label">مكان التطوع</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="مثال: الرياض — مركز الملك عبدالعزيز" className="input"/>
                </div>
                <div>
                  <label className="label">البرنامج / المبادرة</label>
                  <select value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} className="input">
                    <option value="">اختر البرنامج...</option>
                    {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">ساعات التطوع</label>
                    <input type="number" min={0} value={form.hours}
                      onChange={e => setForm({ ...form, hours: Number(e.target.value) })}
                      className="input" dir="ltr"/>
                  </div>
                  <div>
                    <label className="label">تاريخ الانضمام</label>
                    <input type="date" value={form.joinDate}
                      onChange={e => setForm({ ...form, joinDate: e.target.value })}
                      className="input"/>
                  </div>
                </div>
                <div>
                  <label className="label">ملاحظات</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="أي ملاحظات إضافية عن المتطوع..." rows={3}
                    className="input resize-none"/>
                </div>
              </div>

              <div className="px-8 pb-8 flex gap-3 flex-shrink-0 border-t border-gray-50 pt-5">
                <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.phone.trim()}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    : <Save size={16}/>}
                  {editingId ? "حفظ التعديلات" : "تسجيل المتطوع"}
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
