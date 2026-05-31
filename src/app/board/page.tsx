"use client";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useCms } from "@/lib/cms-context";
import type { BoardMember } from "@/lib/cms-context";
import FlipBusinessCard from "@/components/FlipBusinessCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

type TreeNode = {
  member: BoardMember;
  children: TreeNode[];
};

function OrgTree({ node }: { node: TreeNode }) {
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className="flex flex-col items-center">
      <FlipBusinessCard member={node.member} />
      {hasChildren && (
        <div className="flex flex-col items-center mt-1">
          {/* Parent downward line */}
          <div className="w-[1.5px] h-6 sm:h-8 bg-[#CBD5E1]"></div>
          
          <div className="flex justify-center relative">
            {node.children.map((child, i) => {
               const isFirst = i === 0;
               const isLast = i === node.children.length - 1;
               const isOnly = node.children.length === 1;

               return (
                 <div key={child.member.id} className="flex flex-col items-center relative px-1 sm:px-4">
                   {/* Horizontal connection logic */}
                   {!isOnly && (
                      <div className="absolute top-0 h-[1.5px] bg-[#CBD5E1]"
                           style={{
                             right: isFirst ? "50%" : 0,
                             left: isLast ? "50%" : 0,
                             width: isFirst || isLast ? "50%" : "100%",
                           }}
                      />
                   )}
                   {/* Vertical connection drop */}
                   <div className="w-[1.5px] h-6 sm:h-8 bg-[#CBD5E1]"></div>
                   
                   {/* Child tree */}
                   <OrgTree node={child} />
                 </div>
               )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BoardPage() {
  const { board } = useCms();
  const activeMembers = board.filter(m => m.status === "نشط");

  const buildTree = (members: BoardMember[]): TreeNode | null => {
    if (members.length === 0) return null;

    const executives = members.filter(m => m.department === "القيادة التنفيذية");
    const ceo = executives.find(m => m.title.includes("المؤسس") || m.title.includes("رئيس التنفيذي") || m.title.includes("الرئيس")) || members[0];
    const vp = executives.find(m => m !== ceo && (m.title.includes("نائب") || m.title.includes("مساعد"))) || members.find(m => m.title.includes("نائب الرئيس التنفيذي"));
    
    // Find Heads of Committees
    const heads = members.filter(m => 
      m !== ceo && m !== vp &&
      m.department !== "عضو مجلس" &&
      (m.title.includes("مدير") || m.title.includes("مسؤول") || m.title.includes("رئيس لجنة"))
    );

    const headNodes = heads.map(head => {
      const subordinates = members.filter(m => 
        m.department === head.department && m !== head && m !== ceo && m !== vp && !heads.includes(m)
      );
      return { member: head, children: subordinates.map(sub => ({ member: sub, children: [] })) };
    });

    const caughtMembers = new Set([
      ceo, vp, ...heads, 
      ...headNodes.flatMap(m => m.children.map(c => c.member))
    ].filter(Boolean));

    const isolatedMembers = members.filter(m => !caughtMembers.has(m) && m !== ceo && m !== vp);
    
    // Group heads + isolated into VP's direct line
    const vpChildren = [...headNodes, ...isolatedMembers.map(m => ({ member: m, children: [] }))];

    const vpNode: TreeNode | null = vp ? {
      member: vp,
      children: vpChildren
    } : null;

    return {
      member: ceo,
      children: vpNode ? [vpNode] : vpChildren
    };
  };

  const treeData = buildTree(activeMembers);

  return (
    <div className="pb-24 bg-white">
      {/* ── Hero ── */}
      <div className="page-hero mb-0 !py-12">
        <div className="container relative py-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="section-label mx-auto mb-4 bg-white/50 backdrop-blur shadow-sm"><Shield size={13} /> الهيكل التنظيمي</span>
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="page-hero-title mb-2 text-[#1E4490]">
            أعضاء مجلس الإدارة والفريق التنفيذي
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="page-hero-subtitle text-sm text-[#3B5BA0]">
            فريق يعمل بشغف لتحقيق رسالة ألهمني في تنمية القدرات البشرية
          </motion.p>
        </div>
      </div>

      {/* ── Tree Layout Section (Clean, Precise) ── */}
      <section className="relative py-12 z-10 w-full overflow-hidden">
        <div className="container max-w-7xl mx-auto px-2 relative z-10 w-full overflow-x-auto pb-10 custom-scrollbar">
          
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="min-w-max mx-auto flex justify-center mt-4">
            {treeData && <OrgTree node={treeData} />}
          </motion.div>
          
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}} />
      </section>
    </div>
  );
}
