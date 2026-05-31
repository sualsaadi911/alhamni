"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { useCms } from "@/lib/cms-context";
import { useServices } from "@/lib/services-context";
import {
  Heart, ArrowLeft, Users, HandHeart, Handshake, Phone,
  Sparkles, Quote, ChevronLeft, ChevronRight, Award, TrendingUp,
  CheckCircle2, Calendar, Newspaper, FolderOpen, Target, ArrowDown, Briefcase
} from "lucide-react";

/* ── Variants ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.10, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

/* ── Animated Counter ───────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: string; suffix?: string }) {
  // Extract number from string like "+٥٠٠٠"
  const numStr = target.replace(/[^0-9٥-٩]/g, '');
  // Map arabic numerals to english for parsing
  const englishNumStr = numStr.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  const parsedTarget = parseInt(englishNumStr || "0", 10);
  
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView || parsedTarget === 0) return;
    let v = 0;
    const step = Math.ceil(parsedTarget / 50);
    const t = setInterval(() => {
      v += step;
      if (v >= parsedTarget) { setCount(parsedTarget); clearInterval(t); }
      else setCount(v);
    }, 30);
    return () => clearInterval(t);
  }, [inView, parsedTarget]);

  return <span ref={ref}>{target.includes('+') ? '+' : ''}{count.toLocaleString("ar-SA")}{suffix}</span>;
}

/* ────────────────────────────────────────────────────────── */
/* ── Interactive Particles ──────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 3,
  opacity: Math.random() * 0.35 + 0.08,
  speed: Math.random() * 0.4 + 0.15,
}));

function InteractiveParticles({ primaryColor }: { primaryColor: string }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    });
  }, []);

  return (
    <div ref={ref} onMouseMove={onMouseMove} className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map(p => {
        const dx = (mouse.x - p.x / 100) * 60 * p.speed;
        const dy = (mouse.y - p.y / 100) * 60 * p.speed;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width:  p.size,
              height: p.size,
              background: primaryColor,
              opacity: p.opacity,
            }}
            animate={{ x: dx, y: dy }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          />
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { settings, projects, news } = useCms();
  const { services } = useServices();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  // Use only active projects and top 3 news
  const activeProjects = (projects || []).filter(p => p?.status === "active").slice(0, 3);
  const recentNews = (news || []).slice(0, 3);

  const testimonials = [
    { name: "سارة المطيري", role: "مستفيدة من البرامج تدريبية", text: "التجربة غيّرت منظوري تجاه المستقبل. حصلت على أدوات حقيقية للنجاح بفضل الورش العملية والتوجيه المستمر.", avatar: "س" },
    { name: "عمر الغامدي", role: "متطوع ومدرب", text: "التطوع مع ألهمني كان نقطة تحول. البيئة محفزة جداً والاحترافية في العمل الإداري تجعل كل دقيقة تقضيها هنا ذات قيمة عالية.", avatar: "ع" },
    { name: "أحمد الدوسري", role: "شريك استراتيجي", text: "منظمات غير ربحية قليلة تعمل بهذه الدرجة من الكفاءة والتأثير المباشر على حياة الشباب.", avatar: "أ" },
  ];

  return (
    <div className="overflow-hidden bg-slate-50">

      {/* ══════════════════════════════════════════
          HERO SECTION (Glassmorphic / Dynamic)
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden">
        {/* Interactive Particles */}
        <InteractiveParticles primaryColor={settings.primaryColor} />

        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-[80%] h-full pointer-events-none opacity-60"
             style={{ background: `radial-gradient(circle at 80% 20%, ${settings.primaryColor}15 0%, transparent 60%)` }} />
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-40 mix-blend-multiply"
             style={{ background: settings.goldColor }} />
        <div className="absolute -bottom-32 left-1/3 w-full h-96 pointer-events-none blur-3xl opacity-20 mix-blend-multiply"
             style={{ background: settings.primaryColor }} />

        <div className="container relative z-10 py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* ── Text Content (Right) ── */}
            <div className="lg:col-span-6 xl:col-span-5 text-right order-2 lg:order-1 pt-12 lg:pt-0">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 font-bold text-xs shadow-sm bg-white border border-slate-100"
                      style={{ color: settings.primaryColor }}>
                  <Sparkles size={14} className="animate-pulse" /> {settings.siteName} · {settings.siteTagline}
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-4xl lg:text-[3.5rem] font-extrabold leading-[1.35] mb-6 text-slate-900">
                {(settings?.heroTitle || "نُلهم الشباب لبناء مستقبل أفضل").split(' ').map((word, i, arr) => 
                  i === arr.length - 2 || i === arr.length - 1 
                  ? <span key={i} style={{ color: settings.primaryColor }} className="inline-block relative">
                      {word}&nbsp;
                      {i === arr.length - 1 && (
                        <svg className="absolute w-full h-3 -bottom-1 left-0 opacity-40 shrink-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                          <path d="M0 5 Q 50 10 100 5" stroke={settings.goldColor} strokeWidth="3" fill="transparent"/>
                        </svg>
                      )}
                    </span> 
                  : <span key={i}>{word} </span>
                )}
              </motion.h1>

              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-lg lg:text-xl leading-relaxed mb-10 text-slate-600 max-w-lg font-medium">
                {settings.heroSubtitle}
              </motion.p>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-wrap gap-4 items-center">
                <Link href="/donate" className="btn-donate px-8 py-4 text-base group overflow-hidden">
                  <Heart size={18} fill="currentColor" className="relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10 font-bold">تبرع الآن</span>
                </Link>
                <Link href="/about" className="px-8 py-4 rounded-2xl font-bold bg-white text-slate-800 border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 group">
                  اكتشف أثرنا <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* ── Visual Imagery Grid (Left) ── */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 relative h-[500px] lg:h-[700px] w-full">
              
              {/* Main Image Base */}
              <motion.div style={{ y: y1 }} className="absolute right-0 top-10 lg:top-20 w-[65%] lg:w-[70%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border-4 border-white">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                <img src={settings.heroImageUrl} alt="مبادرة شبابية" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />
              </motion.div>

              {/* Floating Glass Card 1 */}
              <motion.div style={{ y: y2 }} className="absolute bottom-12 right-12 z-30 max-w-[220px]">
                <div className="backdrop-blur-md bg-white/80 border border-white p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-white" style={{ background: settings.primaryColor }}>
                    <Award size={24} />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 mb-1">{settings.stat1Value}</h3>
                  <p className="text-sm font-bold text-slate-500">{settings.stat1Label}</p>
                </div>
              </motion.div>

              {/* Floating Image 2 */}
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 top-24 w-[45%] lg:w-[40%] h-[40%] rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-white">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                <img src={settings.aboutImageUrl} alt="فريق العمل" className="w-full h-full object-cover relative z-10" />
              </motion.div>
              
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">اكتشف</span>
          <div className="w-8 h-12 rounded-full border-2 border-slate-300 flex justify-center p-1">
            <motion.div animate={{ y: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-3 rounded-full bg-slate-400" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white relative z-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {[
              { val: settings.stat1Value, label: settings.stat1Label },
              { val: settings.stat2Value, label: settings.stat2Label },
              { val: settings.stat3Value, label: settings.stat3Label },
              { val: settings.stat4Value, label: settings.stat4Label },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 transition-colors duration-300 group-hover:text-primary-600"
                     style={{ color: settings.primaryColor }}>
                  <Counter target={s.val} />
                </div>
                <p className="font-bold text-slate-500 text-sm md:text-base">{s.label}</p>
                <div className="w-8 h-1 rounded-full mx-auto mt-4 transition-all duration-300 group-hover:w-16" style={{ background: settings.goldColor }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT MISSION
      ══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="container">
          <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-[0_20px_80px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            
            {/* BG pattern */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-[0.03]" style={{ background: settings.primaryColor }} />

            <div className="lg:w-1/2 order-2 lg:order-1 relative z-10 text-right">
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-6"
                    style={{ background: `${settings.goldColor}15`, color: settings.goldColor }}>
                <Target size={14} /> من نحن
              </span>
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold text-slate-900 leading-[1.3] mb-6">
                نحمل رسالة التأثير <br/> ونصنع <span style={{ color: settings.primaryColor }}>قادة المستقبل</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                {settings.aboutSummary}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex bg-slate-50 p-4 rounded-2xl gap-4 items-center border border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${settings.primaryColor}15`, color: settings.primaryColor }}><Users size={24} /></div>
                  <div><p className="font-black text-slate-900">بيئة تفاعلية</p><p className="text-xs text-slate-500 font-bold">تطوير مستمر للقدرات</p></div>
                </div>
                <div className="flex bg-slate-50 p-4 rounded-2xl gap-4 items-center border border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${settings.goldColor}15`, color: settings.goldColor }}><TrendingUp size={24} /></div>
                  <div><p className="font-black text-slate-900">أثر ممتد</p><p className="text-xs text-slate-500 font-bold">بناء مجتمع مزدهر</p></div>
                </div>
              </div>

              <Link href="/about" className="inline-flex items-center gap-2 font-black text-lg transition-colors hover:opacity-80" style={{ color: settings.primaryColor }}>
                اقرأ قصتنا كاملة <ArrowLeft size={20} />
              </Link>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2 w-full">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] group">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                <img src={settings.aboutImageUrl} alt="من نحن" className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 z-20 rounded-[2rem]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROJECTS SHOWCASE
      ══════════════════════════════════════════ */}
      {activeProjects.length > 0 && (
        <section className="py-24 bg-slate-900 relative overflow-hidden" style={{ background: settings.navyColor }}>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="container relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="text-right">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4 block">مبادراتنا الاستراتيجية</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">مشاريع تصنع الفارق</h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-colors">
                عرض كل المشاريع <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProjects.map((p, i) => (
                <motion.div key={p.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md group hover:-translate-y-2 transition-transform duration-300">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-black px-3 py-1.5 rounded-full z-10">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-bold text-xl text-white mb-3">{p.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2">{p.desc}</p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-white/50 mb-2 font-bold">
                        <span>نسبة الإنجاز</span>
                        <span className="text-white">{p.progress}٪</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full rounded-full" style={{ background: settings.goldColor }} />
                      </div>
                    </div>

                    <Link href="/projects" className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-colors">
                      التفاصيل <ArrowLeft size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════════ */}
      {services.filter(s => s.isActive).length > 0 && (
        <section className="py-24 bg-white">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="text-right">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4"
                  style={{ background: `${settings.primaryColor}12`, color: settings.primaryColor }}>
                  <Briefcase size={13} /> ما نقدمه لك
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3">خدماتنا</h2>
                <p className="text-slate-500 font-medium">خدمات متخصصة يقدمها فريق ألهمني — اطلب ما تحتاجه</p>
              </div>
              <Link href="/services"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all flex-shrink-0">
                كل الخدمات <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(s => s.isActive).slice(0, 6).map((s, i) => (
                <motion.div key={s.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link href={`/services/${s.id}`}
                    className="group flex flex-col bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full">
                    {/* Image */}
                    <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                      {s.image ? (
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl"
                          style={{ background: `${settings.primaryColor}10` }}>
                          {s.icon || "💼"}
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-bold bg-white/90 backdrop-blur px-3 py-1 rounded-full"
                          style={{ color: settings.primaryColor }}>
                          {s.category}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{s.icon || "💼"}</span>
                        <h3 className="font-black text-lg text-slate-900 leading-snug">{s.title}</h3>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-2">{s.description}</p>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 font-bold text-sm group-hover:gap-3 transition-all"
                        style={{ color: settings.primaryColor }}>
                        اطلب الخدمة <ArrowLeft size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           TESTIMONIALS (Premium Slider layout)
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-6"
                  style={{ background: `${settings.goldColor}15`, color: settings.goldColor }}>
              <Quote size={14} /> آراء وتجارب
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">أصوات من المجتمع</h2>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div key={testimonialIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="text-center">
                <Quote size={48} className="mx-auto mb-8 opacity-20" style={{ color: settings.primaryColor }} />
                <p className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-800 mb-10">"{testimonials[testimonialIdx].text}"</p>
                <div className="flex items-center justify-center gap-5 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                       style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.navyColor})` }}>
                    {testimonials[testimonialIdx].avatar}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-slate-900">{testimonials[testimonialIdx].name}</p>
                    <p className="text-sm font-bold text-slate-500">{testimonials[testimonialIdx].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-12">
              <button onClick={() => setTestimonialIdx(p => (p === 0 ? testimonials.length - 1 : p - 1))} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                <ChevronRight size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIdx(i)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ background: testimonialIdx === i ? settings.primaryColor : '#E2E8F0', width: testimonialIdx === i ? '24px' : '8px' }} />
                ))}
              </div>
              <button onClick={() => setTestimonialIdx(p => (p === testimonials.length - 1 ? 0 : p + 1))} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWS HIGHLIGHTS
      ══════════════════════════════════════════ */}
      {recentNews.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="text-right">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">أحدث الأخبار</h2>
                <p className="text-slate-500 font-bold">ابقَ على اطلاع دائم بآخر المستجدات والفعاليات</p>
              </div>
              <Link href="/news" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-white hover:shadow-sm transition-all">
                كل الأخبار <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentNews.map((n, i) => (
                <motion.div key={n.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={n.img} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur font-black text-xs px-3 py-1.5 rounded-full" style={{ color: settings.primaryColor }}>
                      {n.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5"><Calendar size={14}/> {n.date}</p>
                    <h3 className="font-black text-xl text-slate-900 mb-4 leading-snug">{n.title}</h3>
                    <Link href={`/news/${n.id}`} className="inline-flex items-center gap-2 text-sm font-black transition-colors group-hover:gap-3" style={{ color: settings.primaryColor }}>
                      اقرأ المزيد <ArrowLeft size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CALL TO ACTION
      ══════════════════════════════════════════ */}
      <section className="py-16 mb-8">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden bg-slate-900 shadow-2xl border border-slate-800"
          >
            {/* Elegant Background Accents (Glassmorphism Light Orbs) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.15] blur-[100px] rounded-full pointer-events-none transition-colors duration-1000" 
                 style={{ background: settings.primaryColor, transform: 'translate(40%, -40%)' }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-[0.15] blur-[100px] rounded-full pointer-events-none transition-colors duration-1000" 
                 style={{ background: settings.goldColor, transform: 'translate(-40%, 40%)' }} />
            
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest px-4 py-2 rounded-full mb-8 bg-white/5 text-slate-300 border border-white/10 uppercase backdrop-blur-md">
                <Heart size={14} style={{ color: settings.goldColor }} fill="currentColor" /> حان دورك
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-snug">
                نصنع أثراً باقياً.. <span style={{ color: settings.goldColor }}>معاً</span>
              </h2>
              
              <p className="text-lg text-slate-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                دعواتنا للجميع ليكونوا جزءاً من هذه الرحلة الملهمة. دعمك يساهم بشكل مباشر في تحقيق أحلام الكثير من الشباب وصناعة قادة المستقبل.
              </p>
              
              <div className="flex justify-center">
                <Link href="/donate" className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105"
                  style={{ background: settings.primaryColor, color: "white", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" }}>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <Heart size={20} className="relative z-10 drop-shadow-md" /> 
                  <span className="relative z-10 drop-shadow-md">ساهم بعطائك</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
