"use client";
import { Mail, Phone } from "lucide-react";
import type { BoardMember } from "@/lib/cms-context";

interface Props {
  member: BoardMember;
}

const getInitials = (name: string) => {
  if (!name) return "ع";
  const clean = name.replace(/^(أ\.|د\.|م\.|الأستاذ|الأستاذة)\s+/g, "").trim();
  return clean.charAt(0) || "ع";
};

export default function FlipBusinessCard({ member }: Props) {
  return (
    <div className="flex flex-col items-center w-[100px] sm:w-[130px] cursor-pointer group">
      
      {/* Flipping Circle Avatar */}
      <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] [perspective:1000px] mb-2 sm:mb-3">
        <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          
          {/* === FRONT === */}
          <div className="absolute inset-0 rounded-full border-[2px] border-[#1E4490] p-0.5 bg-white shadow-sm flex items-center justify-center [backface-visibility:hidden]">
            {member.img ? (
              <img src={member.img} alt={member.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-[#1E4490]/10 flex items-center justify-center text-[#1E4490] font-black text-2xl sm:text-3xl pt-1">
                {getInitials(member.name)}
              </div>
            )}
          </div>

          {/* === BACK === */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1E4490] to-[#2E4B88] border-2 border-white shadow-lg flex flex-col items-center justify-center gap-1.5 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {member.email && (
              <a href={`mailto:${member.email}`} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" title={member.email}>
                <Mail size={12} />
              </a>
            )}
            {member.phone && (
              <a href={`tel:${member.phone}`} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" title={member.phone}>
                <Phone size={12} />
              </a>
            )}
            {/* If no contact info, show initials again or a friendly icon */}
            {!member.email && !member.phone && (
              <span className="text-white text-xs font-bold px-2 text-center leading-tight">بطاقة العضو</span>
            )}
          </div>
          
        </div>
      </div>
      
      {/* Static Text Details */}
      <h3 className="text-[11px] sm:text-[13px] font-black text-[#1E4490] mb-0.5 text-center w-full truncate px-1">
        {member.name}
      </h3>
      <p className="text-[9px] sm:text-[10px] font-semibold text-[#3B5BA0] text-center px-1 leading-tight h-[28px] overflow-hidden text-ellipsis flex items-start justify-center">
        {member.title}
      </p>
    </div>
  );
}
