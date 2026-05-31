"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useServices } from "@/lib/services-context";
import { hasPermission } from "@/lib/roles";
import type { Service, ServiceRequest, RequestStatus } from "@/lib/services-context";
import {
  Briefcase, Plus, Edit3, Trash2, X, Save, Eye, EyeOff,
  Inbox, Clock, CheckCircle2, XCircle, RefreshCw, ChevronDown,
  Lock, Sparkles, Loader2,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const CATEGORIES = ["برمجة وتقنية", "استشارات", "تصميم", "قانوني", "تعليم", "أخرى"];

const SAMPLE_SERVICES = [
  {
    title: "تصميم موقع إلكتروني",
    description: "تصميم وتطوير مواقع احترافية متجاوبة مع جميع الأجهزة بأحدث التقنيات.",
    category: "برمجة وتقنية",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    details: "نقدم خدمة تصميم مواقع إلكترونية متكاملة تشمل: التصميم الجرافيكي، البرمجة، والاستضافة. نستخدم أحدث التقنيات لضمان موقع سريع وآمن.",
    isActive: true,
  },
  {
    title: "استشارة قانونية",
    description: "استشارات قانونية متخصصة في قانون الأعمال والعقود والنزاعات التجارية.",
    category: "قانوني",
    icon: "⚖️",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    details: "فريقنا من المحامين والمستشارين القانونيين يقدم استشارات متخصصة في مختلف المجالات القانونية بما يضمن حقوقك وتحقيق أهدافك.",
    isActive: true,
  },
  {
    title: "تصميم هوية بصرية",
    description: "تصميم شعار وهوية بصرية متكاملة تعكس قيم علامتك التجارية.",
    category: "تصميم",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    details: "نصمم هويات بصرية احترافية تشمل: الشعار، الألوان، الخطوط، وجميع مواد التسويق الورقية والرقمية.",
    isActive: true,
  },
  {
    title: "استشارة مالية ومحاسبة",
    description: "خدمات محاسبية واستشارات مالية للأفراد والشركات الصغيرة والمتوسطة.",
    category: "استشارات",
    icon: "💰",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    details: "نقدم خدمات متكاملة تشمل: إعداد القوائم المالية، التخطيط الضريبي، تحليل التكاليف، وتقديم الاستشارات المالية الاستراتيجية.",
    isActive: true,
  },
  {
    title: "دورات تدريبية",
    description: "برامج تدريبية متخصصة في مهارات القيادة والتطوير الذاتي وريادة الأعمال.",
    category: "تعليم",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    details: "برامجنا التدريبية صُممت من قِبل خبراء متخصصين وتُقدَّم بأسلوب تفاعلي وعملي يضمن الاستفادة القصوى للمشاركين.",
    isActive: true,
  },
  {
    title: "إدارة منصات التواصل الاجتماعي",
    description: "إدارة احترافية لحساباتك على منصات التواصل الاجتماعي وإنتاج محتوى مميز.",
    category: "تصميم",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    details: "نتولى إدارة حساباتك على جميع المنصات مع إنتاج محتوى إبداعي وتحليل الأداء وتنمية متابعيك بشكل عضوي.",
    isActive: true,
  },
];

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "قيد المراجعة",    color: "bg-yellow-100 text-yellow-700",  icon: Clock },
  reviewing: { label: "جاري المعالجة",   color: "bg-blue-100 text-blue-700",     icon: RefreshCw },
  accepted:  { label: "مقبول",           color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  completed: { label: "مكتمل",           color: "bg-primary-100 text-primary-700", icon: CheckCircle2 },
  rejected:  { label: "مرفوض",           color: "bg-red-100 text-red-700",        icon: XCircle },
};

const ICONS = ["💼", "💻", "⚖️", "🎨", "📚", "🔧", "💡", "🌐", "📊", "🤝", "🏛️", "✍️"];

type Tab = "services" | "requests";

