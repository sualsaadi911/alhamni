"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useCms } from "@/lib/cms-context";
import { hasPermission } from "@/lib/roles";
import type { Announcement, BoardMember, SiteSettings } from "@/lib/cms-context";
import type { NewsArticle } from "@/lib/data/news";
import type { Project } from "@/lib/data/projects";
import {
  Lock, Megaphone, Users, FileText, Newspaper, FolderOpen,
  Settings, Plus, Edit3, Trash2, Save, X, Image, Palette,
  Globe, Phone, Mail, Eye, EyeOff, Star, StarOff, Bell,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

type Tab = "settings" | "news" | "projects" | "announcements" | "board";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "settings",      label: "إعدادات الموقع",  icon: Settings },
  { id: "news",          label: "الأخبار",          icon: Newspaper },
  { id: "projects",      label: "المشاريع",         icon: FolderOpen },
  { id: "announcements", label: "الإعلانات",        icon: Megaphone },
  { id: "board",         label: "أعضاء المجلس",     icon: Users },
];

// ── Shared helpers ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "منشور": "bg-indigo-100 text-indigo-700",
    "مسودة": "bg-yellow-100 text-yellow-700",
    "نشط":   "bg-sky-100 text-sky-700",
    "غير نشط": "bg-gray-100 text-gray-500",
    "active":    "bg-sky-100 text-sky-700",
    "completed": "bg-blue-100 text-blue-700",
    "upcoming":  "bg-amber-100 text-amber-700",
  };
  const labels: Record<string, string> = {
    active: "نشط", completed: "مكتمل", upcoming: "قادم",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors[status] || "bg-gray-100 text-gray-500"}`}>
      {labels[status] || status}
    </span>
  );
}

// ── Settings Tab ───────────────────────────────────────────────────────────────
function SettingsTab() {
  const { settings, updateSettings } = useCms();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (key: keyof SiteSettings, label: string, type: "text" | "color" | "url" | "image" = "text") => (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
      {type === "color" ? (
        <div className="flex items-center gap-3">
          <input type="color" value={form[key] as string}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
          <input type="text" value={form[key] as string}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
        </div>
      ) : type === "image" ? (
        <ImageUpload value={form[key] as string} onChange={val => setForm({ ...form, [key]: val })} />
      ) : (
        <input type={type} value={form[key] as string}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Identity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-primary-500" />
          <h3 className="font-bold text-gray-800">هوية الموقع</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("siteName", "اسم الموقع")}
          {field("siteTagline", "الشعار / التاغلاين")}
          {field("logoUrl", "الشعار (Logo)", "image")}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
        <div className="flex items-center gap-2 mb-5">
          <Image size={18} className="text-primary-500" />
          <h3 className="font-bold text-gray-800">قسم الهيرو (الصفحة الرئيسية)</h3>
        </div>
        <div className="space-y-4">
          {field("heroTitle", "العنوان الرئيسي")}
          {field("heroImageUrl", "صورة القسم الرئيسي", "image")}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">النص الوصفي</label>
            <textarea value={form.heroSubtitle}
              onChange={e => setForm({ ...form, heroSubtitle: e.target.value })}
              rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
          </div>
          <div className="border-t border-gray-100 pt-4 mt-2">
            <h4 className="font-bold text-gray-800 mb-4 text-sm">قسم "عن المبادرة"</h4>
            {field("aboutImageUrl", "صورة قسم من نحن", "image")}
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-600 mb-1.5">نص "من نحن"</label>
              <textarea value={form.aboutSummary}
                onChange={e => setForm({ ...form, aboutSummary: e.target.value })}
                rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
        <div className="flex items-center gap-2 mb-5">
          <FileText size={18} className="text-primary-500" />
          <h3 className="font-bold text-gray-800">إحصائيات الصفحة الرئيسية</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([1,2,3,4] as const).map(n => (
            <div key={n} className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">القيمة {n}</label>
                <input value={form[`stat${n}Value` as keyof SiteSettings] as string}
                  onChange={e => setForm({ ...form, [`stat${n}Value`]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">التسمية {n}</label>
                <input value={form[`stat${n}Label` as keyof SiteSettings] as string}
                  onChange={e => setForm({ ...form, [`stat${n}Label`]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={18} className="text-primary-500" />
          <h3 className="font-bold text-gray-800">الألوان والهوية البصرية</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {field("primaryColor", "اللون الأزرق الرئيسي", "color")}
          {field("goldColor", "اللون الذهبي", "color")}
          {field("navyColor", "اللون الكحلي", "color")}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
        <div className="flex items-center gap-2 mb-5">
          <Phone size={18} className="text-primary-500" />
          <h3 className="font-bold text-gray-800">معلومات التواصل</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("contactEmail", "البريد الإلكتروني")}
          {field("contactPhone", "رقم الهاتف")}
          {field("contactAddress", "العنوان")}
          {field("twitterUrl", "رابط تويتر/X", "url")}
          {field("linkedinUrl", "رابط LinkedIn", "url")}
          {field("instagramUrl", "رابط Instagram", "url")}
        </div>
      </div>

      {/* System & Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-primary-500" />
          <h3 className="font-bold text-gray-800">إعدادات النظام والإشعارات</h3>
        </div>
        <div className="flex items-center justify-between py-4 px-2 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="font-bold text-gray-800 text-sm">إشعارات البريد الإلكتروني للمهام</p>
            <p className="text-xs text-gray-400 mt-1">إرسال بريد تلقائي للموظفين عن كل مهمة جديدة أو تعديل أو تذكير.</p>
          </div>
          <button
            onClick={() => setForm({ ...form, enableTaskNotifications: !form.enableTaskNotifications })}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${form.enableTaskNotifications ? "bg-primary-500 shadow-lg shadow-primary-200" : "bg-gray-200"}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${form.enableTaskNotifications ? "left-8" : "left-1"}`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`btn-primary flex items-center gap-2 px-8 transition-all ${saved ? "bg-sky-500" : ""}`}>
          <Save size={18} />
          {saved ? "تم الحفظ ✓" : "حفظ جميع الإعدادات"}
        </button>
      </div>
    </div>
  );
}

