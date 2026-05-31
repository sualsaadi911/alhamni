"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/roles";
import { Lock, Scale, FileText, Plus, Edit3, Trash2, Save, X, Download, Eye } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

type DocType = "نظام" | "لائحة" | "سياسة" | "تقرير" | "عقد" | "قرار";
type DocStatus = "نشط" | "مسودة" | "منشور" | "أرشيف";

interface LegalDoc {
  id: number;
  title: string;
  type: DocType;
  status: DocStatus;
  date: string;
  description: string;
  fileName?: string;
  sharedWithMedia?: boolean;
}

const initialDocs: LegalDoc[] = [
  { id: 1, title: "النظام الأساسي للجمعية", type: "نظام", status: "نشط", date: "١٤٤٥/٠١/١٥", description: "الوثيقة التأسيسية للجمعية وأهدافها وهيكلها التنظيمي", fileName: "statute_v2.pdf" },
  { id: 2, title: "لائحة الحوكمة والرقابة", type: "لائحة", status: "نشط", date: "١٤٤٥/٠٣/٢٠", description: "إطار الحوكمة الداخلي وآليات الرقابة والمساءلة", fileName: "governance_rules.pdf" },
  { id: 3, title: "سياسة إدارة المخاطر", type: "سياسة", status: "مسودة", date: "١٤٤٦/٠١/١٠", description: "منهجية تحديد وتقييم وإدارة المخاطر التشغيلية" },
  { id: 4, title: "تقرير الحوكمة السنوي ٢٠٢٤", type: "تقرير", status: "منشور", date: "١٤٤٦/٠٢/٠١", description: "التقرير السنوي لأداء منظومة الحوكمة والامتثال", fileName: "annual_report_24.pdf", sharedWithMedia: true },
  { id: 5, title: "لائحة الموارد البشرية", type: "لائحة", status: "نشط", date: "١٤٤٥/٠٦/٠١", description: "سياسات التوظيف والتطوير الوظيفي وإدارة الأداء", fileName: "hr_rules_v3.pdf" },
  { id: 6, title: "سياسة الخصوصية وحماية البيانات", type: "سياسة", status: "نشط", date: "١٤٤٥/٠٨/١٠", description: "إطار حماية البيانات الشخصية وفق أنظمة المملكة", fileName: "privacy_policy.pdf", sharedWithMedia: true },
];

const TYPE_OPTIONS: DocType[] = ["نظام", "لائحة", "سياسة", "تقرير", "عقد", "قرار"];
const STATUS_OPTIONS: DocStatus[] = ["نشط", "مسودة", "منشور", "أرشيف"];

const TYPE_COLORS: Record<DocType, string> = {
  "نظام":  "bg-purple-100 text-purple-700",
  "لائحة": "bg-blue-100 text-blue-700",
  "سياسة": "bg-amber-100 text-amber-700",
  "تقرير": "bg-indigo-100 text-indigo-700",
  "عقد":   "bg-rose-100 text-rose-700",
  "قرار":  "bg-indigo-100 text-indigo-700",
};

const STATUS_COLORS: Record<DocStatus, string> = {
  "نشط":   "bg-sky-100 text-sky-700",
  "مسودة": "bg-yellow-100 text-yellow-700",
  "منشور": "bg-blue-100 text-blue-700",
  "أرشيف": "bg-gray-100 text-gray-500",
};

