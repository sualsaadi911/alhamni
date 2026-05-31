"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Shield, Scale, BookOpen, ChevronDown, Download,
  DollarSign, Users, Award, CheckCircle2, AlertCircle,
  Eye, Building2, ClipboardList, TrendingUp, ExternalLink,
  Calendar, ArrowLeft, Lock,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useGovernance } from "@/lib/governance-context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Data ─────────────────────────────────────────────────── */
const principles = [
  { title: "الشفافية",  desc: "نُفصح عن قراراتنا وميزانياتنا للأعضاء والجمهور بشكل دوري ومنتظم.",          icon: Eye,    color: "#3B5BA0" },
  { title: "المساءلة",  desc: "كل مسؤول يُقدم تقاريره للهيئة المختصة بانتظام، ونتحمل مسؤولية قراراتنا.",  icon: Scale,  color: "#D97706" },
  { title: "النزاهة",   desc: "لا تسامح مع أي شكل من أشكال الفساد أو تضارب المصالح في عمل المبادرة.",      icon: Shield, color: "#2E4B88" },
];

const govDocs = [
  { icon: FileText, title: "النظام الأساسي للمبادرة",    desc: "الوثيقة التأسيسية التي تحدد هدف المبادرة وطريقة عملها.",       date: "٢٠٢٠", size: "١.٢ م" },
  { icon: Scale,    title: "سياسة الحوكمة",              desc: "مبادئ الشفافية والمساءلة التي تلتزم بها المبادرة.",            date: "٢٠٢٢", size: "٠.٨ م" },
  { icon: Shield,   title: "سياسة مكافحة الفساد",        desc: "إجراءات صارمة لضمان النزاهة في جميع أعمال المبادرة.",         date: "٢٠٢٣", size: "٠.٦ م" },
  { icon: BookOpen, title: "لائحة العمل الداخلية",        desc: "تنظيم أعمال الفريق القيادي والإجراءات الداخلية للمبادرة.",   date: "٢٠٢١", size: "٠.٥ م" },
  { icon: Users,    title: "لائحة الأعضاء والمتطوعين",    desc: "شروط العضوية وحقوق وواجبات المتطوعين والأعضاء.",             date: "٢٠٢٢", size: "٠.٤ م" },
  { icon: ClipboardList, title: "سياسة إدارة المخاطر",   desc: "إطار متكامل لتحديد المخاطر والتعامل معها بفعالية.",           date: "٢٠٢٣", size: "٠.٧ م" },
];

const financialStatements = [
  {
    year: "٢٠٢٤",
    quarter: "Q4",
    title: "القوائم المالية السنوية ٢٠٢٤",
    type: "سنوي",
    audited: true,
    summary: "إجمالي الإيرادات: ١٢٠,٠٠٠ ريال | الإنفاق البرامجي: ١٠٨,٠٠٠ ريال (٩٠٪)",
    items: [
      { label: "إجمالي الإيرادات",     value: "١٢٠,٠٠٠ ريا",  color: "#3B5BA0" },
      { label: "الإنفاق البرامجي",     value: "١٠٨,٠٠٠ ريا",  color: "#2E4B88" },
      { label: "المصاريف الإدارية",    value: "١٢,٠٠٠ ريا",   color: "#D97706" },
      { label: "رصيد الاحتياطي",      value: "٨,٥٠٠ ريا",    color: "#5072C0" },
    ],
  },
  {
    year: "٢٠٢٣",
    quarter: "Q4",
    title: "القوائم المالية السنوية ٢٠٢٣",
    type: "سنوي",
    audited: true,
    summary: "إجمالي الإيرادات: ٩٥,٠٠٠ ريال | الإنفاق البرامجي: ٨٥,٠٠٠ ريال (٨٩٪)",
    items: [
      { label: "إجمالي الإيرادات",     value: "٩٥,٠٠٠ ريا",   color: "#3B5BA0" },
      { label: "الإنفاق البرامجي",     value: "٨٥,٠٠٠ ريا",   color: "#2E4B88" },
      { label: "المصاريف الإدارية",    value: "١٠,٠٠٠ ريا",   color: "#D97706" },
      { label: "رصيد الاحتياطي",      value: "٦,٢٠٠ ريا",    color: "#5072C0" },
    ],
  },
];

