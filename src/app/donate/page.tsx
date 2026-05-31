"use client";
import { motion } from "framer-motion";
import { Heart, CheckCircle, Shield, Users, TrendingUp, Star, Lock } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const amounts = [50, 100, 250, 500, 1000];

const impacts = [
  { icon: Users,     amount: "٥٠ ريال",   text: "وجبة غذائية لأسرة", color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.15)" },
  { icon: TrendingUp, amount: "١٠٠ ريال", text: "حصة تدريبية لشاب",   color: "#3B5BA0", bg: "rgba(59,91,160,0.08)", border: "rgba(59,91,160,0.15)" },
  { icon: Heart,     amount: "٢٥٠ ريال",  text: "دعم طالب لمدة شهر",  color: "#DC2626", bg: "rgba(220,38,38,0.07)",  border: "rgba(220,38,38,0.15)" },
  { icon: Star,      amount: "١٠٠٠ ريال", text: "تمويل مشروع مجتمعي", color: "#D97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.18)" },
];

export default function DonatePage() {
  const [selected, setSelected] = useState<number | null>(100);
  const [custom, setCustom]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(217,119,6,0.08) 0%, transparent 60%)" }} />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.22)" }}>
            <Heart size={32} fill="currentColor" style={{ color: "#D97706" }} />
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            تبرع معنا
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            تبرعك يُحدث فرقاً حقيقياً في حياة الشباب والمجتمع
          </motion.p>
        </div>
      </div>

      {/* ── Impact strip ── */}
      <section className="section-light">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="section-label">أثر تبرعك</span>
            <h2 className="section-title">تبرعك يساوي</h2>
            <span className="cyan-line" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {impacts.map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="rounded-3xl p-7 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: item.bg, border: `1px solid ${item.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${item.color}18` }}>
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <p className="text-2xl font-black mb-1.5" style={{ color: item.color }}>{item.amount}</p>
                <p className="text-sm font-semibold" style={{ color: "#64748B" }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="section container">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-16 text-center"
              style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0)", border: "1px solid rgba(20,184,166,0.25)" }}>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <CheckCircle size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">شكراً على تبرعك!</h3>
              <p style={{ color: "rgba(255,255,255,0.75)" }}>سيتم التواصل معك قريباً لإتمام عملية التبرع.</p>
            </motion.div>
          ) : (
            <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="card-premium p-10">
              <h2 className="text-2xl font-black mb-2" style={{ color: "#0F172A" }}>اختر مبلغ التبرع</h2>
              <p className="text-sm mb-8" style={{ color: "#64748B" }}>كل ريال يُساهم في بناء مجتمع أفضل</p>

              {/* Amount buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {amounts.map((amount) => (
                  <button key={amount} type="button"
                    onClick={() => { setSelected(amount); setCustom(""); }}
                    className="py-3.5 rounded-2xl font-black text-sm transition-all duration-200"
                    style={selected === amount ? {
                      background: "#D97706",
                      color: "white",
                      border: "2px solid transparent",
                      boxShadow: "0 4px 16px rgba(217,119,6,0.30)",
                    } : {
                      background: "rgba(217,119,6,0.05)",
                      color: "#D97706",
                      border: "2px solid rgba(217,119,6,0.15)",
                    }}>
                    {amount} ريال
                  </button>
                ))}
                <input type="number" placeholder="مبلغ آخر..." value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  className="col-span-3 input text-center font-black"
                  style={{ borderColor: !selected && custom ? "#D97706" : undefined }}
                  min="1"
                />
              </div>

              <div className="section-divider my-8" />

              {/* Personal info */}
              <div className="space-y-5">
                <div>
                  <label className="label">الاسم الكامل</label>
                  <input type="text" required placeholder="محمد العمري" className="input" />
                </div>
                <div>
                  <label className="label">رقم الجوال</label>
                  <input type="tel" required placeholder="05XXXXXXXX" className="input" />
                </div>
                <div>
                  <label className="label">البريد الإلكتروني <span className="font-normal" style={{ color: "#94A3B8" }}>(اختياري)</span></label>
                  <input type="email" placeholder="example@email.com" className="input" />
                </div>
              </div>

              <button type="submit" disabled={!selected && !custom}
                className="w-full mt-8 py-4 text-base rounded-2xl font-black text-white transition-all duration-300 flex items-center justify-center gap-2.5"
                style={{
                  background: (!selected && !custom) ? "#CBD5E1" : "#D97706",
                  color: "white",
                  boxShadow: (!selected && !custom) ? "none" : "0 6px 20px rgba(217,119,6,0.35)",
                  cursor: (!selected && !custom) ? "not-allowed" : "pointer",
                }}>
                <Heart size={18} fill="currentColor" />
                تبرع الآن
              </button>

              <p className="text-center text-xs mt-5 flex items-center justify-center gap-1.5" style={{ color: "#94A3B8" }}>
                <Lock size={11} /> جميع عمليات التبرع آمنة ومحمية
              </p>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