export default function LegalPage() {
  const { profile } = useAuth();
  const [docs, setDocs] = useState<LegalDoc[]>(initialDocs);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<LegalDoc | null>(null);
  const [filterType, setFilterType] = useState<string>("الكل");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", type: "لائحة" as DocType, status: "مسودة" as DocStatus, description: "", fileName: "", sharedWithMedia: false });

  if (!profile || !hasPermission(profile, "canManageLegal")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
          <p className="text-gray-400 mt-2 text-sm">هذا القسم مخصص للمدير التنفيذي ومدير الحوكمة والشؤون القانونية</p>
        </div>
      </div>
    );
  }

  const filtered = docs.filter(d => {
    const matchType = filterType === "الكل" || d.type === filterType;
    const matchSearch = d.title.includes(search) || d.description.includes(search);
    return matchType && matchSearch;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", type: "لائحة", status: "مسودة", description: "", fileName: "", sharedWithMedia: false });
    setShowModal(true);
  };

  const openEdit = (doc: LegalDoc) => {
    setEditingId(doc.id);
    setForm({ title: doc.title, type: doc.type, status: doc.status, description: doc.description, fileName: doc.fileName || "", sharedWithMedia: doc.sharedWithMedia || false });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const today = new Date().toLocaleDateString("ar-SA-u-nu-latn");
    if (editingId) {
      setDocs(prev => prev.map(d => d.id === editingId ? { ...d, ...form } : d));
    } else {
      setDocs(prev => [...prev, { id: Date.now(), ...form, date: today }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل تريد حذف هذه الوثيقة؟")) {
      setDocs(prev => prev.filter(d => d.id !== id));
    }
  };

  const stats = [
    { label: "إجمالي الوثائق", value: docs.length, color: "from-primary-400 to-primary-600" },
    { label: "وثائق نشطة", value: docs.filter(d => d.status === "نشط").length, color: "from-sky-400 to-sky-600" },
    { label: "مسودات", value: docs.filter(d => d.status === "مسودة").length, color: "from-amber-400 to-amber-600" },
    { label: "منشورة", value: docs.filter(d => d.status === "منشور").length, color: "from-blue-400 to-blue-600" },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700 flex items-center gap-3">
            <Scale size={30} className="text-amber-500" />
            الحوكمة والشؤون القانونية
          </h1>
          <p className="text-gray-400 mt-1">إدارة الوثائق القانونية واللوائح والسياسات</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> وثيقة جديدة
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-primary-50">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <FileText size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter and Search */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
        className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input type="text" placeholder="بحث قانوني سريع في الوثائق واللوائح..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300" />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {["الكل", ...TYPE_OPTIONS].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterType === t ? "bg-primary-500 text-white shadow-md" : "bg-white border border-primary-100 text-gray-500 hover:text-primary-500"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50">
              <tr>
                <th className="text-right px-6 py-4 text-sm font-bold text-primary-700">اسم الوثيقة</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-primary-700">النوع</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-primary-700">التاريخ</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-primary-700">الحالة</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-primary-700">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <motion.tr key={doc.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${TYPE_COLORS[doc.type]}`}>{doc.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[doc.status]}`}>{doc.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setPreviewDoc(doc)}
                        className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors" title="معاينة">
                        <Eye size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors" title="تحميل">
                        <Download size={14} />
                      </button>
                      <button onClick={() => openEdit(doc)}
                        className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors" title="تعديل">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(doc.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors" title="حذف">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <FileText size={40} className="mx-auto mb-3 text-primary-200" />
                    <p>لا توجد وثائق في هذا التصنيف</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-700">{editingId ? "تعديل وثيقة" : "إضافة وثيقة جديدة"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الوثيقة</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="أدخل اسم الوثيقة..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    placeholder="وصف مختصر للوثيقة..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الوثيقة</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as DocType })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300">
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as DocStatus })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                
                {/* File Upload Simulation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الملف المرفق (PDF, DOCX)</label>
                  <label className="flex items-center justify-center w-full h-20 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary-400 focus:outline-none">
                     <div className="flex gap-2 items-center text-gray-600">
                       <Download size={20} className="text-gray-400" />
                       <span className="font-semibold text-sm">{form.fileName || "اضغط هنا لاختيار أو إسقاط ملف المعتمد"}</span>
                     </div>
                     <input type="file" name="file_upload" className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if(file) setForm({...form, fileName: file.name});
                        }} 
                     />
                  </label>
                </div>

                {/* Media Share Toggle */}
                <label className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer">
                  <input type="checkbox" checked={form.sharedWithMedia} onChange={e => setForm({...form, sharedWithMedia: e.target.checked})}
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                  <span className="text-sm font-semibold text-primary-800">مشاركة الوثيقة مباشرة كخبر أو تعميم مع قسم (إدارة المحتوى والإعلام)</span>
                </label>

              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Save size={18} /> حفظ
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 btn-outline">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-700">{previewDoc.title}</h2>
                <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${TYPE_COLORS[previewDoc.type]}`}>{previewDoc.type}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[previewDoc.status]}`}>{previewDoc.status}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{previewDoc.description}</p>
                <p className="text-sm text-gray-400">تاريخ الإصدار: {previewDoc.date}</p>
              </div>
              <div className="flex gap-3 mt-8">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Download size={18} /> تحميل الوثيقة
                </button>
                <button onClick={() => setPreviewDoc(null)} className="flex-1 btn-outline">إغلاق</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