// ── News Tab ───────────────────────────────────────────────────────────────────
function NewsTab() {
  const { news, addNews, updateNews, deleteNews } = useCms();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", summary: "", category: "أخبار", date: "", img: "", author: "فريق ألهمني", readTime: "٣ دقائق", tags: "", featured: false, content: "" });

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", summary: "", category: "أخبار", date: new Date().toLocaleDateString("ar-SA"), img: "", author: "فريق ألهمني", readTime: "٣ دقائق", tags: "", featured: false, content: "" });
    setShowModal(true);
  };

  const openEdit = (item: NewsArticle) => {
    setEditingId(item.id);
    setForm({ title: item.title, summary: item.summary, category: item.category, date: item.date, img: item.img, author: item.author, readTime: item.readTime, tags: item.tags.join("، "), featured: item.featured, content: item.content });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const data: Omit<NewsArticle, "id"> = {
      title: form.title, summary: form.summary, category: form.category,
      date: form.date || new Date().toLocaleDateString("ar-SA"),
      img: form.img || "https://picsum.photos/seed/news/800/400",
      author: form.author, readTime: form.readTime,
      tags: form.tags.split(/[،,]/).map(t => t.trim()).filter(Boolean),
      featured: form.featured, content: form.content,
    };
    if (editingId) { updateNews(editingId, data); }
    else { addNews(data); }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{news.length} مقال</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={16} /> إضافة خبر
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">العنوان</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">التصنيف</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">التاريخ</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">مميز</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item, i) => (
              <motion.tr key={item.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.summary}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-primary-50 text-primary-600 text-xs px-2.5 py-1 rounded-full">{item.category}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{item.date}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => updateNews(item.id, { featured: !item.featured })}
                    className={`transition-colors ${item.featured ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}>
                    {item.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(item)}
                      className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => { if (confirm("حذف هذا الخبر؟")) deleteNews(item.id); }}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-7 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary-700">{editingId ? "تعديل خبر" : "إضافة خبر جديد"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">العنوان *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="عنوان الخبر..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الملخص</label>
                  <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })}
                    rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    placeholder="ملخص مختصر..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">المحتوى الكامل</label>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    rows={5} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    placeholder="محتوى الخبر كاملاً..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">التصنيف</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      {["أخبار", "برامج", "شراكات", "مبادرات", "فعاليات"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">التاريخ</label>
                    <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="مثال: ١٠ أبريل ٢٠٢٥" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الصورة المرفقة</label>
                  <ImageUpload value={form.img} onChange={url => setForm({ ...form, img: url })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">الكاتب</label>
                    <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">وقت القراءة</label>
                    <input value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="٣ دقائق" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الوسوم (مفصولة بفاصلة)</label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="قيادة، تدريب، شباب" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-500" />
                  <span className="text-sm font-semibold text-gray-700">تمييز هذا الخبر (يظهر في الصدارة)</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Save size={16} /> حفظ
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

// ── Projects Tab ───────────────────────────────────────────────────────────────
function ProjectsTab() {
  const { projects, addProject, updateProject, deleteProject } = useCms();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", desc: "", fullDesc: "", category: "تدريب", status: "active" as Project["status"], progress: 0, location: "الرياض", year: "٢٠٢٥", beneficiaries: "٠", img: "", color: "#1E4490", goals: "", team: "", budget: "", startDate: "", endDate: "" });

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", desc: "", fullDesc: "", category: "تدريب", status: "active", progress: 0, location: "الرياض", year: "٢٠٢٥", beneficiaries: "٠", img: "", color: "#1E4490", goals: "", team: "", budget: "", startDate: "", endDate: "" });
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({ title: p.title, desc: p.desc, fullDesc: p.fullDesc, category: p.category, status: p.status, progress: p.progress, location: p.location, year: p.year, beneficiaries: p.beneficiaries, img: p.img, color: p.color, goals: p.goals.join("\n"), team: p.team.join("، "), budget: p.budget || "", startDate: p.startDate || "", endDate: p.endDate || "" });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const data: Omit<Project, "id"> = {
      title: form.title, desc: form.desc, fullDesc: form.fullDesc,
      category: form.category, status: form.status, progress: Number(form.progress),
      location: form.location, year: form.year, beneficiaries: form.beneficiaries,
      img: form.img || "https://picsum.photos/seed/proj/800/400",
      color: form.color,
      goals: form.goals.split("\n").map(g => g.trim()).filter(Boolean),
      team: form.team.split(/[،,]/).map(t => t.trim()).filter(Boolean),
      budget: form.budget, startDate: form.startDate, endDate: form.endDate,
    };
    if (editingId) { updateProject(editingId, data); }
    else { addProject(data); }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{projects.length} مشروع</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={16} /> إضافة مشروع
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">المشروع</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">التصنيف</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">الحالة</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">التقدم</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <motion.tr key={p.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-800 text-sm line-clamp-1">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.location} — {p.year}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-primary-50 text-primary-600 text-xs px-2.5 py-1 rounded-full">{p.category}</span>
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{p.progress}٪</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(p)}
                      className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => { if (confirm("حذف هذا المشروع؟")) deleteProject(p.id); }}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-7 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary-700">{editingId ? "تعديل مشروع" : "إضافة مشروع جديد"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">اسم المشروع *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="اسم المشروع..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الوصف المختصر</label>
                  <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                    rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الوصف الكامل</label>
                  <textarea value={form.fullDesc} onChange={e => setForm({ ...form, fullDesc: e.target.value })}
                    rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">التصنيف</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      {["تدريب", "توعية", "شراكات", "بحث", "مجتمع"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">الحالة</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Project["status"] })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      <option value="active">نشط</option>
                      <option value="completed">مكتمل</option>
                      <option value="upcoming">قادم</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">نسبة الإنجاز (%)</label>
                    <input type="number" min={0} max={100} value={form.progress}
                      onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">عدد المستفيدين</label>
                    <input value={form.beneficiaries} onChange={e => setForm({ ...form, beneficiaries: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">الموقع</label>
                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">السنة</label>
                    <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الصورة المرفقة</label>
                  <ImageUpload value={form.img} onChange={url => setForm({ ...form, img: url })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الأهداف (سطر لكل هدف)</label>
                  <textarea value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })}
                    rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    placeholder="هدف 1&#10;هدف 2&#10;هدف 3" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Save size={16} /> حفظ
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

// ── Announcements Tab ──────────────────────────────────────────────────────────
function AnnouncementsTab() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useCms();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "أخبار", status: "مسودة" as Announcement["status"], content: "" });

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", category: "أخبار", status: "مسودة", content: "" });
    setShowModal(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({ title: a.title, category: a.category, status: a.status, content: a.content || "" });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const today = new Date().toLocaleDateString("ar-SA");
    if (editingId) {
      updateAnnouncement(editingId, form);
    } else {
      addAnnouncement({ ...form, date: today });
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{announcements.length} إعلان</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={16} /> إضافة إعلان
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">العنوان</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">التصنيف</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">التاريخ</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">الحالة</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-primary-700">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a, i) => (
              <motion.tr key={a.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800 text-sm">{a.title}</td>
                <td className="px-5 py-3.5">
                  <span className="bg-primary-50 text-primary-600 text-xs px-2.5 py-1 rounded-full">{a.category}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{a.date}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => updateAnnouncement(a.id, { status: a.status === "منشور" ? "مسودة" : "منشور" })}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                      a.status === "منشور" ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    }`}>
                    {a.status === "منشور" ? <Eye size={11} /> : <EyeOff size={11} />}
                    {a.status}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(a)}
                      className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => { if (confirm("حذف هذا الإعلان؟")) deleteAnnouncement(a.id); }}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-7 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary-700">{editingId ? "تعديل إعلان" : "إضافة إعلان جديد"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">عنوان الإعلان *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="عنوان الإعلان..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">المحتوى</label>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    placeholder="نص الإعلان..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">التصنيف</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      {["أخبار", "فعاليات", "مشاريع", "توظيف", "إعلانات"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">الحالة</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Announcement["status"] })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      <option value="مسودة">مسودة</option>
                      <option value="منشور">منشور</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Save size={16} /> حفظ
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

// ── Board Tab ──────────────────────────────────────────────────────────────────
function BoardTab() {
  const { board, addBoardMember, updateBoardMember, deleteBoardMember } = useCms();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", title: "", bio: "", img: "", status: "نشط" as BoardMember["status"] });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", title: "", bio: "", img: "", status: "نشط" });
    setShowModal(true);
  };

  const openEdit = (m: BoardMember) => {
    setEditingId(m.id);
    setForm({ name: m.name, title: m.title, bio: m.bio || "", img: m.img || "", status: m.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) { updateBoardMember(editingId, form); }
    else { addBoardMember(form); }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{board.length} عضو</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={16} /> إضافة عضو
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {board.map((m, i) => (
          <motion.div key={m.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-primary-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {m.img ? (
                  <img src={m.img} alt={m.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                    {m.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.title}</p>
                </div>
              </div>
              <StatusBadge status={m.status} />
            </div>
            {m.bio && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{m.bio}</p>}
            <div className="flex gap-2">
              <button onClick={() => openEdit(m)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-600 text-xs font-semibold transition-colors">
                <Edit3 size={12} /> تعديل
              </button>
              <button onClick={() => { if (confirm("حذف هذا العضو؟")) deleteBoardMember(m.id); }}
                className="w-9 flex items-center justify-center py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary-700">{editingId ? "تعديل عضو" : "إضافة عضو مجلس"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الاسم الكامل *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">المنصب</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">السيرة الذاتية المختصرة</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">صورة العضو (شخصية)</label>
                  <ImageUpload value={form.img} onChange={url => setForm({ ...form, img: url })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">الحالة</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as BoardMember["status"] })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="نشط">نشط</option>
                    <option value="غير نشط">غير نشط</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Save size={16} /> حفظ
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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>("settings");

  if (!profile || !hasPermission(profile, "canManageMedia")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
          <p className="text-gray-400 mt-2 text-sm">هذا القسم مخصص للمدير التنفيذي ومدير المحتوى والإعلام فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <h1 className="text-3xl font-black text-primary-700 flex items-center gap-3">
          <Globe size={28} className="text-primary-500" />
          لوحة تحكم المحتوى (CMS)
        </h1>
        <p className="text-gray-400 mt-1">إدارة كاملة لمحتوى الموقع — بدون أي كود</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="flex gap-1.5 flex-wrap mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-primary-50 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id ? "bg-primary-500 text-white shadow-md" : "text-gray-500 hover:text-primary-500 hover:bg-primary-50"
            }`}>
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div key={tab} variants={fadeUp} initial="hidden" animate="visible">
        {tab === "settings"      && <SettingsTab />}
        {tab === "news"          && <NewsTab />}
        {tab === "projects"      && <ProjectsTab />}
        {tab === "announcements" && <AnnouncementsTab />}
        {tab === "board"         && <BoardTab />}
      </motion.div>
    </div>
  );
}