const complianceCerts = [
  { title: "شهادة التسجيل الرسمي", issuer: "وزارة الموارد البشرية والتنمية الاجتماعية", date: "٢٠٢٠", status: "سارية", number: "١٢٣٤٥٦", color: "#3B5BA0", icon: Award },
  { title: "شهادة الامتثال الضريبي", issuer: "هيئة الزكاة والضريبة والجمارك", date: "٢٠٢٤", status: "سارية", number: "ZT-٢٠٢٤-٧٨٩", color: "#2E4B88", icon: CheckCircle2 },
  { title: "شهادة حوكمة المنظمات", issuer: "مركز الملك عبدالعزيز للحوار الوطني", date: "٢٠٢٣", status: "سارية", number: "GOV-٢٠٢٣-٢٢١", color: "#5072C0", icon: Building2 },
];

const disclosureItems = [
  { label: "نسبة الإنفاق المباشر على البرامج", value: "٩٠٪ أو أكثر",        color: "#3B5BA0", icon: TrendingUp },
  { label: "تكرار التدقيق المالي",                 value: "سنوياً",               color: "#2E4B88", icon: ClipboardList },
  { label: "نشر التقارير السنوية",                 value: "عام كامل",              color: "#5072C0", icon: Eye },
  { label: "مدة انتداب أعضاء الفريق",             value: "سنتان قابلة للتجديد",   color: "#D97706", icon: Users },
];

const faqs = [
  { q: "كيف يتم اختيار أعضاء فريق القيادة؟",  a: "يتم اختيار أعضاء الفريق القيادي وفق معايير موضوعية شفافة تعتمد على الكفاءة والخبرة، مع مراعاة التنوع والتمثيل." },
  { q: "كم مرة يجتمع الفريق القيادي؟",         a: "يجتمع الفريق القيادي دورياً كل ثلاثة أشهر على الأقل، وعند الحاجة لاجتماعات طارئة." },
  { q: "كيف يتم ضمان الشفافية المالية؟",       a: "تُراجَع حسابات المبادرة دورياً وتُنشر التقارير للداعمين والأعضاء. نلتزم بصرف أكثر من ٩٠٪ مباشرةً على البرامج." },
  { q: "هل يمكن الاطلاع على محاضر الاجتماعات؟", a: "نعم، محاضر الجمعيات العمومية متاحة للأعضاء المسجلين والجهات الرقابية المعنية عند الطلب." },
];

const tabs = [
  { id: "overview",       label: "نظرة عامة",         icon: Eye },
  { id: "transparency",   label: "معيار الشفافية",     icon: Shield },
  { id: "documents",      label: "اللوائح والوثائق",   icon: FileText },
  { id: "financial",      label: "القوائم المالية",    icon: DollarSign },
  { id: "compliance",     label: "شهادات الامتثال",    icon: Award },
] as const;

type TabId = typeof tabs[number]["id"];

