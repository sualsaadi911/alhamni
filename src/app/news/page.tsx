"use client";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag, Star, Clock } from "lucide-react";
import Link from "next/link";
import { useCms } from "@/lib/cms-context";
import ImageSlider from "@/components/ImageSlider";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const badgeStyles: Record<string, { bg: string; color: string }> = {
  "برامج":   { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0" },
  "شراكات":  { bg: "rgba(124,58,237,0.09)",  color: "#7C3AED" },
  "مبادرات": { bg: "rgba(5,150,105,0.09)",   color: "#059669" },
  "أخبار":   { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0" },
  "فعاليات": { bg: "rgba(217,119,6,0.09)",   color: "#D97706" },
};

export default function NewsPage() {
  const { news } = useCms();
  const featured = news.find((n) => n.featured);
  const rest = news.filter((n) => !n.featured);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">آخر المستجدات</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            الأخبار والتحديثات
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            تابع آخر أخبار وفعاليات مبادرة ألهمني
          </motion.p>
        </div>
      </div>

      {/* ── Featured ── */}
      {featured && (
        <section className="section container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative rounded-[2rem] p-10 md:p-14 text-white overflow-hidden shadow-2xl flex flex-col justify-end min-h-[500px]"
            style={{ background: "linear-gradient(135deg, #152451 0%, #3B5BA0 100%)" }}>
            
            <ImageSlider images={featured.images || [featured.img]} autoPlay={true} className="absolute inset-0 z-0 opacity-70" />
            
            <div className="absolute top-0 left-0 right-0 h-px z-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)" }} />
              
            <div className="relative z-10 max-w-3xl mt-auto">
              <div className="flex items-center gap-2 mb-6">
                <Star size={14} className="text-amber-400 drop-shadow-md" />
                <span className="text-xs font-black px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                  الخبر الأبرز
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-6 leading-[1.4] drop-shadow-lg text-white">{featured.title}</h2>
              <p className="text-lg leading-relaxed mb-10 font-medium" style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{featured.summary}</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm font-bold" style={{ color: "rgba(255,255,255,0.90)" }}>
                  <span className="flex items-center gap-1.5 drop-shadow-md"><Calendar size={14} /> {featured.date}</span>
                  {"readTime" in featured && <span className="flex items-center gap-1.5 drop-shadow-md"><Clock size={14} /> {featured.readTime}</span>}
                </div>
                {"id" in featured && (
                  <Link href={`/news/${featured.id}`}
                    className="flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg text-white"
                    style={{ background: "#3B5BA0", border: "1px solid #5072C0" }}>
                    اقرأ الخبر <ArrowLeft size={16} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── News Grid ── */}
      <section className="section-light">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((item, i) => {
              const badge = badgeStyles[item.category] || badgeStyles["أخبار"];
              return (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i % 3}
                  className="card flex flex-col group cursor-pointer overflow-hidden p-0 border-none shadow-md hover:shadow-xl">
                  
                  <div className="h-48 md:h-56 relative overflow-hidden bg-slate-100">
                     <ImageSlider images={item.images || [item.img]} autoPlay={false} className="w-full h-full" />
                     <div className="absolute top-4 right-4 z-10 flex items-center justify-between pointer-events-none w-[calc(100%-2rem)]">
                        <span className="text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md backdrop-blur-md"
                          style={{ background: "rgba(255,255,255,0.9)", color: badge.color }}>
                          <Tag size={12} /> {item.category}
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <span className="text-xs font-bold flex items-center gap-1.5 mb-4" style={{ color: "#94A3B8" }}>
                      <Calendar size={14} /> {item.date}
                    </span>
                    <h3 className="text-xl font-extrabold mb-4 leading-snug flex-1 transition-colors group-hover:text-primary-700" style={{ color: "#0F172A" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed mb-6 font-medium line-clamp-3" style={{ color: "#64748B" }}>{item.summary}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
                      {"readTime" in item && (
                        <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#94A3B8" }}>
                          <Clock size={14} /> {item.readTime}
                        </span>
                      )}
                      {"id" in item ? (
                        <Link href={`/news/${item.id}`}
                          className="flex items-center gap-2 font-black text-sm transition-all group-hover:gap-3"
                          style={{ color: "#3B5BA0" }}>
                          اقرأ <ArrowLeft size={16} />
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 font-black text-sm"
                          style={{ color: "#3B5BA0" }}>
                          اقرأ <ArrowLeft size={16} />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
