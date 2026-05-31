"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Instagram, Twitter } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const contactInfo = [
  { icon: Mail,      label: "البريد الإلكتروني", value: "inspiredme019@gmail.com",  href: "mailto:inspiredme019@gmail.com",  color: "#3B5BA0", bg: "rgba(59,91,160,0.07)",   border: "rgba(59,91,160,0.14)" },
  { icon: Phone,     label: "الهاتف",            value: "0560662474",               href: "tel:0560662474",                  color: "#059669", bg: "rgba(5,150,105,0.07)",    border: "rgba(5,150,105,0.15)" },
  { icon: Instagram, label: "إنستغرام",          value: "@alhumani_",               href: "https://instagram.com/alhumani_", color: "#9D174D", bg: "rgba(157,23,77,0.07)",    border: "rgba(157,23,77,0.14)" },
  { icon: Twitter,   label: "تويتر / X",          value: "@alhumani_",               href: "https://x.com/alhumani_",         color: "#2563EB", bg: "rgba(37,99,235,0.07)",    border: "rgba(37,99,235,0.15)" },
  { icon: Clock,     label: "أوقات العمل",        value: "الأحد – الخميس، ٨ص – ٤م", href: "#",                               color: "#D97706", bg: "rgba(217,119,6,0.07)",    border: "rgba(217,119,6,0.18)" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">نحن هنا</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            تواصل معنا
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            يسعدنا سماعك — تواصل معنا عبر أي من القنوات أدناه وسنرد عليك في أقرب وقت
          </motion.p>
        </div>
      </div>

      <section className="section container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Contact Info ── */}
          <div className="lg:col-span-2 space-y-4">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-xl font-black mb-7" style={{ color: "#0F172A" }}>
              قنوات التواصل
            </motion.h2>
            {contactInfo.map((info, i) => (
              <motion.a key={i} href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 block group"
                style={{ background: info.bg, border: `1px solid ${info.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${info.color}15`, border: `1px solid ${info.color}25` }}>
                  <info.icon size={20} style={{ color: info.color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "#94A3B8" }}>{info.label}</p>
                  <p className="font-black text-sm" style={{ color: "#0F172A" }}>{info.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* ── Form ── */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl p-16 text-center h-full flex flex-col items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)", border: "1px solid rgba(20,184,166,0.25)" }}>
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">تم إرسال رسالتك!</h3>
                <p style={{ color: "rgba(255,255,255,0.75)" }}>سيتواصل معك فريقنا خلال ٢٤ ساعة عمل.</p>
              </motion.div>
            ) : (
              <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="card-premium p-10 space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ color: "#0F172A" }}>أرسل رسالة</h2>
                  <p className="text-sm" style={{ color: "#64748B" }}>يسعدنا سماع أفكارك واستفساراتك</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">الاسم الكامل</label>
                    <input type="text" required placeholder="محمد العمري" className="input" />
                  </div>
                  <div>
                    <label className="label">البريد الإلكتروني</label>
                    <input type="email" required placeholder="example@email.com" className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">رقم الجوال <span className="font-normal" style={{ color: "#94A3B8" }}>(اختياري)</span></label>
                  <input type="tel" placeholder="05XXXXXXXX" className="input" />
                </div>
                <div>
                  <label className="label">الموضوع</label>
                  <input type="text" required placeholder="استفسار / اقتراح / شراكة..." className="input" />
                </div>
                <div>
                  <label className="label">الرسالة</label>
                  <textarea required rows={5} placeholder="اكتب رسالتك هنا..." className="input resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-base">
                  <Send size={18} />
                  إرسال الرسالة
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
