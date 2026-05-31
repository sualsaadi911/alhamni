"use client";
import { motion } from "framer-motion";
import { FileText, Download, Users, TrendingUp, DollarSign, CheckSquare, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const reports = [
  { year: "٢٠٢٤", title: "التقرير السنوي ٢٠٢٤", desc: "ملخص شامل لأنشطة المبادرة وإنجازاتها المالية والبرامجية.", pages: "٤٨ صفحة", size: "٣.٢ ميغابايت" },
  { year: "٢٠٢٣", title: "التقرير السنوي ٢٠٢٣", desc: "استعراض تفصيلي لمشاريع وبرامج المبادرة والتقرير المالي المدقق.", pages: "٤٢ صفحة", size: "٢.٨ ميغابايت" },
  { year: "٢٠٢٢", title: "التقرير السنوي ٢٠٢٢", desc: "نتائج ومؤشرات الأداء للعام الثالث من تأسيس المبادرة.", pages: "٣٦ صفحة", size: "٢.١ ميغابايت" },
];

const highlights = [
  { icon: Users,       value: "+٤٤K", label: "طالب مستفيد",   color: "#3B5BA0" },
  { icon: TrendingUp,  value: "٤٥",   label: "لقاء تدريبي",    color: "#059669" },
  { icon: DollarSign,  value: "٩٢٪",  label: "تذهب للبرامج",  color: "#D97706" },
  { icon: CheckSquare, value: "+٥٠٠", label: "ساعة تطوعية",    color: "#7C3AED" },
];

export default function ReportsPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">الشفافية</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            التقارير السنوية
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            نُفصح بشكل كامل عن أنشطتنا وإدارتنا للموارد — ثقتكم أمانة عندنا
          </motion.p>
        </div>
      </div>

      {/* ── Highlights ── */}
      <section className="py-0">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {highlights.map((h, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="text-center py-14 px-6"
              style={{
                background: i % 2 === 0 ? "linear-gradient(135deg, #2E4B88, #3B5BA0)" : "linear-gradient(135deg, #3B5BA0, #5072C0)",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none",
              }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <h.icon size={22} className="text-white" />
              </div>
              <p className="text-4xl font-black text-white mb-1.5">{h.value}</p>
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>{h.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Reports List ── */}
      <section className="section container max-w-3xl">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-14">
          <span className="section-label">التقارير المتاحة</span>
          <h2 className="section-title">حمّل التقارير</h2>
          <span className="cyan-line" />
          <p className="section-subtitle">جميع التقارير متاحة للتحميل المجاني</p>
        </motion.div>

        <div className="space-y-5">
          {reports.map((r, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="card-premium p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.14)" }}>
                <FileText size={26} style={{ color: "#3B5BA0" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "rgba(217,119,6,0.10)", color: "#D97706", border: "1px solid rgba(217,119,6,0.18)" }}>
                    {r.year}
                  </span>
                </div>
                <h3 className="font-black mb-1.5" style={{ color: "#0F172A" }}>{r.title}</h3>
                <p className="text-sm mb-1" style={{ color: "#64748B" }}>{r.desc}</p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>{r.pages} · {r.size}</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.03] flex-shrink-0"
                style={{ background: "#3B5BA0", color: "white", boxShadow: "0 4px 14px rgba(59,91,160,0.28)" }}>
                <Download size={16} /> تحميل
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-8 p-7 rounded-3xl flex items-start gap-4"
          style={{ background: "rgba(59,91,160,0.05)", border: "1px solid rgba(59,91,160,0.12)" }}>
          <Shield size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#3B5BA0" }} />
          <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>
            جميع تقاريرنا المالية خاضعة لمراجعة مدققين خارجيين مستقلين. نلتزم بأعلى معايير الشفافية في إدارة الأموال والموارد.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
