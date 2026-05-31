"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/roles";
import {
  User, Mail, Shield, Edit3, Save, X, LogOut,
  Heart, HandHeart, CheckCircle, AlertCircle, Camera,
  Bell, ChevronLeft, Settings,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const activityLog = [
  { action: "تسجيل الدخول",              time: "اليوم، ١٠:٢٣ص",    color: "#3B5BA0" },
  { action: "تقديم طلب تطوع",            time: "أمس، ٣:١٥م",       color: "#059669" },
  { action: "التبرع بمبلغ ١٠٠ ريال",     time: "قبل ٣ أيام",       color: "#D97706" },
  { action: "تحديث معلومات الحساب",      time: "قبل أسبوع",         color: "#7C3AED" },
];

export default function AccountPage() {
  const { user, profile, logout, updateUserProfile, loading } = useAuth();
  const router = useRouter();

  const [editing, setEditing]     = useState(false);
  const [nameVal, setNameVal]     = useState("");
  const [saving,  setSaving]      = useState(false);
  const [saved,   setSaved]       = useState(false);
  const [error,   setError]       = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "activity" | "settings">("profile");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (profile) setNameVal(profile.name);
  }, [user, profile, loading, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    if (!nameVal.trim()) { setError("الاسم مطلوب"); return; }
    setSaving(true); setError("");
    try {
      await updateUserProfile({ name: nameVal.trim() });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("تعذّر الحفظ، حاول مجدداً");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const initials = profile.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("");

  const tabs = [
    { id: "profile",   label: "الملف الشخصي", icon: User },
    { id: "activity",  label: "النشاط",        icon: Bell },
    { id: "settings",  label: "الإعدادات",     icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Hero */}
      <div className="page-hero pb-40">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-2xl">
            <span className="section-label mb-4">
              <User size={14} /> حسابي
            </span>
            <h1 className="page-hero-title">إدارة الحساب الشخصي</h1>
            <p className="page-hero-subtitle">تحكّم في معلوماتك وتابع نشاطك داخل مبادرة ألهمني</p>
          </motion.div>
        </div>
      </div>

      <div className="container relative" style={{ marginTop: "-7rem", paddingBottom: "4rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Sidebar Card ─────────────────────────────────── */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="card p-6 text-center h-fit">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto"
                style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)", boxShadow: "0 8px 24px rgba(59,91,160,0.30)" }}>
                {initials}
              </div>
              <button className="absolute -bottom-2 -left-2 w-8 h-8 rounded-xl flex items-center justify-center bg-white"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)", border: "1px solid rgba(59,91,160,0.14)" }}>
                <Camera size={14} style={{ color: "#3B5BA0" }} />
              </button>
            </div>

            <h2 className="text-xl font-black mb-1" style={{ color: "#0F172A" }}>{profile.name}</h2>
            <p className="text-sm mb-3" style={{ color: "#64748B" }}>{profile.email}</p>
            <span className={`badge text-xs font-bold ${ROLE_COLORS[profile.role]}`}>
              {ROLE_LABELS[profile.role]}
            </span>

            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/donate"
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all hover:scale-105"
                  style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.18)" }}>
                  <Heart size={18} style={{ color: "#D97706" }} />
                  <span className="text-xs font-bold" style={{ color: "#92400E" }}>تبرع</span>
                </Link>
                <Link href="/volunteer"
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all hover:scale-105"
                  style={{ background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.15)" }}>
                  <HandHeart size={18} style={{ color: "#059669" }} />
                  <span className="text-xs font-bold" style={{ color: "#065F46" }}>تطوع</span>
                </Link>
              </div>
              <button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold transition-all hover:scale-[1.01]"
                style={{ background: "rgba(220,38,38,0.07)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.14)" }}>
                <LogOut size={15} /> تسجيل الخروج
              </button>
            </div>
          </motion.div>

          {/* ── Main Content ─────────────────────────────────── */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="lg:col-span-2 space-y-6">

            {/* Tabs */}
            <div className="card p-2 flex gap-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: activeTab === tab.id ? "linear-gradient(135deg, #2E4B88, #3B5BA0)" : "transparent",
                    color: activeTab === tab.id ? "white" : "#64748B",
                    boxShadow: activeTab === tab.id ? "0 4px 12px rgba(59,91,160,0.25)" : "none",
                  }}>
                  <tab.icon size={15} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black" style={{ color: "#0F172A" }}>المعلومات الشخصية</h3>
                  {!editing ? (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all"
                      style={{ background: "rgba(59,91,160,0.08)", color: "#3B5BA0" }}>
                      <Edit3 size={14} /> تعديل
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(false); setNameVal(profile.name); setError(""); }}
                        className="p-2 rounded-xl transition-all hover:bg-red-50">
                        <X size={16} style={{ color: "#DC2626" }} />
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white transition-all disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)" }}>
                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><Save size={14} /> حفظ</>}
                      </button>
                    </div>
                  )}
                </div>

                {saved && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
                    style={{ background: "rgba(5,150,105,0.08)", color: "#059669", border: "1px solid rgba(5,150,105,0.15)" }}>
                    <CheckCircle size={16} /> تم حفظ التغييرات بنجاح
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
                    style={{ background: "rgba(220,38,38,0.07)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.14)" }}>
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="label flex items-center gap-2">
                      <User size={14} /> الاسم الكامل
                    </label>
                    {editing ? (
                      <input value={nameVal} onChange={(e) => setNameVal(e.target.value)}
                        className="input" placeholder="الاسم الكامل" />
                    ) : (
                      <div className="input bg-gray-50 cursor-default" style={{ color: "#64748B" }}>{profile.name}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label flex items-center gap-2">
                      <Mail size={14} /> البريد الإلكتروني
                    </label>
                    <div className="input bg-gray-50 cursor-default flex items-center gap-2" style={{ color: "#64748B" }}>
                      {profile.email}
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>لا يمكن تغيير البريد الإلكتروني</p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="label flex items-center gap-2">
                      <Shield size={14} /> نوع العضوية
                    </label>
                    <div className="input bg-gray-50 cursor-default flex items-center gap-2.5">
                      <span className={`badge text-xs ${ROLE_COLORS[profile.role]}`}>
                        {ROLE_LABELS[profile.role]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="card p-8">
                <h3 className="text-lg font-black mb-6" style={{ color: "#0F172A" }}>سجل النشاط</h3>
                <div className="space-y-3">
                  {activityLog.map((item, i) => (
                    <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: "rgba(59,91,160,0.03)", border: "1px solid rgba(59,91,160,0.08)" }}>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: "#64748B" }}>{item.action}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="card p-8 space-y-5">
                <h3 className="text-lg font-black mb-2" style={{ color: "#0F172A" }}>الإعدادات</h3>

                {[
                  { label: "إشعارات البريد الإلكتروني", desc: "استلام تحديثات المبادرة والأخبار" },
                  { label: "النشرة البريدية",           desc: "آخر أخبار البرامج والفعاليات" },
                  { label: "إشعارات التطوع",            desc: "فرص تطوع جديدة تناسب اهتماماتك" },
                ].map((opt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl"
                    style={{ background: "rgba(59,91,160,0.03)", border: "1px solid rgba(59,91,160,0.08)" }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#64748B" }}>{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{opt.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                    </label>
                  </div>
                ))}

                <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1.25rem" }}>
                  <p className="text-sm font-bold mb-3" style={{ color: "#DC2626" }}>منطقة الخطر</p>
                  <button className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(220,38,38,0.07)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.14)" }}>
                    حذف الحساب
                  </button>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="text-base font-black mb-4" style={{ color: "#0F172A" }}>روابط سريعة</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { href: "/projects",  label: "المشاريع",      color: "#3B5BA0" },
                  { href: "/volunteer", label: "التطوع",        color: "#059669" },
                  { href: "/donate",    label: "التبرع",        color: "#D97706" },
                  { href: "/news",      label: "الأخبار",       color: "#7C3AED" },
                  { href: "/contact",   label: "تواصل معنا",    color: "#3B5BA0" },
                  { href: "/about",     label: "عن المبادرة",   color: "#0F172A" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{ background: `${link.color}0A`, color: link.color, border: `1px solid ${link.color}18` }}>
                    {link.label}
                    <ChevronLeft size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
