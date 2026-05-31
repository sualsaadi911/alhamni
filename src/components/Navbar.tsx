"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Heart, ChevronDown, UserCircle, UserPlus, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCms } from "@/lib/cms-context";

type SimpleLink   = { href: string; label: string; children?: undefined };
type DropdownLink = { label: string; href?: undefined; children: { href: string; label: string }[] };
type NavItem      = SimpleLink | DropdownLink;

const navLinks: NavItem[] = [
  { href: "/",        label: "الرئيسية" },
  { href: "/about",   label: "عن المبادرة" },
  {
    label: "أنشطتنا",
    children: [
      { href: "/projects",      label: "المشاريع" },
      { href: "/news",          label: "الأخبار" },
      { href: "/announcements", label: "الإعلانات" },
    ],
  },
  {
    label: "شاركنا",
    children: [
      { href: "/volunteer", label: "التطوع" },
      { href: "/partners",  label: "الشركاء" },
      { href: "/services",  label: "خدماتنا" },
    ],
  },
  {
    label: "الشفافية",
    children: [
      { href: "/reports",    label: "التقارير السنوية" },
      { href: "/governance", label: "الحوكمة" },
      { href: "/board",      label: "فريق ألهمني" },
      { href: "/policies",   label: "اللوائح والسياسات" },
    ],
  },
  { href: "/contact", label: "تواصل معنا" },
];

