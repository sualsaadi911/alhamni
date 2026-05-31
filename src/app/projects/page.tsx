"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Rocket, Clock, Users, Tag, ArrowLeft, MapPin, Calendar, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCms } from "@/lib/cms-context";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const currentProjects = [
  {
    title: "برنامج القيادة الشبابية",
    category: "تدريب",
    progress: 70,
    desc: "برنامج تدريبي متكامل لتنمية المهارات القيادية لدى الشباب بأساليب عملية وتفاعلية.",
    location: "الرياض",
    year: "٢٠٢٥",
    beneficiaries: "٥٠ متدرب",
    img: "https://picsum.photos/seed/lead11/700/420",
    color: "#3B5BA0",
  },
  {
    title: "مبادرة دعم الأسر المحتاجة",
    category: "دعم اجتماعي",
    progress: 55,
    desc: "تقديم الدعم المادي والمعنوي للأسر المحتاجة في المجتمع المحلي خلال المناسبات.",
    location: "جدة",
    year: "٢٠٢٥",
    beneficiaries: "+٢٠٠ أسرة",
    img: "https://picsum.photos/seed/fam22/700/420",
    color: "#059669",
  },
  {
    title: "مشروع الأرشيف المجتمعي",
    category: "توثيق",
    progress: 40,
    desc: "توثيق قصص النجاح والمبادرات المحلية لتكون مصدر إلهام للأجيال القادمة.",
    location: "أونلاين",
    year: "٢٠٢٥",
    beneficiaries: "مجتمعي",
    img: "https://picsum.photos/seed/arch33/700/420",
    color: "#2563EB",
  },
  {
    title: "حملة التوعية البيئية",
    category: "بيئة",
    progress: 85,
    desc: "فعاليات توعوية حول أهمية الاستدامة البيئية وحماية البيئة في مجتمعاتنا.",
    location: "الرياض",
    year: "٢٠٢٥",
    beneficiaries: "+١٠٠٠ مشارك",
    img: "https://picsum.photos/seed/env44/700/420",
    color: "#059669",
  },
];

const futureProjects = [
  { title: "مركز إلهامي للتطوير المهني",   desc: "مركز متخصص يوفر دورات احترافية وفرص توظيف للشباب في مختلف المجالات.",             year: "٢٠٢٥", icon: "🏛️", color: "#3B5BA0" },
  { title: "منصة التطوع الرقمي",            desc: "منصة تربط المتطوعين بالمشاريع المجتمعية بشكل سهل وفعّال عبر الإنترنت.",          year: "٢٠٢٥", icon: "💻", color: "#7C3AED" },
  { title: "مشروع الصندوق التكافلي",        desc: "صندوق دائم لدعم الحالات الطارئة والأسر ذات الدخل المحدود بآليات شفافة.",         year: "٢٠٢٦", icon: "💰", color: "#D97706" },
  { title: "برنامج الإرشاد والمرافقة",      desc: "ربط الشباب الطموح بمرشدين متخصصين لمساعدتهم في مساراتهم المهنية والأكاديمية.",   year: "٢٠٢٦", icon: "🎯", color: "#059669" },
];

const badgeStyles: Record<string, { bg: string; color: string }> = {
  "تدريب":        { bg: "rgba(59,91,160,0.10)",  color: "#3B5BA0" },
  "دعم اجتماعي": { bg: "rgba(5,150,105,0.10)",   color: "#059669" },
  "توثيق":        { bg: "rgba(37,99,235,0.10)",   color: "#2563EB" },
  "بيئة":         { bg: "rgba(5,150,105,0.10)",   color: "#059669" },
};

const allCategories = ["الكل", "تدريب", "دعم اجتماعي", "توثيق", "بيئة"];

