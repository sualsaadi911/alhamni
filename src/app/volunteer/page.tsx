"use client";
import { motion } from "framer-motion";
import { HandHeart, Clock, CheckCircle2, Award } from "lucide-react";
import { useState, useRef } from "react";
import { useVolunteerApplications } from "@/lib/volunteer-applications-context";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const benefits = [
  "اكتساب خبرات عملية قيمة في مجالات متنوعة",
  "بناء شبكة علاقات مهنية واجتماعية واسعة",
  "الحصول على شهادة تطوع معتمدة",
  "المشاركة في فعاليات ومؤتمرات المبادرة",
  "تطوير المهارات القيادية والتنظيمية",
  "الإسهام في أثر مجتمعي ملموس وحقيقي",
];

const opportunities = [
  { title: "منسق فعاليات",    desc: "المساعدة في تنظيم وإدارة الفعاليات والأنشطة.",                   hours: "٨–١٠ ساعات أسبوعياً", color: "#3B5BA0", bg: "rgba(59,91,160,0.08)",  label: "إداري" },
  { title: "مدرب متطوع",      desc: "تقديم ورش تدريبية في مجال تخصصك لفائدة المستفيدين.",             hours: "٤–٦ ساعات أسبوعياً",  color: "#059669", bg: "rgba(5,150,105,0.08)",  label: "تدريب" },
  { title: "متطوع ميداني",    desc: "المشاركة في الزيارات الميدانية وتقديم الدعم المباشر.",             hours: "٦–٨ ساعات أسبوعياً",  color: "#D97706", bg: "rgba(217,119,6,0.08)",  label: "ميداني" },
  { title: "مصمم جرافيك",     desc: "دعم المبادرة بتصميم مواد إعلامية للحملات والفعاليات.",            hours: "٤ ساعات أسبوعياً",    color: "#7C3AED", bg: "rgba(124,58,237,0.08)", label: "إبداعي" },
];

export default function VolunteerPage() {
  const { submitApplication } = useVolunteerApplications();
  const [submitted, setSubmitted] = useState(false);
  const nameRef    = useRef<HTMLInputElement>(null);
  const phoneRef   = useRef<HTMLInputElement>(null);
  const emailRef   = useRef<HTMLInputElement>(null);
  const programRef = useRef<HTMLSelectElement>(null);
  const msgRef     = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication({
      name:    nameRef.current?.value    || "",
      phone:   phoneRef.current?.value   || "",
      email:   emailRef.current?.value   || "",
      program: programRef.current?.value || "",
      message: msgRef.current?.value     || "",
    });
    setSubmitted(true);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(59,91,160,0.12)", border: "1px solid rgba(59,91,160,0.20)" }}>
            <HandHeart size={32} style={{ color: "#3B5BA0" }} />
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            تطوع معنا
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            وقتك وجهدك يصنعان الفرق — انضم لفريق المتطوعين وشارك في بناء مجتمع أفضل
          </motion.p>
        </div>
      </div>

      {/* ── Benefits ── */}
      <section className="section container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <span className="section-label">ما ستكسبه</span>
          <h2 className="section-title">لماذا تتطوع معنا؟</h2>
          <span className="cyan-line" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: "rgba(59,91,160,0.05)", border: "1px solid rgba(59,91,160,0.10)" }}>
              <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#3B5BA0" }} />
              <p className="font-semibold text-sm" style={{ color: "#0F172A" }}>{b}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Opportunities ── */}
      <section className="section-light">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="section-label">الأدوار المتاحة</span>
            <h2 className="section-title">فرص التطوع</h2>
            <span className="cyan-line" />
            <p className="section-subtitle">اختر الدور الذي يناسب مهاراتك</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((opp, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}
                className="card-premium p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: opp.bg, border: `1px solid ${opp.color}25` }}>
                      <HandHeart size={20} style={{ color: opp.color }} />
                    </div>
                    <h3 className="text-lg font-black" style={{ color: "#0F172A" }}>{opp.title}</h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
                    style={{ background: opp.bg, color: opp.color }}>
                    {opp.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#64748B" }}>{opp.desc}</p>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#94A3B8" }}>
                  <Clock size={14} />
                  <span>{opp.hours}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="section container">
        <div className="max-w-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="section-label">سجّل الآن</span>
            <h2 className="section-title">انضم لفريقنا</h2>
            <span className="cyan-line" />
            <p className="section-subtitle">أملأ النموذج وسنتواصل معك خلال ٣ أيام عمل</p>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-16 text-center"
              style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)", border: "1px solid rgba(20,184,166,0.25)" }}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Award size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">تم تسجيل طلبك!</h3>
              <p style={{ color: "rgba(255,255,255,0.75)" }}>سيتواصل معك فريقنا قريباً.</p>
            </motion.div>
          ) : (
            <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="card-premium p-10 space-y-6">
              <div>
                <label className="label">الاسم الكامل</label>
                <input ref={nameRef} type="text" required placeholder="محمد العمري" className="input" />
              </div>
              <div>
                <label className="label">رقم الجوال</label>
                <input ref={phoneRef} type="tel" required placeholder="05XXXXXXXX" className="input" />
              </div>
              <div>
                <label className="label">البريد الإلكتروني</label>
                <input ref={emailRef} type="email" required placeholder="example@email.com" className="input" />
              </div>
              <div>
                <label className="label">مجال التطوع المفضل</label>
                <select ref={programRef} required className="input" style={{ color: "#334155" }}>
                  <option value="">اختر المجال</option>
                  {opportunities.map((o) => (
                    <option key={o.title} value={o.title}>{o.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">نبذة مختصرة عنك وخبراتك</label>
                <textarea ref={msgRef} rows={4} placeholder="اكتب هنا..." className="input resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-base">
                <HandHeart size={18} />
                أرسل طلب التطوع
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