/* ── Dropdown Item ─────────────────────────────────────── */
function NavDropdown({ item, pathname, scrolled }: { item: NavItem; pathname: string; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.children) {
    const active = pathname === item.href;
    return (
      <Link href={item.href}
        className={`nav-link text-sm py-1`}
        style={scrolled ? (active ? { color: "#3B5BA0" } : {}) : { color: "rgba(255,255,255,0.88)" }}>
        {item.label}
      </Link>
    );
  }

  const isActive = item.children.some(c => pathname === c.href);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`nav-link text-sm py-1 flex items-center gap-1.5`}
        style={scrolled ? (isActive ? { color: "#3B5BA0" } : {}) : { color: "rgba(255,255,255,0.88)" }}>
        {item.label}
        <ChevronDown size={12} className={`transition-transform duration-200 opacity-70 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-3 w-52 bg-white rounded-2xl overflow-hidden z-50"
            style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" }}>
            <div className="p-1.5">
              {item.children.map(child => (
                <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    pathname === child.href
                      ? "text-white"
                      : "text-slate-600 hover:text-[#3B5BA0]"
                  }`}
                  style={pathname === child.href ? { background: "#3B5BA0" } : {}}>
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Navbar ───────────────────────────────────────── */
export default function Navbar() {
  const [open,       setOpen]       = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const { user }  = useAuth();
  const { settings } = useCms();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMobileOpen(null); }, [pathname]);

  if (pathname?.startsWith("/dashboard")) return null;

  /* Is hero page (white hero navbar needs special treatment) */
  const isHomepage = pathname === "/";

  return (
    <motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={scrolled ? {
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      } : {
        background: isHomepage ? `${settings.primaryColor}f0` : "rgba(255,255,255,0.95)", // f0 = ~94% opacity
        backdropFilter: "blur(16px)",
        borderBottom: isHomepage ? "none" : "1px solid #E2E8F0",
      }}>
      <div className="container">
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="h-10 overflow-hidden flex items-center">
              <img
                src={scrolled || !isHomepage ? "/logo.png" : "/logo- بالعرض وابيض.png"}
                alt="ألهمني"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map(link => (
              <div key={link.label}
                className={!scrolled && isHomepage ? "[&_.nav-link]:!text-white [&_.nav-link:hover]:!text-white/80" : ""}>
                <NavDropdown item={link} pathname={pathname} scrolled={scrolled || !isHomepage} />
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Donate */}
            <Link href="/donate"
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: scrolled || !isHomepage ? "#F4F7FB" : "rgba(255,255,255,0.12)",
                color: scrolled || !isHomepage ? "#3B5BA0" : "white",
                border: scrolled || !isHomepage ? "1px solid #DCE6F5" : "1px solid rgba(255,255,255,0.25)",
              }}>
              <Heart size={13} fill="currentColor" /> تبرع
            </Link>

            {user ? (
              <>
                <Link href="/account"
                  className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
                  style={{
                    background: scrolled || !isHomepage ? "#F8FAFC" : "rgba(255,255,255,0.10)",
                    color: scrolled || !isHomepage ? "#475569" : "white",
                    border: scrolled || !isHomepage ? "1px solid #E2E8F0" : "1px solid rgba(255,255,255,0.20)",
                  }}>
                  <UserCircle size={14} /> حسابي
                </Link>
                <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-5">
                  <LayoutDashboard size={14} /> لوحة التحكم
                </Link>
              </>
            ) : (
              <>
                <Link href="/register"
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
                  style={{
                    background: "transparent",
                    color: scrolled || !isHomepage ? settings.primaryColor : "white",
                  }}>
                  <UserPlus size={14} /> تسجيل
                </Link>
                <Link href="/login"
                  className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all text-white"
                  style={{ background: settings.primaryColor, boxShadow: `0 4px 12px ${settings.primaryColor}40` }}>
                  <LogIn size={14} /> دخول
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2.5 rounded-xl transition-all"
            style={{
              color: scrolled || !isHomepage ? settings.primaryColor : "white",
              background: scrolled || !isHomepage ? `${settings.primaryColor}15` : "rgba(255,255,255,0.12)",
            }}
            onClick={() => setOpen(!open)}
            aria-label="القائمة">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden bg-white overflow-hidden"
            style={{ borderTop: "1px solid #F1F5F9", boxShadow: "0 12px 32px rgba(0,0,0,0.09)" }}>
            <div className="container py-5 flex flex-col gap-1">
              {navLinks.map(link => {
                if (!link.children) {
                  return (
                    <Link key={link.href} href={link.href}
                      className="py-3 px-4 rounded-xl text-sm font-semibold transition-colors"
                      style={{
                        background: pathname === link.href ? `${settings.primaryColor}15` : "transparent",
                        color: pathname === link.href ? settings.primaryColor : "#475569",
                      }}>
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileOpen(mobileOpen === link.label ? null : link.label)}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-between"
                      style={{ color: "#475569" }}>
                      {link.label}
                      <ChevronDown size={13} className={`opacity-50 transition-transform ${mobileOpen === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileOpen === link.label && (
                      <div className="mr-4 mb-2 mt-1 space-y-0.5 border-r-2 pr-4" style={{ borderColor: "#CCFBF1" }}>
                        {link.children.map(child => (
                          <Link key={child.href} href={child.href}
                            className="block py-2.5 px-3 rounded-xl text-sm font-medium transition-colors"
                            style={{
                              color: pathname === child.href ? settings.primaryColor : "#64748B",
                              background: pathname === child.href ? `${settings.primaryColor}15` : "transparent",
                            }}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile Bottom Actions */}
              <div className="flex flex-wrap gap-2.5 pt-4 mt-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                <Link href="/donate"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                  style={{ background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>
                  <Heart size={13} fill="currentColor" /> تبرع
                </Link>
                {user ? (
                  <>
                    <Link href="/account"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                      style={{ background: `${settings.primaryColor}15`, color: settings.primaryColor, border: `1px solid ${settings.primaryColor}30` }}>
                      <UserCircle size={13} /> حسابي
                    </Link>
                    <Link href="/dashboard"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                      style={{ background: settings.primaryColor }}>
                      لوحة التحكم
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/register"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                      style={{ background: "#F8FAFC", color: settings.primaryColor, border: "1px solid #E2E8F0" }}>
                      <UserPlus size={13} /> تسجيل
                    </Link>
                    <Link href="/login"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                      style={{ background: settings.primaryColor }}>
                      <LogIn size={13} /> دخول
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
