"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useServices } from "@/lib/services-context";
import { Briefcase, Search } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CATEGORIES = ["الكل", "برمجة وتقنية", "استشارات", "تصميم", "قانوني", "تعليم", "أخرى"];

const DUMMY_SERVICES = [
  {
    id: "dummy-1",
    title: "تصميم موقع إلكتروني",
    description: "تصميم وتطوير مواقع احترافية متجاوبة مع جميع الأجهزة بأحدث التقنيات.",
    category: "برمجة وتقنية",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-2",
    title: "استشارة قانونية",
    description: "استشارات قانونية متخصصة في قانون الأعمال والعقود والنزاعات التجارية.",
    category: "قانوني",
    icon: "⚖️",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-3",
    title: "تصميم هوية بصرية",
    description: "تصميم شعار وهوية بصرية متكاملة تعكس قيم علامتك التجارية.",
    category: "تصميم",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-4",
    title: "استشارة مالية ومحاسبة",
    description: "خدمات محاسبية واستشارات مالية للأفراد والشركات الصغيرة والمتوسطة.",
    category: "استشارات",
    icon: "💰",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-5",
    title: "دورات تدريبية",
    description: "برامج تدريبية متخصصة في مهارات القيادة والتطوير الذاتي وريادة الأعمال.",
    category: "تعليم",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-6",
    title: "إدارة التواصل الاجتماعي",
    description: "إدارة احترافية لحساباتك على منصات التواصل الاجتماعي وإنتاج محتوى مميز.",
    category: "تصميم",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-7",
    title: "تطوير تطبيق جوال",
    description: "تطوير تطبيقات الجوال لنظامي iOS وAndroid بتصميم عصري وأداء عالٍ.",
    category: "برمجة وتقنية",
    icon: "📲",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-8",
    title: "تصوير احترافي",
    description: "خدمات التصوير الاحترافي للمنتجات والفعاليات والتصوير المعماري.",
    category: "أخرى",
    icon: "📷",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    isActive: true,
  },
  {
    id: "dummy-9",
    title: "كتابة المحتوى",
    description: "كتابة محتوى إبداعي واحترافي للمواقع والمدونات وحملات التسويق.",
    category: "أخرى",
    icon: "✍️",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    isActive: true,
  },
];

export default function ServicesPage() {
  const { services, loading } = useServices();
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("الكل");

  const displayServices = services.length > 0 ? services.filter(s => s.isActive) : DUMMY_SERVICES;

  const filtered = displayServices
    .filter(s => cat === "الكل" || s.category === cat)
    .filter(s => !search || s.title.includes(search) || s.description.includes(search));

  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero" style={{ background: "linear-gradient(135deg, #1A2E5B 0%, #3B5BA0 60%, #2B5CB0 100%)" }}>
        <div className="container py-24 text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <Briefcase size={36} className="text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl md:text-5xl font-black mb-4">خدماتنا</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
            className="text-lg text-white/80 max-w-xl mx-auto">
            خدمات متنوعة يقدمها فريق ألهمني — اطلب ما تحتاجه وسنتواصل معك
          </motion.p>
        </div>
      </div>

      <div className="container py-16">
        {/* ── Filters ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن خدمة..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  cat === c ? "bg-primary-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600"
                }`}>{c}</button>
            ))}
          </div>
        </motion.div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">لا توجد خدمات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <motion.div key={s.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                <Link href={`/services/${s.id}`}
                  className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-[16/9] relative overflow-hidden bg-primary-50">
                    {s.image ? (
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {s.icon || "💼"}
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold bg-white/90 backdrop-blur px-3 py-1 rounded-full text-primary-600">
                        {s.category}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{s.icon}</span>
                      <h3 className="text-gray-900 font-bold text-lg leading-snug">{s.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{s.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-primary-500 text-sm font-bold group-hover:underline">اطلب الخدمة</span>
                      <span className="text-gray-300 text-lg">←</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
