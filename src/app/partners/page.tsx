"use client";
import { motion } from "framer-motion";
import { Building2, User, Mail, Handshake } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const typeStyles: Record<string, { bg: string; color: string; border: string }> = {
  "راعي ذهبي":       { bg: "rgba(217,119,6,0.10)",  color: "#D97706", border: "rgba(217,119,6,0.22)" },
  "راعي فضي":        { bg: "rgba(100,116,139,0.09)", color: "#64748B", border: "rgba(100,116,139,0.18)" },
  "شريك استراتيجي":  { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0", border: "rgba(59,91,160,0.18)" },
  "شريك تنفيذي":     { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0", border: "rgba(59,91,160,0.18)" },
  "شريك تعليمي":     { bg: "rgba(5,150,105,0.09)",   color: "#059669", border: "rgba(5,150,105,0.18)" },
  "شريك مجتمعي":     { bg: "rgba(124,58,237,0.08)",  color: "#7C3AED", border: "rgba(124,58,237,0.16)" },
};

const corporatePartners = [
  { name: "مؤسسة مسك",               type: "شريك استراتيجي", field: "التنمية الشبابية" },
  { name: "شركة الأفق للتطوير",       type: "راعي ذهبي",      field: "قطاع التقنية" },
  { name: "مجموعة النور التجارية",    type: "راعي فضي",       field: "قطاع الأعمال" },
  { name: "مؤسسة الريادة",            type: "شريك استراتيجي", field: "ريادة الأعمال" },
  { name: "مركز التدريب المتقدم",     type: "شريك تعليمي",   field: "التدريب والتطوير" },
  { name: "جمعية رجال الأعمال",       type: "شريك مجتمعي",   field: "القطاع التجاري" },
];

const individualPartners = [
  { name: "أ. محمد العمري",  role: "داعم مؤسس" },
  { name: "د. سارة الزهراني", role: "مرشدة متطوعة" },
  { name: "م. خالد الحربي",  role: "داعم استراتيجي" },
  { name: "أ. نورة العتيبي", role: "سفيرة المبادرة" },
];

export default function PartnersPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">داعمونا</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            شركاؤنا
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            نفخر بشراكاتنا مع مؤسسات وأفراد يؤمنون بقيمة العطاء ودعم المجتمع
          </motion.p>
        </div>
      </div>

      {/* ── Corporate Partners ── */}
      <section className="section container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.15)" }}>
              <Building2 size={24} style={{ color: "#3B5BA0" }} />
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: "#0F172A" }}>الشركاء المؤسسيون</h2>
              <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>المؤسسات والشركات الداعمة</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {corporatePartners.map((p, i) => {
            const style = typeStyles[p.type] || typeStyles["شريك مجتمعي"];
            return (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
                className="card-premium p-7 flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.12)" }}>
                  <Building2 size={24} style={{ color: "#3B5BA0" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black mb-1 truncate" style={{ color: "#0F172A" }}>{p.name}</h3>
                  <p className="text-xs mb-3" style={{ color: "#94A3B8" }}>{p.field}</p>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full inline-block"
                    style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                    {p.type}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Individual Partners ── */}
      <section className="section-light">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.14)" }}>
                <User size={24} style={{ color: "#7C3AED" }} />
              </div>
              <div>
                <h2 className="text-2xl font-black" style={{ color: "#0F172A" }}>الشركاء الأفراد</h2>
                <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>أفراد يدعمون رسالتنا</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {individualPartners.map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="card p-7 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.12)" }}>
                  <User size={26} style={{ color: "#3B5BA0" }} />
                </div>
                <h3 className="font-black text-sm mb-1.5" style={{ color: "#0F172A" }}>{p.name}</h3>
                <p className="text-xs" style={{ color: "#64748B" }}>{p.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section container max-w-3xl">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative rounded-3xl p-12 text-center text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)" }}>
          <div className="absolute inset-0 hero-grid-pattern opacity-20 pointer-events-none" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Handshake size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black mb-3">كن شريكاً معنا</h2>
            <p className="mb-8 text-lg" style={{ color: "rgba(255,255,255,0.80)" }}>
              انضم إلى قائمة شركائنا وكن جزءاً من التغيير المجتمعي الإيجابي
            </p>
            <a href="mailto:inspiredme019@gmail.com"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-black transition-all hover:scale-[1.03] text-white"
              style={{ background: "#D97706", boxShadow: "0 6px 20px rgba(217,119,6,0.35)" }}>
              <Mail size={16} /> تواصل معنا للشراكة
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
