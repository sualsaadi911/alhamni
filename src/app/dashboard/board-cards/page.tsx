"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useCms } from "@/lib/cms-context";
import { hasPermission } from "@/lib/roles";
import { Plus, Edit3, Trash2, X, Save, Users, Phone, Mail, Building } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import type { BoardMember } from "@/lib/cms-context";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "نشط": "bg-sky-100 text-sky-700",
    "غير نشط": "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

export default function BoardCardsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  
  if (!profile || !hasPermission(profile, "canManageBoardCards")) {
    if (typeof window !== "undefined") router.replace("/dashboard");
    return null;
  }

  const { board, addBoardMember, updateBoardMember, deleteBoardMember } = useCms();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState<Omit<BoardMember, "id">>({
    name: "", title: "", bio: "", img: "",
    email: "", phone: "", department: "",
    status: "نشط",
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", title: "", bio: "", img: "", email: "", phone: "", department: "", status: "نشط" });
    setShowModal(true);
  };

  const openEdit = (m: BoardMember) => {
    setEditingId(m.id);
    setForm({
      name: m.name, title: m.title, bio: m.bio || "", img: m.img || "",
      email: m.email || "", phone: m.phone || "", department: m.department || "",
      status: m.status
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) { updateBoardMember(editingId, form); }
    else { addBoardMember(form); }
    setShowModal(false);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <Users size={18} />
            <span className="text-sm font-semibold">إدارة الموارد البشرية والمحتوى</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800">بطاقات الإدارة الرقمية</h1>
          <p className="text-sm text-gray-500 mt-1">إضافة وتعديل بطاقات تعريف أعضاء الهيكل التنظيمي والمجلس</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{board.length} عضو</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4 shadow-lg shadow-primary-500/30">
          <Plus size={16} /> إضافة بطاقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {board.map((m, i) => (
          <motion.div key={m.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="bg-white rounded-3xl p-6 shadow-sm border border-primary-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {m.img ? (
                  <img src={m.img} alt={m.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-50" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                    {m.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">{m.name}</p>
                  <p className="text-xs font-medium text-primary-600">{m.title}</p>
                  {m.department && <p className="text-[10px] text-gray-400 mt-0.5">{m.department}</p>}
                </div>
              </div>
              <StatusBadge status={m.status} />
            </div>

            <div className="space-y-2 mb-5">
              {m.email && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Mail size={12} className="text-gray-400" />
                  <span className="truncate">{m.email}</span>
                </div>
              )}
              {m.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Phone size={12} className="text-gray-400" />
                  <span dir="ltr" className="text-right w-full">{m.phone}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button onClick={() => openEdit(m)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold transition-colors">
                <Edit3 size={14} /> تعديل البطاقة
              </button>
              <button onClick={() => { if (confirm("حذف هذه البطاقة؟")) deleteBoardMember(m.id); }}
                className="w-11 flex items-center justify-center py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800">{editingId ? "تعديل بيانات البطاقة" : "إضافة بطاقة جديدة"}</h2>
                  <p className="text-xs text-gray-500 mt-1">تحديث بيانات العضو كما ستظهر في الموقع الأساسي</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="مثال: أ. عبدالعزيز بونيان" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">المسمى الوظيفي/المنصب</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50 focus:bg-white"
                      placeholder="رئيس مجلس الإدارة" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">القسم / التخصص</label>
                    <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50 focus:bg-white"
                      placeholder="لجنة تقنية المعلومات" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail size={14} className="absolute right-3.5 top-3.5 text-gray-400" />
                      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        dir="ltr"
                        className="w-full pr-9 pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50 focus:bg-white text-left"
                        placeholder="email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الهاتف</label>
                    <div className="relative">
                      <Phone size={14} className="absolute right-3.5 top-3.5 text-gray-400" />
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        dir="ltr"
                        className="w-full pr-9 pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50 focus:bg-white text-left"
                        placeholder="+966..." />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">نبذة تعريفية</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50 focus:bg-white resize-none"
                    placeholder="نبذة عن العضو..." />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">صورة العضو (اختياري)</label>
                  <ImageUpload value={form.img} onChange={url => setForm({ ...form, img: url })} />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">حالة العرض</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as BoardMember["status"] })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50 focus:bg-white">
                    <option value="نشط">ظاهر في الموقع (نشط)</option>
                    <option value="غير نشط">مخفي (غير نشط)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 text-sm">
                  <Save size={16} /> حفظ التغييرات
                </button>
                <button onClick={() => setShowModal(false)} className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