/* ── Main Component ────────────────────────────────────────── */
export default function GovernancePage() {
  const { state, getSummary } = useGovernance();
  const summary = getSummary();
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [openFS, setOpenFS] = useState<number | null>(0);

  return (
    <div>
      {/* ── Corporate Hero ── */}
      <div className="pt-40 pb-20 relative bg-white border-b border-slate-200">
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label"><Shield size={13} /> الامتثال والنزاهة</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} 
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 leading-snug">
            الحوكمة والشفافية
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} 
            className="text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
            نلتزم بأعلى معايير الحوكمة المؤسسية والشفافية المطلقة. تعكس أرقامنا ووثائقنا مسؤوليتنا تجاه شركائنا والمجتمع.
          </motion.p>
        </div>
      </div>

      {/* ── Corporate Tabs (Segmented Underline) ── */}
      <div className="sticky top-[73px] z-30 bg-white border-b border-slate-200">
        <div className="container">
          <div className="flex overflow-x-auto gap-8 no-scrollbar pt-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 pb-4 text-sm font-bold whitespace-nowrap transition-all relative"
                style={{ color: activeTab === tab.id ? "#3B5BA0" : "#64748B" }}>
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3B5BA0] rounded-t-md" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-slate-50 pt-16 pb-32">
        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <section className="container">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-100/30">
                  <Shield size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1 text-slate-900">{Math.round(summary.percentage)}%</h3>
                  <p className="text-xs font-bold text-slate-500">مستوى الامتثال العام</p>
                </div>
              </motion.div>
              {disclosureItems.slice(1).map((item, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i+1}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${item.color}10` }}>
                    <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-1 text-slate-900">{item.value}</h3>
                    <p className="text-xs font-bold text-slate-500">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Principles */}
            <div className="mb-16">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8">ركائز الحوكمة المؤسسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {principles.map((p, i) => (
                  <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                    className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1.5 h-full transition-all" style={{ background: p.color }} />
                    <p.icon size={28} style={{ color: p.color }} className="mb-6 opacity-80 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-extrabold mb-3 text-slate-900">{p.title}</h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-600">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Directory Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "documents" as TabId,   title: "مكتبة اللوائح والوثائق", desc: "دليل السياسات التشغيلية والتأسيسية", icon: FileText },
                { id: "financial" as TabId,   title: "التدقيق المالي",         desc: "القوائم المالية الربعية والسنوية",  icon: DollarSign },
                { href: "/board",             title: "أعضاء مجلس الإدارة",     desc: "الهيكل التنظيمي والقيادة",          icon: Users },
                { href: "/reports",           title: "تقارير الأداء",          desc: "تقارير الآثر وحوكمة المشاريع",      icon: BookOpen },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  {"id" in item ? (
                    <button onClick={() => setActiveTab(item.id as TabId)}
                      className="w-full bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-5 hover:border-[#3B5BA0] hover:shadow-md transition-all text-right group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:bg-[#3B5BA0] transition-colors">
                        <item.icon size={22} className="text-[#3B5BA0] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-slate-900">{item.title}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform group-hover:text-[#3B5BA0]" />
                    </button>
                  ) : (
                    <Link href={item.href}
                      className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-5 hover:border-[#3B5BA0] hover:shadow-md transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:bg-[#3B5BA0] transition-colors">
                        <item.icon size={22} className="text-[#3B5BA0] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-slate-900">{item.title}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <ExternalLink size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform group-hover:text-[#3B5BA0]" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ══ TRANSPARENCY STANDARD ══ */}
        {activeTab === "transparency" && (
          <section className="container max-w-5xl">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12" dir="rtl">
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">معيار الشفافية والإفصاح</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">النتائج الرسمية للتقييم الذاتي وفق مؤشرات المركز الوطني لتنمية القطاع غير الربحي</p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/governance/report" className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                    <AlertTriangle size={18} /> إبلاغ عن مخالفة
                  </Link>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-slate-400 uppercase">مستوى الامتثال</p>
                    <p className={`text-2xl font-black ${summary.complianceColor}`}>{Math.round(summary.percentage)}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Shield className="text-primary-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                        <th className="px-8 py-5">المؤشر</th>
                        <th className="px-6 py-5">الامتثال</th>
                        <th className="px-6 py-5">الشاهد / الوثيقة المرجعية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {state.questions.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-800 mb-1">{q.questionText}</p>
                            <p className="text-xs text-slate-400 font-medium italic">{q.mechanism}</p>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${
                              q.status === 'yes' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              q.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {q.status === 'yes' ? 'متحقق' : q.status === 'partial' ? 'جزئي' : 'غير متحقق'}
                            </span>
                          </td>
                          <td className="px-6 py-6 font-bold text-xs">
                            {q.proofUrl ? (
                              <Link href={q.proofUrl} className="text-primary-600 hover:text-primary-800 flex items-center gap-1.5 transition-colors">
                                <FileText size={14} />
                                {q.proofName}
                              </Link>
                            ) : (
                              <span className="text-slate-300 italic">بانتظار النشر</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-sm">
                <Info size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-indigo-900 mb-2">حول معايير الحوكمة</h4>
                <p className="text-sm text-indigo-800/70 leading-relaxed font-medium">
                  يعد معيار الشفافية والإفصاح أحد المعايير الثلاثة المعتمدة في "دليل حوكمة الجمعيات الأهلية" من المركز الوطني لتنمية القطاع غير الربحي. 
                  نهدف من خلال هذا التقييم إلى تعزيز ثقة المجتمع والشركاء من خلال إتاحة الوصول المباشر للمعلومات والسياسات المالية والإدارية للمبادرة.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ══ DOCUMENTS ══ */}
        {activeTab === "documents" && (
          <section className="container max-w-5xl">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8">الوثائق والسياسات الرسمية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {govDocs.map((doc, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow group flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 text-slate-500 group-hover:text-[#3B5BA0] transition-colors">
                    <doc.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-extrabold text-sm text-slate-900 mb-1">{doc.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">{doc.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">إصدار {doc.date} &middot; {doc.size}</span>
                      <button className="text-xs font-extrabold text-[#3B5BA0] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Download size={12} /> تحميل
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ══ FINANCIAL STATEMENTS ══ */}
        {activeTab === "financial" && (
          <section className="container max-w-4xl">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8">القوائم والتقارير المالية</h2>
            
            <div className="space-y-4">
              {financialStatements.map((fs, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-white rounded-2xl border transition-all duration-300 overflow-hidden"
                  style={{ borderColor: openFS === i ? "#3B5BA0" : "#E2E8F0", boxShadow: openFS === i ? "0 4px 12px rgba(59,91,160,0.08)" : "none" }}>
                  <button onClick={() => setOpenFS(openFS === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${openFS === i ? 'bg-[#3B5BA0] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <DollarSign size={20} />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <h3 className="font-extrabold text-slate-900">{fs.title}</h3>
                          {fs.audited && <span className="text-[10px] font-black px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wide">مدقق</span>}
                        </div>
                        <p className="text-xs font-bold text-slate-500 mt-1">{fs.summary}</p>
                      </div>
                    </div>
                    <ChevronDown size={20} className={`text-slate-400 transition-transform ${openFS === i ? 'rotate-180 text-[#3B5BA0]' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openFS === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {fs.items.map((item, j) => (
                              <div key={j} className="bg-white p-4 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 mb-1">{item.label}</p>
                                <p className="font-black text-slate-900">{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 flex justify-end">
                            <button className="flex items-center gap-2 text-sm font-bold bg-white border border-slate-200 hover:border-[#3B5BA0] hover:text-[#3B5BA0] px-5 py-2.5 rounded-xl transition-all shadow-sm">
                              <Download size={14} /> تحميل التقرير الكامل
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ══ COMPLIANCE ══ */}
        {activeTab === "compliance" && (
          <section className="container max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">الرخص والشهادات</h2>
              <span className="text-sm font-bold text-[#3B5BA0] px-4 py-1.5 bg-[#F4F7FB] rounded-full border border-[#DCE6F5]">
                {complianceCerts.length} شهادات سارية
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {complianceCerts.map((cert, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden group hover:border-[#3B5BA0] transition-colors">
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#3B5BA0] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <cert.icon size={28} className="text-slate-400 group-hover:text-[#3B5BA0] transition-colors mb-5" />
                  <h3 className="font-extrabold text-slate-900 mb-1">{cert.title}</h3>
                  <p className="text-xs font-bold text-slate-500 mb-4">{cert.issuer}</p>
                  
                  <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">سنة الإصدار</span>
                      <span className="text-slate-900 font-bold">{cert.date}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">رقم الشهادة</span>
                      <span className="text-slate-900 font-bold">{cert.number}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
