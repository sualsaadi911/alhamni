"use client";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { getProjectById, projects } from "@/lib/data/projects";
import {
  MapPin, Calendar, Users, Target, CheckCircle2,
  Heart, ArrowRight, Share2, BookOpen, TrendingUp,
  ChevronLeft, DollarSign, Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  "تدريب":        { bg: "rgba(59,91,160,0.10)",  color: "#3B5BA0" },
  "دعم اجتماعي": { bg: "rgba(5,150,105,0.10)",   color: "#059669" },
  "توثيق":        { bg: "rgba(37,99,235,0.10)",   color: "#2563EB" },
  "بيئة":         { bg: "rgba(5,150,105,0.10)",   color: "#059669" },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = getProjectById(id);
  const [donateAmount, setDonateAmount] = useState<number | null>(100);
  const [donated, setDonated] = useState(false);

  if (!project) return notFound();

  const catStyle = categoryColors[project.category] ?? { bg: "rgba(59,91,160,0.10)", color: "#3B5BA0" };
  const related = projects.filter((p) => p.id !== project.id && p.category === project.category).slice(0, 2);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative pt-24 pb-0 overflow-hidden"
        style={{ background: "linear-gradient(165deg, #2E4B88 0%, #3B5BA0 60%, #5072C0 100%)" }}>
        <div className="absolute inset-0 hero-grid-pattern opacity-20 pointer-events-none" />

        <div className="container relative pt-12 pb-16">
          {/* Breadcrumb */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="font-medium opacity-60 hover:opacity-100 transition-opacity text-white">الرئيسية</Link>
            <ChevronLeft size={14} className="opacity-40 text-white" />
            <Link href="/projects" className="font-medium opacity-60 hover:opacity-100 transition-opacity text-white">المشاريع</Link>
            <ChevronLeft size={14} className="opacity-40 text-white" />
            <span className="text-white font-semibold opacity-90">{project.title}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                <span className="badge mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                  {project.category}
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                {project.title}
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.80)" }}>
                {project.desc}
              </motion.p>

              {/* Meta */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="flex flex-wrap gap-4">
                {[
                  { icon: MapPin,   val: project.location },
                  { icon: Calendar, val: project.year },
                  { icon: Users,    val: project.beneficiaries },
                  ...(project.budget ? [{ icon: DollarSign, val: project.budget }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.85)" }}>
                    <item.icon size={15} className="text-white opacity-70" />
                    {item.val}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Image */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.30)", aspectRatio: "16/10" }}>
              <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
              {/* Progress overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-bold">التقدم</span>
                  <span className="text-white font-black">{project.progress}٪</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #D97706, #F59E0B)" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="h-12 relative" style={{ background: "#F8FAFC" }}>
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{
            background: "linear-gradient(165deg, #2E4B88 0%, #3B5BA0 60%, #5072C0 100%)",
            clipPath: "ellipse(55% 100% at 50% 0%)",
          }} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="section" style={{ background: "#F8FAFC" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Full Description */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(59,91,160,0.10)" }}>
                    <BookOpen size={20} style={{ color: "#3B5BA0" }} />
                  </div>
                  <h2 className="text-xl font-black" style={{ color: "#0F172A" }}>عن المشروع</h2>
                </div>
                <p className="text-base leading-loose" style={{ color: "#64748B" }}>{project.fullDesc}</p>
              </motion.div>

              {/* Goals */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(59,91,160,0.10)" }}>
                    <Target size={20} style={{ color: "#3B5BA0" }} />
                  </div>
                  <h2 className="text-xl font-black" style={{ color: "#0F172A" }}>أهداف المشروع</h2>
                </div>
                <div className="space-y-3">
                  {project.goals.map((goal, i) => (
                    <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                      className="flex items-start gap-3 p-4 rounded-2xl"
                      style={{ background: "rgba(59,91,160,0.06)", border: "1px solid rgba(59,91,160,0.12)" }}>
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: "#3B5BA0" }} />
                      <p className="text-sm font-semibold" style={{ color: "#334155" }}>{goal}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Team */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(59,91,160,0.10)" }}>
                    <Users size={20} style={{ color: "#3B5BA0" }} />
                  </div>
                  <h2 className="text-xl font-black" style={{ color: "#0F172A" }}>الفريق</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.team.map((member, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                      style={{ background: "rgba(59,91,160,0.07)", border: "1px solid rgba(59,91,160,0.14)" }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                        style={{ background: "#3B5BA0" }}>
                        {member[0]}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "#3B5BA0" }}>{member}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donate Card */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card-premium p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "#D97706" }}>
                    <Heart size={18} className="text-white" />
                  </div>
                  <h3 className="text-lg font-black" style={{ color: "#0F172A" }}>ادعم هذا المشروع</h3>
                </div>

                {!donated ? (
                  <>
                    <p className="text-sm mb-5" style={{ color: "#64748B" }}>
                      تبرعك يُحدث فارقاً حقيقياً في حياة المستفيدين من هذا المشروع.
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[50, 100, 250].map((amt) => (
                        <button key={amt} onClick={() => setDonateAmount(amt)}
                          className="py-2.5 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: donateAmount === amt ? "#D97706" : "rgba(217,119,6,0.08)",
                            color: donateAmount === amt ? "white" : "#D97706",
                            border: donateAmount === amt ? "none" : "1px solid rgba(217,119,6,0.20)",
                            boxShadow: donateAmount === amt ? "0 4px 12px rgba(217,119,6,0.30)" : "none",
                          }}>
                          {amt} ريال
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setDonated(true)}
                      className="w-full btn-donate py-3 text-base font-black">
                      <Heart size={16} fill="currentColor" /> تبرع الآن
                    </button>
                    <Link href="/donate"
                      className="block text-center text-sm font-semibold mt-3 transition-colors"
                      style={{ color: "#3B5BA0" }}>
                      خيارات تبرع أخرى
                    </Link>
                  </>
                ) : (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(5,150,105,0.10)" }}>
                      <CheckCircle2 size={32} style={{ color: "#059669" }} />
                    </div>
                    <p className="text-lg font-black mb-1" style={{ color: "#059669" }}>شكراً لك!</p>
                    <p className="text-sm" style={{ color: "#64748B" }}>تبرعك وصل وسيُحدث فارقاً</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Project Stats */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-6 space-y-4">
                <h3 className="text-base font-black" style={{ color: "#0F172A" }}>تفاصيل المشروع</h3>
                {[
                  { label: "الحالة",          val: project.status === "active" ? "جارٍ" : project.status === "completed" ? "مكتمل" : "قادم", icon: TrendingUp },
                  { label: "الموقع",          val: project.location, icon: MapPin },
                  { label: "المستفيدون",      val: project.beneficiaries, icon: Users },
                  ...(project.startDate ? [{ label: "تاريخ البدء", val: project.startDate, icon: Calendar }] : []),
                  ...(project.endDate   ? [{ label: "تاريخ الانتهاء", val: project.endDate, icon: Clock }] : []),
                  ...(project.budget    ? [{ label: "الميزانية",   val: project.budget, icon: DollarSign }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < 4 ? "1px solid #E2E8F0" : "none" }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#64748B" }}>
                      <item.icon size={14} />
                      {item.label}
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#334155" }}>{item.val}</span>
                  </div>
                ))}
              </motion.div>

              {/* Share */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-5 flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "#334155" }}>شارك المشروع</span>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "rgba(59,91,160,0.08)", color: "#3B5BA0" }}>
                  <Share2 size={14} /> مشاركة
                </button>
              </motion.div>
            </div>
          </div>

          {/* Related Projects */}
          {related.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="section-title text-2xl">مشاريع ذات صلة</h2>
                <Link href="/projects" className="btn-ghost text-sm gap-1">
                  جميع المشاريع <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((p, i) => (
                  <motion.div key={p.id} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i} className="card overflow-hidden group">
                    <div className="h-44 overflow-hidden">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <span className="badge text-xs mb-2" style={catStyle}>{p.category}</span>
                      <h3 className="font-black mb-2" style={{ color: "#0F172A" }}>{p.title}</h3>
                      <p className="text-sm mb-4" style={{ color: "#64748B" }}>{p.desc}</p>
                      <Link href={`/projects/${p.id}`}
                        className="flex items-center gap-1.5 text-sm font-bold transition-colors"
                        style={{ color: "#3B5BA0" }}>
                        تفاصيل المشروع <ChevronLeft size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
