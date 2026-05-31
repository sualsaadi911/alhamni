"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, User, Mail, Lock, HandHeart, Users } from "lucide-react";

const roleOptions = [
  { value: "member",    label: "عضو مجتمعي",  desc: "متابعة أنشطة المبادرة ودعمها",     icon: Users,     color: "#3B5BA0" },
  { value: "volunteer", label: "متطوع",        desc: "المشاركة الفعلية في برامج ألهمني",  icon: HandHeart, color: "#059669" },
];

export default function RegisterPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [role,     setRole]     = useState<"member" | "volunteer">("member");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل"); return; }
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    setLoading(true);
    try {
      await register(email, password, name, role);
      router.push("/account");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/email-already-in-use") setError("هذا البريد الإلكتروني مستخدم مسبقاً");
      else if (code === "auth/invalid-email")   setError("البريد الإلكتروني غير صالح");
      else setError("حدث خطأ، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24"
      style={{ background: "linear-gradient(135deg, #F0FDFA 0%, #F8FAFC 50%, #F0FDFA 100%)" }}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3B5BA0, transparent)" }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #D97706, transparent)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-3xl w-full max-w-lg"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05)" }}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-6 text-center"
          style={{ borderBottom: "1px solid #E2E8F0" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)", boxShadow: "0 8px 24px rgba(59,91,160,0.30)" }}>
            <img src="/logo.png" alt="ألهمني" className="w-12 h-12 object-contain brightness-0 invert" />
          </motion.div>
          <h1 className="text-2xl font-black" style={{ color: "#0F172A" }}>إنشاء حساب جديد</h1>
          <p className="mt-1.5 text-sm" style={{ color: "#64748B" }}>انضم إلى مجتمع ألهمني وكن جزءاً من التغيير</p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="label">نوع العضوية</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value as "member" | "volunteer")}
                  className="p-4 rounded-2xl text-right transition-all duration-200 border-2"
                  style={{
                    borderColor: role === opt.value ? opt.color : "#E2E8F0",
                    background: role === opt.value ? `${opt.color}0D` : "white",
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: role === opt.value ? opt.color : "rgba(59,91,160,0.07)" }}>
                    <opt.icon size={17} style={{ color: role === opt.value ? "white" : opt.color }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: role === opt.value ? opt.color : "#64748B" }}>{opt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label">الاسم الكامل</label>
            <div className="relative">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="محمد الأحمد"
                className="input pr-12" />
              <User size={17} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: "#3B5BA0" }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">البريد الإلكتروني</label>
            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="example@gmail.com"
                className="input pr-12" />
              <Mail size={17} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: "#3B5BA0" }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label">كلمة المرور</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} required
                placeholder="٦ أحرف على الأقل"
                className="input pr-12 pl-12" />
              <Lock size={17} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: "#3B5BA0" }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity">
                {showPass ? <EyeOff size={17} style={{ color: "#3B5BA0" }} /> : <Eye size={17} style={{ color: "#3B5BA0" }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">تأكيد كلمة المرور</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={confirm}
                onChange={(e) => setConfirm(e.target.value)} required
                placeholder="أعد كتابة كلمة المرور"
                className="input pr-12" />
              <Lock size={17} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" style={{ color: "#3B5BA0" }} />
              {confirm && (
                <CheckCircle size={17} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: confirm === password ? "#059669" : "#DC2626" }} />
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
              style={{ background: "rgba(220,38,38,0.07)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.15)" }}>
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><UserPlus size={18} /> إنشاء الحساب</>
            )}
          </button>

          {/* Terms */}
          <p className="text-center text-xs" style={{ color: "#94A3B8" }}>
            بإنشاء الحساب توافق على{" "}
            <Link href="/policies" className="font-semibold" style={{ color: "#3B5BA0" }}>سياسات المبادرة</Link>
          </p>
        </form>

        {/* Footer */}
        <div className="px-10 pb-8 text-center">
          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1.5rem" }}>
            <p className="text-sm" style={{ color: "#64748B" }}>
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="font-bold" style={{ color: "#3B5BA0" }}>تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
