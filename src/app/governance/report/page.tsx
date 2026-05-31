"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, Send, CheckCircle2, 
  ArrowRight, Info, Lock, EyeOff, ClipboardList 
} from "lucide-react";
import Link from "next/link";
import { useReports, ReportCategory, ReportPriority } from "@/lib/reports-context";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function SubmitReportPage() {
  const { submitReport } = useReports();
  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [trackingId, setTrackingId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "administrative" as ReportCategory,
    priority: "medium" as ReportPriority,
    reporterName: "",
    reporterContact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = submitReport({
      ...form,
      isAnonymous,
      reporterName: isAnonymous ? undefined : form.reporterName,
      reporterContact: isAnonymous ? undefined : form.reporterContact,
    });
    setTrackingId(id);
    setStep(3);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-slate-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3B5BA0 0%, transparent 50%)' }} />
        <div className="container relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" /> ميثاق النزاهة والشفافية
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} 
            className="text-3xl md:text-5xl font-black text-white mb-6">
            نظام الإبلاغ الآمن
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} 
            className="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            نلتزم في "ألهمني" بأعلى معايير النزاهة. هذا النظام يتيح لك الإبلاغ عن أي تجاوزات إدارية، مالية، أو أخلاقية بسرية تامة لضمان بيئة عمل عادلة وشفافة.
          </motion.p>
        </div>
      </div>

      <div className="container -mt-10 relative z-20">
        <div className="max-w-3xl mx-auto">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <Info className="text-amber-600 flex-shrink-0" size={24} />
                  <p className="text-sm text-amber-900 font-bold leading-relaxed">
                    تنبيه: هذا النموذج مخصص للبلاغات الجادة المتعلقة بالمخالفات فقط. للاستفسارات العامة يرجى استخدام صفحة "اتصل بنا".
                  </p>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <Lock size={22} className="text-primary-600" /> خصوصية الهوية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <button 
                    onClick={() => setIsAnonymous(true)}
                    className={`p-6 rounded-3xl border-2 text-right transition-all group ${isAnonymous ? 'border-primary-600 bg-primary-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isAnonymous ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <EyeOff size={24} />
                    </div>
                    <p className={`font-black mb-1 ${isAnonymous ? 'text-primary-900' : 'text-slate-800'}`}>بلاغ مجهول الهوية</p>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">لن يتم تسجيل اسمك أو أي معلومات تدل عليك. ستتواصل معنا عبر رقم التتبع فقط.</p>
                  </button>

                  <button 
                    onClick={() => setIsAnonymous(false)}
                    className={`p-6 rounded-3xl border-2 text-right transition-all group ${!isAnonymous ? 'border-primary-600 bg-primary-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${!isAnonymous ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <ClipboardList size={24} />
                    </div>
                    <p className={`font-black mb-1 ${!isAnonymous ? 'text-primary-900' : 'text-slate-800'}`}>بلاغ بالاسم (اختياري)</p>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">تزويدنا بهويتك يساعدنا في التحقيق بشكل أسرع والحصول على تفاصيل إضافية عند الحاجة.</p>
                  </button>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-3"
                >
                  بدء تعبئة البلاغ <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-800">بيانات البلاغ</h3>
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-slate-400 hover:text-slate-600">رجوع</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">تصنيف البلاغ</label>
                      <select 
                        required
                        value={form.category}
                        onChange={(e) => setForm({...form, category: e.target.value as ReportCategory})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                      >
                        <option value="administrative">مخالفة إدارية</option>
                        <option value="financial">مخالفة مالية</option>
                        <option value="ethical">مخالفة أخلاقية / سلوكية</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">درجة الأهمية (تقديرية)</label>
                      <select 
                        required
                        value={form.priority}
                        onChange={(e) => setForm({...form, priority: e.target.value as ReportPriority})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                      >
                        <option value="low">منخفضة</option>
                        <option value="medium">متوسطة</option>
                        <option value="high">عالية</option>
                        <option value="urgent">عاجل جداً</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">عنوان البلاغ (مختصر)</label>
                    <input 
                      required
                      type="text"
                      placeholder="مثال: ملاحظة بخصوص إدارة الموارد في مشروع..."
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">تفاصيل البلاغ</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="يرجى ذكر الوقائع، التواريخ، والأطراف المعنية بكل تفصيل ودقة..."
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>

                  {!isAnonymous && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">الاسم الكامل</label>
                        <input 
                          type="text"
                          required
                          value={form.reporterName}
                          onChange={(e) => setForm({...form, reporterName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">وسيلة تواصل (هاتف/بريد)</label>
                        <input 
                          type="text"
                          required
                          value={form.reporterContact}
                          onChange={(e) => setForm({...form, reporterContact: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                    >
                      <Send size={20} /> إرسال البلاغ الآن
                    </button>
                    <p className="text-center text-[11px] text-slate-400 font-bold mt-4">
                      بالنقر على إرسال، أنت تؤكد صحة البيانات المقدمة وتفهم مسؤوليتك تجاه نزاهة المعلومات.
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 text-center">
                <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">تم استلام بلاغك بنجاح</h2>
                <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                  نشكرك على شجاعتك وحرصك على نزاهة الجمعية. سيتم البدء في التحقق من صحة البلاغ فوراً من قبل اللجنة المختصة وبسرية تامة.
                </p>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Lock size={60} />
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">رقم تتبع البلاغ الخاص بك</p>
                  <p className="text-4xl font-black text-primary-600 tracking-widest">{trackingId}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-xl text-xs font-bold w-fit mx-auto">
                    <AlertTriangle size={14} /> يرجى الاحتفاظ بهذا الرقم لمتابعة حالة البلاغ مستقبلاً
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black transition-all hover:bg-slate-800">
                    العودة للرئيسية
                  </Link>
                  <Link href="/governance" className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black transition-all hover:bg-slate-50">
                    صفحة الحوكمة
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAQ / Guidance Footer */}
          {step < 3 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm mb-1">سرية مطلقة</h4>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">نظامنا مشفر وفريق المراجعة يلتزم بعدم الكشف عن هوية المُبلّغ تحت أي ظرف.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm mb-1">حماية المُبلّغ</h4>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">تضمن سياسة الجمعية حماية المُبلّغ من أي إجراءات انتقامية أو مضايقات إدارية.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
