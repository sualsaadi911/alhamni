"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "admin@alhamni.sa",      password: "admin123", name: "أ. عبدالعزيز بونيان", label: "المؤسس والرئيس التنفيذي"             },
  { email: "vp@alhamni.sa",         password: "vp1234",   name: "أ. رهف الشيباني",      label: "نائب الرئيس التنفيذي للشؤون الداخلية"},
  { email: "hr@alhamni.sa",         password: "hr1234",   name: "أ. عبدالله العقيل",    label: "مدير الموارد البشرية والجودة"        },
  { email: "volunteer@alhamni.sa",  password: "vol123",   name: "أ. ولاء الشريف",       label: "مدير التطوع"                         },
  { email: "finance@alhamni.sa",    password: "fin123",   name: "أ. حاتم الشهراني",     label: "مسؤول الشؤون المالية"                },
  { email: "legal@alhamni.sa",      password: "leg123",   name: "أ. حصة أباحسين",       label: "مدير الشؤون القانونية والحوكمة"      },
  { email: "media@alhamni.sa",      password: "med123",   name: "أ. رهف هزازي",         label: "مدير الإعلام والاتصال"               },
  { email: "tech@alhamni.sa",       password: "tec123",   name: "أ. سلطان السعدي",      label: "مسؤول الدعم الفني"                   },
  { email: "dev@alhamni.sa",         password: "dev123",   name: "أ. أفنان الشهري",      label: "مسؤولة تطوير المواقع والذكاء الاصطناعي" },
  { email: "maram@alhamni.sa",      password: "mar123",   name: "أ. مرام فرحان",        label: "مسؤولة البيانات"                     },
  { email: "sabreen@alhamni.sa",    password: "sab123",   name: "أ. صابرين ثابت",       label: "نائبة قسم الإعلام والاتصال"          },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent/30 px-4 pt-20 pb-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent opacity-50 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row divide-x divide-x-reverse divide-blue-200"
      >
        {/* Right Panel: Logo & Branding */}
        <div
          className="w-full md:w-5/12 flex flex-col items-center justify-between relative overflow-hidden"
          style={{ background: '#ffffff' }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center w-full flex-1 justify-center gap-8 py-10 px-8"
          >
            {/* الشعار — يأخذ المساحة البيضاء العلوية */}
            <div className="w-72 h-64 overflow-hidden">
              <img
                src="/logo- الازرق الي بالعرض.png"
                alt="ألهمني"
                className="w-full h-full object-contain scale-110"
                style={{ mixBlendMode: 'multiply', filter: 'contrast(1.1)' }}
              />
            </div>

            {/* النص */}
            <div className="text-center pb-10">
              <div className="w-10 h-px bg-gray-200 mx-auto mb-4" />
              <p className="text-primary-700 text-sm font-semibold leading-relaxed">
                نُلهم الشباب لبناء مستقبلٍ أفضل
              </p>
            </div>
          </motion.div>
        </div>

        {/* Left Panel: Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-primary-700">تسجيل الدخول</h1>
            <p className="text-sm text-gray-400 mt-2">أدخل بيانات حسابك للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 px-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@alhamni.org"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all text-right"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 px-1">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  دخول
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">حسابات تجريبية</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => { setEmail(a.email); setPassword(a.password); }}
                  className="text-right px-3 py-2 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
                >
                  <p className="text-[10px] font-bold text-gray-700 truncate">{a.name}</p>
                  <p className="text-[9px] text-primary-600 truncate opacity-70">{a.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
