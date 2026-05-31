"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useServices } from "@/lib/services-context";
import { useCms } from "@/lib/cms-context";
import { ArrowRight, CheckCircle2, Send, Loader2, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { services, submitRequest } = useServices();
  const { settings } = useCms();
  const service = services.find(s => s.id === id);

  const [form, setForm]       = useState({ name: "", email: "", phone: "", details: "" });
  const [errors, setErrors]   = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg font-semibold">الخدمة غير موجودة</p>
        <Link href="/services" className="btn-primary">العودة للخدمات</Link>
      </div>
    );
  }

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim())    e.name    = "الاسم مطلوب";
    if (!form.email.trim())   e.email   = "البريد الإلكتروني مطلوب";
    if (!form.details.trim()) e.details = "يرجى توضيح طلبك";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitRequest({
        serviceId:    service.id,
        serviceTitle: service.title,
        name:         form.name,
        email:        form.email,
        phone:        form.phone,
        details:      form.details,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero with image */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        {service.image ? (
          <>
            <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </>
        ) : (
          <div style={{ background: "linear-gradient(135deg, #1A2E5B 0%, #3B5BA0 100%)" }} className="absolute inset-0" />
        )}
        <div className="relative z-10 container py-14">
          <Link href="/services" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors">
            <ArrowRight size={15} /> العودة للخدمات
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center text-3xl border border-white/20 flex-shrink-0 backdrop-blur-sm">
              {service.icon || "💼"}
            </div>
            <div>
              <span className="text-xs font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {service.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-3">{service.title}</h1>
              <p className="text-white/75 mt-2 text-base max-w-xl">{service.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Right: Details + Contact */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2 space-y-5">

            {/* Details card */}
            {service.details && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-bold text-gray-800 mb-3">تفاصيل الخدمة</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{service.details}</p>
              </div>
            )}

            {/* Contact card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-4">تواصل معنا مباشرة</h2>
              <div className="space-y-3">
                {settings.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#3B5BA012", color: "#3B5BA0" }}>
                      <Phone size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">الجوال</p>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-primary-600 transition-colors" dir="ltr">
                        {settings.contactPhone}
                      </p>
                    </div>
                  </a>
                )}
                {settings.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}?subject=طلب خدمة: ${service.title}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#05966912", color: "#059669" }}>
                      <Mail size={17} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">البريد الإلكتروني</p>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors" dir="ltr">
                        {settings.contactEmail}
                      </p>
                    </div>
                  </a>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 leading-relaxed text-center">
                    أو أرسل طلبك عبر النموذج وسنتواصل معك قريباً
                  </p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
              <p className="text-primary-700 text-sm font-semibold leading-relaxed">
                📌 بعد تقديم طلبك سيتواصل فريق ألهمني معك في أقرب وقت ممكن لمناقشة التفاصيل.
              </p>
            </div>
          </motion.div>

          {/* Left: Request form */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={36} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">تم إرسال طلبك بنجاح!</h3>
                  <p className="text-gray-500 mb-6">سيتواصل معك فريق ألهمني قريباً</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", details: "" }); }}
                      className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      طلب آخر
                    </button>
                    <Link href="/services" className="btn-primary text-sm">استعراض الخدمات</Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <MessageCircle size={20} className="text-primary-500" />
                    <h2 className="text-xl font-black text-gray-800">أرسل طلبك</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="محمد أحمد"
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.name ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
                          }`} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">رقم الجوال</label>
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="05xxxxxxxx" dir="ltr"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">البريد الإلكتروني *</label>
                      <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        type="email" placeholder="example@email.com" dir="ltr"
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
                        }`} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">تفاصيل طلبك *</label>
                      <textarea value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                        rows={5} placeholder="اشرح ما تحتاجه بالتفصيل..."
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                          errors.details ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
                        }`} />
                      {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
                    </div>
                    <button type="submit" disabled={submitting}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                      {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={15} />}
                      {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
