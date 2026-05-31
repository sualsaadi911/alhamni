"use client";
import { motion } from "framer-motion";
import { Eye, Target, BookOpen, Lightbulb, Compass, Users2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.10, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const timeline = [
  { year: "٢٠٢٠", title: "انطلاق المبادرة", desc: "انطلقت رحلة التطوع ضمن إمكانيات محدودة في مجالات الإرشاد والتوجيه، بهدف حل التحديات المشتركة بين الطلاب." },
  { year: "٢٠٢١", title: "أول كتيب للطلاب الملهمين", desc: "إطلاق أول كتيب يتضمن أفضل الطرق والممارسات الدراسية لرفع الأداء الأكاديمي، مع إضافة مقالات تنموية توجيهية." },
  { year: "٢٠٢٢", title: "الكتيب الثاني — المذاكرة الاحترافية", desc: "إطلاق الكتيب الثاني الذي يتناول أفضل طرق المذاكرة وفق أنماط الشخصيات، مع لقاءات وجلسات حوارية ملهمة." },
  { year: "٢٠٢٣", title: "كتاب سنة الامتياز", desc: "إطلاق أول كتاب لتجارب الطلاب خلال سنة الامتياز، استفاد منه أكثر من ٤٤ ألف طالب، وتم تبنيه في جامعة الملك سعود للعلوم الصحية." },
  { year: "٢٠٢٤", title: "انطلاقة جديدة بدعم مؤسسة مسك", desc: "بدعم كبير من مؤسسة مسك، انطلقت ألهمني مجدداً مع فريق عمل مبدع وأهداف راسخة، بتركيز على تنمية القدرات البشرية لدى الشباب." },
];

const goals = [
  { icon: BookOpen,  title: "التوجيه المعرفي",  desc: "نشارك تجارب ناجحة وقصص إلهام لتوجه الأفراد في رحلتهم وفق بروتوكولات والنماذج المعرفية." },
  { icon: Users2,    title: "خلق بيئة داعمة",   desc: "توفير بيئة تحفز وتشجع فئة الشباب وتدعمهم في رحلة السعي لتحقيق أهدافهم." },
  { icon: Target,    title: "تنمية المهارات",    desc: "تقديم برامج تدريبية وورش عمل تهدف إلى تطوير المهارات الأساسية والمهنية لدى الشباب." },
];

const values = [
  { icon: BookOpen,  title: "التعليم",           desc: "نسعى لتمكين الأفراد عبر توفير فرص التعلم والتطوير المستمر." },
  { icon: Lightbulb, title: "الإلهام",           desc: "نسعى لإلهام الأفراد وتشجيعهم على تحقيق أهدافهم الشخصية والمهنية." },
  { icon: Compass,   title: "التوجيه والإرشاد",  desc: "تقديم التوجيه للأفراد لمساعدتهم على تطوير مهاراتهم واتخاذ قرارات فعالة." },
  { icon: Target,    title: "التمكين",            desc: "نهدف إلى تمكين الشباب وزيادة المعرفة لديهم لبناء مستقبلهم المهني وبلوغ طموحاتهم." },
];

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">من نحن</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            عن مبادرة <span style={{ color: "#3B5BA0" }}>ألهمني</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            مبادرة تطوعية تهدف لتنمية القدرات البشرية — نُلهم الشباب ونُمكّنهم من صنع التغيير
          </motion.p>
        </div>
      </div>

      {/* ── Story ── */}
      <section className="section container">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="section-label">قصتنا</span>
            <h2 className="section-title">نبذة عن المبادرة</h2>
            <span className="cyan-line" />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #2E4B88 0%, #3B5BA0 60%, #5072C0 100%)" }}>
            <div className="absolute inset-0 hero-grid-pattern opacity-30 rounded-3xl pointer-events-none" />
            <p className="text-lg leading-loose text-center relative" style={{ color: "rgba(255,255,255,0.88)" }}>
              مبادرة <strong className="text-white">ألهمني</strong> هي مبادرة تطوعية تهدف لتنمية القدرات البشرية، انطلقت عام ٢٠٢٠ بفكرة تهدف إلى حل بعض التحديات المشتركة بين الطلاب. نحن لا نقدم حلولاً نظرية فقط، بل نخلق بيئة تحفز الشباب على التطور وتحقيق طموحاتهم — من مشاركة تجارب النجاح إلى بناء مجتمعات داعمة. في ٢٠٢٤ توسعنا بدعم من مؤسسة مسك مع فريق عمل مبدع وأهداف راسخة لدعم الشباب.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="section-light">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="section-label">توجهنا</span>
            <h2 className="section-title">الرؤية والرسالة</h2>
            <span className="cyan-line" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="rounded-3xl p-10 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #2E4B88 0%, #3B5BA0 60%, #5072C0 100%)" }}
            >
              <div className="absolute inset-0 hero-grid-pattern opacity-30 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <Eye size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">رؤيتنا</h3>
                <p className="leading-relaxed text-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
                  الريادة في تمكين الشباب بالمهارات الحياتية لصناعة جيل مؤثر يقود التغيير الإيجابي.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="card p-10"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.15)" }}>
                <Target size={28} style={{ color: "#3B5BA0" }} />
              </div>
              <h3 className="text-2xl font-black mb-4" style={{ color: "#0F172A" }}>رسالتنا</h3>
              <p className="leading-relaxed text-lg" style={{ color: "#64748B" }}>
                تمكين الشباب بمهارات حياتية ملهمة تعزز قدراتهم على اتخاذ القرار والتواصل لتحقيق طموحاتهم وتنمية مجتمعهم.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Goals ── */}
      <section className="section container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <span className="section-label">ما نسعى إليه</span>
          <h2 className="section-title">الأهداف الاستراتيجية</h2>
          <span className="cyan-line" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {goals.map((g, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="card-premium p-9 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.12)" }}>
                <g.icon size={28} style={{ color: "#3B5BA0" }} />
              </div>
              <h3 className="text-lg font-black mb-3" style={{ color: "#0F172A" }}>{g.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section-light">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="section-label">مبادئنا</span>
            <h2 className="section-title">قيمنا</h2>
            <span className="cyan-line" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="card p-7 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(59,91,160,0.07)", border: "1px solid rgba(59,91,160,0.10)" }}>
                  <v.icon size={24} style={{ color: "#3B5BA0" }} />
                </div>
                <h3 className="font-black mb-2" style={{ color: "#0F172A" }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <span className="section-label">مسيرتنا</span>
          <h2 className="section-title">رحلة ألهمني</h2>
          <span className="cyan-line" />
          <p className="section-subtitle">من فكرة صغيرة إلى مبادرة تأثيرها يمتد لأكثر من ٤٤ ألف طالب</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {timeline.map((item, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="flex gap-6 mb-7">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 relative z-10 text-white"
                  style={{ background: "linear-gradient(135deg, #3B5BA0, #5072C0)", boxShadow: "0 4px 16px rgba(59,91,160,0.35)" }}>
                  {item.year.slice(-2)}
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-0.5 flex-1 mt-2" style={{ background: "linear-gradient(180deg, rgba(59,91,160,0.30), rgba(59,91,160,0.05))" }} />
                )}
              </div>
              <div className="card-premium p-7 flex-1 mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "rgba(217,119,6,0.10)", color: "#D97706", border: "1px solid rgba(217,119,6,0.18)" }}>
                    {item.year}
                  </span>
                </div>
                <h3 className="font-black mb-2.5" style={{ color: "#0F172A" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-light">
        <div className="container max-w-2xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <CheckCircle2 size={48} className="mx-auto mb-5" style={{ color: "#3B5BA0" }} />
            <h2 className="text-2xl font-black mb-3" style={{ color: "#0F172A" }}>أنت جزء من هذه الرسالة</h2>
            <p className="mb-10 text-lg" style={{ color: "#64748B" }}>انضم إلينا كمتطوع أو تابعنا على منصات التواصل</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteer" className="btn-primary px-10 py-4 text-base">تطوع معنا</Link>
              <Link href="/contact"   className="btn-outline px-10 py-4 text-base">تواصل معنا</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
