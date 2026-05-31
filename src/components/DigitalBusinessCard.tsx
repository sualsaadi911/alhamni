"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, X, Award, Briefcase } from "lucide-react";
import type { BoardMember } from "@/lib/cms-context";

interface Props {
  member: BoardMember;
  children: React.ReactNode;
}

export default function DigitalBusinessCard({ member, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Small delay to allow moving mouse into the card
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const closeCard = () => setIsOpen(false);

  // The Card UI
  const CardContent = (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary-50 w-full max-w-sm" dir="rtl" onClick={(e) => e.stopPropagation()}>
      {/* Top Graphic Background */}
      <div className="relative h-24 bg-gradient-to-r from-primary-400 to-primary-600">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)" }} />
      </div>

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-12 right-6">
          <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
            {member.img ? (
              <img src={member.img} alt={member.name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 font-black text-2xl">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Close Button on Mobile */}
        {isMobile && (
          <button onClick={closeCard} className="absolute top-3 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <X size={16} />
          </button>
        )}

        <div className="mt-10 pt-2">
          <h3 className="text-xl font-black text-gray-800 mb-1">{member.name}</h3>
          <p className="text-sm font-bold text-primary-600 flex items-center gap-1.5 mb-1.5">
            <Award size={14} />
            {member.title}
          </p>
          {member.department && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
              <Briefcase size={13} />
              {member.department}
            </p>
          )}

          {member.bio && (
            <p className="text-sm text-gray-500 leading-relaxed mb-6 pt-4 border-t border-gray-100">
              {member.bio}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-4">
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-sm font-semibold truncate" dir="ltr">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <a href={`tel:${member.phone}`} className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-sm font-semibold" dir="ltr">{member.phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Target Element */}
      <div onClick={handleClick} className="cursor-pointer inline-block">
        {children}
      </div>

      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full right-0 mt-2 min-w-[320px]"
            // Adjust position if it risks going off-screen (basic right alignment used here)
          >
            {CardContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Modal */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={closeCard}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full sm:max-w-sm mb-4 sm:mb-0"
              onClick={e => e.stopPropagation()}
            >
              {CardContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
