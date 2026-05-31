"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
  {
    title: "مبادرة ألهمني",
    links: [
      { href: "/about",      label: "من نحن" },
      { href: "/board",      label: "الفريق القيادي" },
      { href: "/governance", label: "الحوكمة والشفافية" },
      { href: "/policies",   label: "اللوائح والسياسات" },
      { href: "/reports",    label: "تقارير الأداء" },
    ],
  },
  {
    title: "المركز الإعلامي",
    links: [
      { href: "/news",          label: "أخبار المبادرة" },
      { href: "/announcements", label: "التعاميم والإعلانات" },
      { href: "/projects",      label: "دليل المشاريع" },
      { href: "/donate",        label: "ساهم معنا" },
      { href: "/volunteer",     label: "بوابة التطوع" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer style={{ background: "#152451", borderTop: "1px solid #2E4B88" }}>
      {/* Top Brand Accent */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #2E4B88, #5072C0, #3B5BA0)" }} />

      <div className="container pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 px-4">

          {/* Brand & Mission (Takes up 4 cols on large screens) */}
          <div className="lg:col-span-4 flex flex-col items-start pl-6" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
            <Link href="/" className="flex items-center mb-6 group">
              <img src="/logo- بالعرض وابيض.png" alt="ألهمني"
                className="h-20 w-auto object-contain transition-all group-hover:scale-105" />
            </Link>

            <p className="text-sm leading-8 font-medium mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              مبادرة تطوعية تسعى إلى إلهام الشباب وتمكينهم من تحقيق أهدافهم، نبني قدرات الجيل القادم ليكونوا قادة التغيير في مجتمعاتهم.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                {
                  href: "https://instagram.com/alhumani_", label: "إنستقرام",
                  svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                },
                {
                  href: "https://x.com/alhumani_", label: "منصة إكس",
                  svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Links (Takes up 4 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 px-4">
            {footerLinks.map(group => (
              <div key={group.title}>
                <h3 className="font-extrabold text-sm mb-6" style={{ color: "#B8CBEA" }}>{group.title}</h3>
                <ul className="space-y-4">
                  {group.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href}
                        className="flex items-center gap-2 text-sm font-medium transition-all group"
                        style={{ color: "rgba(255,255,255,0.6)" }}>
                        <span className="w-1 h-1 rounded-full bg-[#5072C0] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:text-white transition-colors">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Details (Takes up 3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-extrabold text-sm mb-6" style={{ color: "#B8CBEA" }}>معلومات التواصل</h3>
            <ul className="space-y-5">
              {[
                { href: "mailto:inspiredme019@gmail.com", icon: Mail,  label: "inspiredme019@gmail.com", hoverTitle: "أرسل بريداً" },
                { href: "tel:0560662474",                 icon: Phone, label: "0560662474",              hoverTitle: "اتصل بنا", dir: "ltr" as const },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} title={item.hoverTitle}
                    className="flex items-center gap-4 text-sm group"
                    style={{ color: "rgba(255,255,255,0.7)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <item.icon size={16} className="text-[#94AFDF] group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium group-hover:text-white transition-colors" dir={item.dir}>{item.label}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <MapPin size={16} className="text-[#94AFDF]" />
                </div>
                <span className="font-medium">المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Corporate Support Bar */}
        <div className="rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,0.03), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <p className="font-extrabold text-white text-lg mb-1.5">ساهم في تحقيق الأثر المستدام</p>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              دعمك يمثل استثماراً مباشراً في بناء وتمكين القدرات الوطنية الشابة.
            </p>
          </div>
          <Link href="/donate"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "white", color: "#152451", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            <Heart size={16} className="text-[#3B5BA0]" /> مبادرة دعم
          </Link>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs font-medium tracking-wide flex flex-wrap items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>© {new Date().getFullYear()} مبادرة ألهمني. جميع الحقوق محفوظة.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B5BA0] hidden md:block mx-1" />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>طُوِّر بواسطة فرق الدعم الفني بمبادرة ألهمني</span>
          </p>
          <div className="flex items-center gap-6 text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/policies"   className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/governance" className="hover:text-white transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