export default function ProjectsPage() {
  const { projects: allProjects } = useCms();
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filtered = activeFilter === "الكل"
    ? allProjects
    : allProjects.filter(p => p.category === activeFilter);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label">ما نعمل عليه</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            مشاريعنا
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            مشاريع حالية ومستقبلية تُحدث أثراً حقيقياً في حياة الأفراد والمجتمعات
          </motion.p>
          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { label: "٤ مشاريع نشطة", icon: CheckCircle2 },
              { label: "٤ مشاريع مستقبلية", icon: Rocket },
              { label: "+١٢٠٠ مستفيد", icon: Users },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.15)" }}>
                <item.icon size={14} style={{ color: "#3B5BA0" }} />
                <span className="text-sm font-bold" style={{ color: "#0F172A" }}>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Current Projects ── */}
      <section className="section container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.15)" }}>
                <CheckCircle2 size={24} style={{ color: "#3B5BA0" }} />
              </div>
              <div>
                <h2 className="text-2xl font-black" style={{ color: "#0F172A" }}>المشاريع الحالية</h2>
                <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>جارية التنفيذ الآن</p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200"
                  style={activeFilter === cat ? {
                    background: "#3B5BA0",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(59,91,160,0.28)",
                  } : {
                    background: "rgba(59,91,160,0.07)",
                    color: "#3B5BA0",
                    border: "1px solid rgba(59,91,160,0.12)",
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filtered.map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden group"
              style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>

              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(15,23,42,0.80) 100%)" }} />
                {/* Overlay badges */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90"
                    style={{ color: (badgeStyles[p.category] || badgeStyles["توثيق"]).color }}>
                    <Tag size={9} className="inline ml-1" />{p.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-lg font-black text-white leading-snug">{p.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {p.location}</span>
                    <span className="flex items-center gap-1"><Users size={10} /> {p.beneficiaries}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {p.year}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748B" }}>{p.desc}</p>
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2.5">
                    <span style={{ color: "#94A3B8" }}>نسبة الإنجاز</span>
                    <span className="font-black" style={{ color: "#3B5BA0" }}>{p.progress}٪</span>
                  </div>
                  <div className="progress-track">
                    <motion.div className="progress-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/projects/${p.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: "rgba(59,91,160,0.08)", color: "#3B5BA0", border: "1px solid rgba(59,91,160,0.15)" }}>
                    تفاصيل المشروع <ArrowLeft size={14} />
                  </Link>
                  <Link href="/donate"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: "rgba(217,119,6,0.10)", color: "#D97706", border: "1px solid rgba(217,119,6,0.20)" }}>
                    <Heart size={14} fill="currentColor" /> تبرع
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Future Projects ── */}
      <section className="section-light">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(217,119,6,0.10)", border: "1px solid rgba(217,119,6,0.18)" }}>
                <Rocket size={24} style={{ color: "#D97706" }} />
              </div>
              <div>
                <h2 className="text-2xl font-black" style={{ color: "#0F172A" }}>المشاريع المستقبلية</h2>
                <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>خططنا وطموحاتنا القادمة</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureProjects.map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}
                className="bg-white rounded-3xl p-8 flex gap-5 group cursor-default transition-all duration-300"
                style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {/* Emoji icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${p.color}0F`, border: `1px solid ${p.color}18` }}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={13} style={{ color: "#D97706" }} />
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: "rgba(217,119,6,0.10)", color: "#D97706" }}>
                      المستهدف {p.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mb-2 leading-snug" style={{ color: "#0F172A" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{p.desc}</p>
                  <div className="flex items-center gap-1.5 mt-4 text-sm font-bold group-hover:gap-2.5 transition-all"
                    style={{ color: p.color }}>
                    قريباً <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section container max-w-2xl text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(59,91,160,0.08)", border: "1px solid rgba(59,91,160,0.15)" }}>
            <Rocket size={28} style={{ color: "#3B5BA0" }} />
          </div>
          <h2 className="text-2xl font-black mb-3" style={{ color: "#0F172A" }}>ادعم مشاريعنا</h2>
          <p className="mb-10 text-lg" style={{ color: "#64748B" }}>تبرعك يُحدث فرقاً مباشراً في حياة المستفيدين</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-donate px-10 py-4 text-base">تبرع الآن</a>
            <a href="/volunteer" className="btn-outline px-10 py-4 text-base">تطوع معنا</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
