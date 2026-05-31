"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/roles";
import { Save, User, Bell, Shield, Eye, EyeOff, Camera } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function SettingsPage() {
  const { profile, updateUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newAnnouncements: true,
    userRequests: true,
    docUpdates: false,
    financialReports: true,
  });
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  if (!profile) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notifItems = [
    { key: "newAnnouncements" as const, label: "الإعلانات الجديدة", desc: "استلام إشعار عند نشر إعلان جديد" },
    { key: "userRequests" as const, label: "طلبات المستخدمين", desc: "إشعار عند وجود طلبات انضمام جديدة" },
    { key: "docUpdates" as const, label: "تحديثات الوثائق", desc: "إشعار عند تحديث وثائق الحوكمة" },
    { key: "financialReports" as const, label: "التقارير المالية", desc: "إشعار عند اكتمال التقارير المالية" },
  ];

  return (
    <div className="max-w-2xl">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-black text-primary-700">الإعدادات</h1>
        <p className="text-gray-400 mt-1">إدارة حسابك وتفضيلاتك</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="bg-white rounded-2xl shadow-sm border border-primary-50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
            <User size={16} className="text-primary-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">الملف الشخصي</h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-100" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-2xl">
                {profile.name.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera size={18} className="text-white" />
              <input type="file" accept="image/*" className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                  const data = await res.json();
                  if (data.success) await updateUserProfile({ avatar: data.url });
                }} />
            </label>
          </div>
          <div>
            <p className="font-bold text-gray-800">{profile.name}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS[profile.role]}`}>
              {ROLE_LABELS[profile.role]}
            </span>
            <p className="text-xs text-gray-400 mt-1">اضغط على الصورة لتغييرها</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="bg-white rounded-2xl shadow-sm border border-primary-50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
            <Shield size={16} className="text-primary-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">تغيير كلمة المرور</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الحالية</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={profileForm.currentPassword}
                onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder="أدخل كلمة المرور الحالية"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={profileForm.newPassword}
              onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="bg-white rounded-2xl shadow-sm border border-primary-50 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
            <Bell size={16} className="text-primary-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">إعدادات الإشعارات</h2>
        </div>
        <div className="space-y-1">
          {notifItems.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-gray-700 text-sm">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(key)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notifSettings[key] ? "bg-primary-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${notifSettings[key] ? "left-7" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
        <button
          onClick={handleSave}
          className={`btn-primary flex items-center gap-2 transition-colors ${saved ? "!bg-indigo-500 hover:!bg-indigo-600" : ""}`}
        >
          <Save size={18} />
          {saved ? "تم الحفظ!" : "حفظ التغييرات"}
        </button>
      </motion.div>
    </div>
  );
}
