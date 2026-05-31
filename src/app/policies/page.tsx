"use client";
import { motion } from "framer-motion";
import { Shield, ChevronDown } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const policies = [
  { title: "النظام الأساسي للمبادرة",       content: "انطلقت مبادرة ألهمني وفقاً لأحكام نظام الجمعيات والمؤسسات الأهلية في المملكة العربية السعودية. يحدد النظام الأساسي هوية المبادرة وأهدافها وآليات عملها وهيكلها التنظيمي، ويُعدّ المرجع الرئيسي لجميع قرارات الفريق." },
  { title: "سياسة العضوية",                 content: "تُرحب المبادرة بانضمام جميع المواطنين والمقيمين الراغبين في المساهمة. تُمنح العضوية بعد استيفاء النموذج المعتمد وموافقة فريق الإدارة. يُلتزم الأعضاء بالمشاركة الفاعلة في الأنشطة." },
  { title: "سياسة التبرعات والمالية",       content: "تلتزم المبادرة بصرف أكثر من ٩٠٪ من التبرعات مباشرةً على البرامج والمشاريع. تخضع الحسابات لمراجعة دورية، وتُنشر التقارير المالية بشكل كامل للداعمين." },
  { title: "سياسة التطوع",                  content: "يُرحب بجميع المتطوعين بعد إكمال نموذج التسجيل وجلسة التوجيه. يحق للمتطوع الحصول على شهادة معتمدة بعد إتمام ٢٠ ساعة. يلتزم الجميع بقيم المبادرة وتعليمات الإدارة." },
  { title: "سياسة السرية وحماية البيانات",  content: "تلتزم المبادرة بحماية البيانات الشخصية وفق اللوائح المعمول بها. لا تُشارك أي بيانات مع جهات خارجية دون موافقة صريحة. يحق لكل شخص طلب الاطلاع على بياناته أو تعديلها." },
  { title: "سياسة تضارب المصالح",           content: "يلتزم جميع أعضاء الفريق القيادي بالإفصاح عن أي تضارب محتمل في المصالح. يُحظر التصويت في أي قرار يتعلق بمصلحة شخصية." },
];

function PolicyItem({ policy, index }: { policy: typeof policies[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index}
      className="rounded-3xl overflow-hidden transition-all duration-200"
      style={{
        background: "white",
        border: open ? "1px solid rgba(59,91,160,0.20)" : "1px solid #E2E8F0",
        boxShadow: open ? "0 6px 24px rgba(59,91,160,0.08)" : "0 1px 6px rgba(0,0,0,0.04)",
      }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-right transition-colors"
        style={{ background: open ? "rgba(59,91,160,0.03)" : "transparent" }}>
        <span className="font-black text-base" style={{ color: "#0F172A" }}>{policy.title}</span>
        <ChevronDown size={20}
          className={`flex-shrink-0 mr-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: open ? "#3B5BA0" : "#94A3B8" }} />
      </button>
      {open && (
        <div className="px-6 pb-7 text-sm leading-loose" style={{ color: "#64748B", borderTop: "1px solid #E2E8F0" }}>
          <div className="pt-4">{policy.content}</div>
        </div>
      )}
    </motion.div>
  );
}

export default function PoliciesPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="absolute inset-0 soft-grid pointer-events-none" />
        <div className="container relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <Shield size={32} className="text-white" />
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title">
            اللوائح والسياسات
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle">
            نعمل وفق لوائح وسياسات واضحة تضمن النزاهة والشفافية في كل ما نقوم به
          </motion.p>
        </div>
      </div>

      {/* ── Policies ── */}
      <section className="section container max-w-3xl">
        <div className="space-y-3">
          {policies.map((p, i) => (
            <PolicyItem key={i} policy={p} index={i} />
          ))}
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-8 p-7 rounded-3xl flex items-center gap-4"
          style={{ background: "rgba(59,91,160,0.05)", border: "1px solid rgba(59,91,160,0.12)" }}>
          <Shield size={20} className="flex-shrink-0" style={{ color: "#3B5BA0" }} />
          <p className="text-sm" style={{ color: "#64748B" }}>
            لاستفساراتك حول هذه اللوائح، تواصل معنا على{" "}
            <a href="mailto:inspiredme019@gmail.com" className="font-black hover:underline" style={{ color: "#3B5BA0" }}>
              inspiredme019@gmail.com
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