// ── Service Form Modal ─────────────────────────────────────────────────────────
function ServiceModal({
  initial, onSave, onClose,
}: {
  initial?: Partial<Service>;
  onSave: (data: Omit<Service, "id" | "createdAt" | "createdBy">) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title:       initial?.title ?? "",
    description: initial?.description ?? "",
    category:    initial?.category ?? CATEGORIES[0],
    icon:        initial?.icon ?? "💼",
    image:       initial?.image ?? "",
    details:     initial?.details ?? "",
    isActive:    initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    try { await onSave(form); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-black text-gray-800">{initial?.id ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">صورة الخدمة</label>
            <ImageUpload value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">عنوان الخدمة *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="مثال: تصميم موقع إلكتروني"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">وصف مختصر *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="وصف يظهر في بطاقة الخدمة..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">تفاصيل إضافية</label>
            <textarea value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
              rows={3} placeholder="معلومات إضافية تظهر في صفحة الخدمة..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">الفئة</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">الأيقونة</label>
              <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
                {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-primary-500" : "bg-gray-300"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? "right-1" : "left-1"}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700">الخدمة {form.isActive ? "نشطة وظاهرة للزوار" : "مخفية"}</span>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
          <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.description.trim()}
            className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={15} />{saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Request Row ────────────────────────────────────────────────────────────────
function RequestRow({ req, onStatusChange }: { req: ServiceRequest; onStatusChange: (id: string, s: RequestStatus) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[req.status];
  const Icon = cfg.icon;
  const date = req.createdAt?.toDate().toLocaleDateString("ar-SA") ?? "";

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 text-right hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{req.name}</p>
          <p className="text-gray-400 text-xs truncate">{req.serviceTitle} · {date}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 flex-shrink-0 ${cfg.color}`}>
          <Icon size={11} />{cfg.label}
        </span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-400">البريد:</span> <span className="font-semibold text-gray-700 mr-1">{req.email}</span></div>
            {req.phone && <div><span className="text-gray-400">الجوال:</span> <span className="font-semibold text-gray-700 mr-1">{req.phone}</span></div>}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">تفاصيل الطلب</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{req.details}</p>
          </div>
          {req.note && (
            <div>
              <p className="text-xs text-gray-400 mb-1">ملاحظة الإدارة</p>
              <p className="text-sm text-primary-700 bg-primary-50 rounded-xl p-3">{req.note}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-2">تغيير الحالة</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_CONFIG) as RequestStatus[]).map(s => (
                <button key={s} onClick={() => onStatusChange(req.id, s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                    req.status === s
                      ? STATUS_CONFIG[s].color + " border-transparent"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DashboardServicesPage() {
  const { profile } = useAuth();
  const { services, requests, addService, updateService, deleteService, updateRequestStatus } = useServices();
  const [tab, setTab] = useState<Tab>("services");
  const [modal, setModal] = useState<{ open: boolean; service?: Service }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const seedSampleData = async () => {
    setSeeding(true);
    try {
      for (const s of SAMPLE_SERVICES) {
        await addService(s);
      }
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    if (!loading && services.length === 0) {
      seedSampleData();
    }
  }, [loading]);

  if (!profile || !hasPermission(profile, "canManageServices")) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Lock size={32} className="text-gray-300" />
        <p className="text-gray-400 font-semibold">ليس لديك صلاحية الوصول لهذه الصفحة</p>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">إدارة الخدمات</h1>
          <p className="text-gray-400 text-sm mt-1">{services.length} خدمة · {requests.length} طلب</p>
        </div>
        {tab === "services" && (
          <div className="flex items-center gap-2">
            {services.length === 0 && (
              <button onClick={seedSampleData} disabled={seeding}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-primary-300 text-primary-600 text-sm font-bold hover:bg-primary-50 transition-colors disabled:opacity-60">
                {seeding ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {seeding ? "جاري الإضافة..." : "تعبئة بيانات تجريبية"}
              </button>
            )}
            <button onClick={() => setModal({ open: true })} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> إضافة خدمة
            </button>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {([
          { id: "services" as Tab, label: "الخدمات",    icon: Briefcase },
          { id: "requests" as Tab, label: "الطلبات",    icon: Inbox,    badge: pendingCount },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.id ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <t.icon size={15} />
            {t.label}
            {t.badge ? (
              <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── Services Tab ── */}
      {tab === "services" && (
        <div className="space-y-3">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold">لا توجد خدمات بعد — أضف أول خدمة</p>
            </div>
          ) : services.map((s, i) => (
            <motion.div key={s.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800">{s.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.category}</span>
                  {!s.isActive && (
                    <span className="text-xs bg-red-50 text-red-400 px-2 py-0.5 rounded-full">مخفية</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-0.5 truncate">{s.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => updateService(s.id, { isActive: !s.isActive })}
                  title={s.isActive ? "إخفاء" : "إظهار"}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
                  {s.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setModal({ open: true, service: s })}
                  className="p-2 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors text-gray-400">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setDeleteConfirm(s.id)}
                  className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Requests Tab ── */}
      {tab === "requests" && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-16">
              <Inbox size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold">لا توجد طلبات بعد</p>
            </div>
          ) : requests.map((r, i) => (
            <motion.div key={r.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
              <RequestRow req={r} onStatusChange={(id, s) => updateRequestStatus(id, s)} />
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal.open && (
          <ServiceModal
            initial={modal.service}
            onClose={() => setModal({ open: false })}
            onSave={data =>
              modal.service
                ? updateService(modal.service.id, data)
                : addService(data)
            }
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-black text-gray-800 mb-2">حذف الخدمة؟</h3>
              <p className="text-gray-400 text-sm mb-6">لا يمكن التراجع عن هذا الإجراء</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button onClick={() => { deleteService(deleteConfirm); setDeleteConfirm(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">
                  حذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
