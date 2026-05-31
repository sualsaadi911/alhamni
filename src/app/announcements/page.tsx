"use client";
import { motion } from "framer-motion";
import { Megaphone, Calendar, Pin, ArrowLeft, Tag } from "lucide-react";
import { useState } from "react";
import { useCms } from "@/lib/cms-context";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const categories = ["الكل", "أخبار", "فعاليات", "مشاريع", "توظيف", "إعلانات"];

const catStyle: Record<string, { bg: string; color: string }> = {
  "فعاليات":  { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0" },
  "أخبار":    { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0" },
  "مشاريع":   { bg: "rgba(124,58,237,0.09)", color: "#7C3AED" },
  "توظيف":    { bg: "rgba(217,119,6,0.09)",  color: "#D97706" },
  "إعلانات":  { bg: "rgba(5,150,105,0.09)",  color: "#059669" },
};

export default function AnnouncementsPage() {
  const { announcements: cmsAnnouncements } = useCms();
  const [active, setActive] = useState("الكل");

  // Only show published announcements on the public page
  const published = cmsAnnouncements.filter(a => a.status === "منشور");
  const filtered = published.filter((a) => active === "الكل" || a.category === active);
  const pinned = filtered[0] || null;
  const rest   = filtered.slice(1);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">آخر الأخبار</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            الإعلانات
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            ابق على اطلاع بأحدث أخبار وفعاليات مبادرة ألهمني
          </motion.p>
        </div>
      </div>

      <section className="section container">
        {/* Filter pills */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200"
              style={active === cat ? {
                background: "#3B5BA0",
                color: "white",
                boxShadow: "0 4px 14px rgba(59,91,160,0.28)",
              } : {
                background: "white",
                color: "#64748B",
                border: "1px solid #E2E8F0",
              }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Pinned */}
        {pinned && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative rounded-[2rem] p-10 md:p-14 mb-8 text-white overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg, #152451 0%, #3B5BA0 100%)" }}>
            <div className="absolute inset-0 hero-grid-pattern opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <Pin size={14} className="text-white opacity-80" />
                <span className="text-xs font-bold px-4 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                  مثبّت
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold mb-5 leading-[1.4] text-white drop-shadow-sm">{pinned.title}</h2>
              <p className="text-lg leading-relaxed mb-8 font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{pinned.content}</p>
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "rgba(255,255,255,0.80)" }}>
                <Calendar size={14} /> {pinned.date}
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((ann, i) => {
            const badge = catStyle[ann.category] || catStyle["أخبار"];
            return (
              <motion.div key={ann.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
                className="card p-8 flex flex-col group cursor-pointer">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    style={{ background: badge.bg, color: badge.color }}>
                    <Tag size={10} /> {ann.category}
                  </span>
                  <span className="text-xs flex items-center gap-1.5" style={{ color: "#94A3B8" }}>
                    <Calendar size={12} /> {ann.date}
                  </span>
                </div>
                <h3 className="font-black mb-3 leading-snug flex-1" style={{ color: "#0F172A" }}>{ann.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#64748B" }}>{ann.content}</p>
                <span className="flex items-center gap-1.5 font-bold text-sm mt-auto transition-all group-hover:gap-2.5"
                  style={{ color: "#3B5BA0" }}>
                  اقرأ المزيد <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </span>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: "#94A3B8" }}>
            <Megaphone size={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-semibold">لا توجد نتائج مطابقة</p>
          </div>
        )}
      </section>
    </div>
  );
}
