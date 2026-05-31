"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getArticleById, newsArticles } from "@/lib/data/news";
import {
  Calendar, Clock, Tag, Share2, ArrowRight,
  ChevronLeft, User, BookOpen, MessageCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  "برامج":   { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0" },
  "شراكات":  { bg: "rgba(124,58,237,0.09)",  color: "#7C3AED" },
  "مبادرات": { bg: "rgba(5,150,105,0.09)",   color: "#059669" },
  "أخبار":   { bg: "rgba(59,91,160,0.09)",  color: "#3B5BA0" },
  "فعاليات": { bg: "rgba(217,119,6,0.09)",   color: "#D97706" },
};

function renderContent(text: string) {
  const paragraphs = text.split("\n\n");
  return paragraphs.map((para, i) => {
    if (para.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl font-black mt-8 mb-4" style={{ color: "#0F172A" }}>
          {para.replace("## ", "")}
        </h2>
      );
    }
    if (para.startsWith("- ")) {
      const items = para.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="space-y-2 my-4">
          {items.map((item, j) => {
            const parts = item.replace("- ", "").split(/\*\*(.*?)\*\*/);
            return (
              <li key={j} className="flex items-start gap-3 text-base leading-relaxed" style={{ color: "#64748B" }}>
                <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: "#3B5BA0" }} />
                <span>
                  {parts.map((p, k) => k % 2 === 1
                    ? <strong key={k} style={{ color: "#0F172A" }}>{p}</strong>
                    : p)}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }
    if (para.trim()) {
      return (
        <p key={i} className="text-base leading-loose mb-4" style={{ color: "#64748B" }}>
          {para}
        </p>
      );
    }
    return null;
  });
}

export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold" style={{ color: "#64748B" }}>المقال غير موجود</p>
        <Link href="/news" className="btn-primary">العودة للأخبار</Link>
      </div>
    );
  }

  const catStyle = categoryColors[article.category] ?? categoryColors["أخبار"];
  const related = newsArticles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2E4B88, #3B5BA0, #5072C0)" }}>
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 55%)" }} />

        <div className="container relative pt-36 pb-20">
          {/* Breadcrumb */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="font-medium text-white opacity-60 hover:opacity-90 transition-opacity">الرئيسية</Link>
            <ChevronLeft size={13} className="text-white opacity-40" />
            <Link href="/news" className="font-medium text-white opacity-60 hover:opacity-90 transition-opacity">الأخبار</Link>
            <ChevronLeft size={13} className="text-white opacity-40" />
            <span className="text-white opacity-85 font-semibold truncate max-w-xs">{article.title}</span>
          </motion.div>

          <div className="max-w-3xl">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex flex-wrap gap-3 mb-5">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Tag size={10} className="inline ml-1" />{article.category}
              </span>
              {article.featured && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.20)" }}>
                  مميز
                </span>
              )}
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-3xl md:text-4xl font-black text-white leading-snug mb-6">
              {article.title}
            </motion.h1>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-wrap items-center gap-5 text-sm"
              style={{ color: "rgba(255,255,255,0.72)" }}>
              <span className="flex items-center gap-2">
                <User size={14} style={{ color: "rgba(255,255,255,0.80)" }} />{article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} style={{ color: "rgba(255,255,255,0.80)" }} />{article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} style={{ color: "rgba(255,255,255,0.80)" }} />وقت القراءة: {article.readTime}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="section" style={{ background: "#F8FAFC" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Article Content */}
            <div className="lg:col-span-2">
              {/* Featured Image */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-3xl overflow-hidden mb-8"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.10)", aspectRatio: "16/8" }}>
                <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
              </motion.div>

              {/* Summary */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="p-6 rounded-3xl mb-8"
                style={{ background: "rgba(59,91,160,0.05)", border: "1px solid rgba(59,91,160,0.12)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen size={18} style={{ color: "#3B5BA0" }} />
                  <span className="text-sm font-bold" style={{ color: "#3B5BA0" }}>ملخص</span>
                </div>
                <p className="text-base leading-relaxed font-medium" style={{ color: "#64748B" }}>
                  {article.summary}
                </p>
              </motion.div>

              {/* Article body */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="card p-8 prose-custom">
                {renderContent(article.content)}
              </motion.div>

              {/* Tags */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold" style={{ color: "#64748B" }}>الوسوم:</span>
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(59,91,160,0.08)", color: "#3B5BA0", border: "1px solid rgba(59,91,160,0.14)" }}>
                    #{tag}
                  </span>
                ))}
              </motion.div>

              {/* Share */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="mt-6 card p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={17} style={{ color: "#94A3B8" }} />
                  <span className="text-sm font-bold" style={{ color: "#64748B" }}>هل أفادك هذا الخبر؟ شاركه مع أصدقائك</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "rgba(59,91,160,0.08)", color: "#3B5BA0" }}>
                  <Share2 size={14} /> مشاركة
                </button>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Article info */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card p-6 space-y-4">
                <h3 className="text-base font-black" style={{ color: "#0F172A" }}>معلومات الخبر</h3>
                {[
                  { label: "التصنيف",   val: article.category, icon: Tag },
                  { label: "التاريخ",   val: article.date,     icon: Calendar },
                  { label: "الكاتب",    val: article.author,   icon: User },
                  { label: "وقت القراءة", val: article.readTime, icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < 3 ? "1px solid #E2E8F0" : "none" }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8" }}>
                      <item.icon size={13} />{item.label}
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#64748B" }}>{item.val}</span>
                  </div>
                ))}
              </motion.div>

              {/* Related */}
              {related.length > 0 && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="card p-6">
                  <h3 className="text-base font-black mb-5" style={{ color: "#0F172A" }}>أخبار ذات صلة</h3>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <Link key={item.id} href={`/news/${item.id}`}
                        className="flex gap-3 group">
                        <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.img} alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors"
                            style={{ color: "#64748B" }}>
                            {item.title}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{item.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Back to news */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                <Link href="/news"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all"
                  style={{ background: "white", color: "#3B5BA0", border: "1px solid rgba(59,91,160,0.18)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <ArrowRight size={15} /> جميع الأخبار
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
