"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Users, DollarSign,
  LogOut, ChevronLeft, Bell, Settings,
  Scale, Megaphone, Wrench, ShieldCheck, HeartHandshake, Bot, AlertTriangle, BarChart2, Briefcase
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTasks } from "@/lib/tasks-context";
import { ROLE_LABELS, ROLE_COLORS, ROLE_BG, ROLE_EMOJI, hasPermission } from "@/lib/roles";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, logout } = useAuth();
  const { getVisibleTasks } = useTasks();

  if (!profile) return null;

  const myTasks    = getVisibleTasks(profile);
  const lateTasks  = myTasks.filter(t => t.status === "late").length;
  const activeMine = myTasks.filter(t =>
    t.assignedTo === profile.uid && t.status !== "completed"
  ).length;

  const navItems = [
    {
      href:  "/dashboard",
      icon:  LayoutDashboard,
      label: "الرئيسية",
      show:  true,
    },
    {
      href:  "/dashboard/tasks",
      icon:  CheckSquare,
      label: "إدارة المهام",
      show:  true,
      badge: lateTasks > 0 ? lateTasks : null,
      badgeColor: "bg-red-500",
    },
    {
      href:  "/dashboard/users",
      icon:  Users,
      label: "إدارة المستخدمين",
      show:  hasPermission(profile, "canManageUsers"),
    },
    {
      href:  "/dashboard/volunteers",
      icon:  HeartHandshake,
      label: "إدارة المتطوعين",
      show:  hasPermission(profile, "canManageVolunteers"),
    },
    {
      href:  "/dashboard/finance",
      icon:  DollarSign,
      label: "الشؤون المالية",
      show:  hasPermission(profile, "canViewFinance"),
    },
    {
      href:  "/dashboard/legal",
      icon:  Scale,
      label: "الحوكمة والقانونية",
      show:  hasPermission(profile, "canManageLegal"),
    },
    {
      href:  "/dashboard/transparency",
      icon:  ShieldCheck,
      label: "معيار الشفافية والإفصاح",
      show:  hasPermission(profile, "canManageTransparency"),
    },
    {
      href:  "/dashboard/reports",
      icon:  AlertTriangle,
      label: "إدارة البلاغات",
      show:  hasPermission(profile, "canManageReports"),
    },
    {
      href:  "/dashboard/content",
      icon:  Megaphone,
      label: "المحتوى والإعلام",
      show:  hasPermission(profile, "canManageMedia"),
    },
    {
      href:  "/dashboard/board-cards",
      icon:  HeartHandshake,
      label: "بطاقات الإدارة",
      show:  hasPermission(profile, "canManageBoardCards"),
    },
    {
      href:  "/dashboard/services",
      icon:  Briefcase,
      label: "إدارة الخدمات",
      show:  hasPermission(profile, "canManageServices"),
    },
    {
      href:  "/dashboard/system",
      icon:  Wrench,
      label: "الدعم الفني",
      show:  hasPermission(profile, "canManageSystem"),
    },
    {
      href:  "/dashboard/analytics",
      icon:  BarChart2,
      label: "تحليلات البيانات",
      show:  hasPermission(profile, "canViewAnalytics"),
    },
    {
      href:  "/dashboard/audit",
      icon:  ShieldCheck,
      label: "سجل العمليات",
      show:  hasPermission(profile, "canViewAuditLog"),
    },
    {
      href:  "/dashboard/chatbot",
      icon:  Bot,
      label: "محادثات ملهم",
      show:  hasPermission(profile, "canManageSystem"),
    },
  ].filter(i => i.show);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white border-l border-primary-100 min-h-screen flex flex-col shadow-sm">
      {/* Logo */}
      <div className="pt-4 pb-2 overflow-hidden">
        <Link href="/">
          <img src="/logo.png" alt="ألهمني" className="w-52 h-16 object-contain -mr-6" />
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-5 border-b border-primary-50">
        <div className="flex items-center gap-3">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name}
              className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0 border-2 border-primary-100" />
          ) : (
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ROLE_BG[profile.role]} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
              {profile.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-sm truncate">{profile.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base">{ROLE_EMOJI[profile.role]}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ROLE_COLORS[profile.role]}`}>
                {profile.jobTitle ?? ROLE_LABELS[profile.role]}
              </span>
            </div>
          </div>
        </div>

        {/* My tasks quick stat */}
        {activeMine > 0 && (
          <div className="mt-3 bg-primary-50 rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary-600">مهامي النشطة</span>
            <span className="text-xs font-black text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
              {activeMine}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const badge  = (item as { badge?: number | null }).badge;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: -3 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-primary-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                <item.icon size={19} />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {badge && !active && (
                  <span className={`text-xs ${(item as { badgeColor?: string }).badgeColor || "bg-primary-500"} text-white w-5 h-5 rounded-full flex items-center justify-center font-bold`}>
                    {badge}
                  </span>
                )}
                {active && <ChevronLeft size={15} className="mr-auto opacity-70" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-1 border-t border-primary-50">
        <Link href="/dashboard/notifications">
          <motion.div whileHover={{ x: -3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/dashboard/notifications"
                ? "bg-primary-500 text-white shadow-md"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            }`}>
            <Bell size={19} />
            <span className="font-medium text-sm flex-1">الإشعارات</span>
            {pathname !== "/dashboard/notifications" && (
              <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">٢</span>
            )}
            {pathname === "/dashboard/notifications" && <ChevronLeft size={15} className="opacity-70" />}
          </motion.div>
        </Link>

        <Link href="/dashboard/settings">
          <motion.div whileHover={{ x: -3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-primary-500 text-white shadow-md"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            }`}>
            <Settings size={19} />
            <span className="font-medium text-sm flex-1">الإعدادات</span>
            {pathname === "/dashboard/settings" && <ChevronLeft size={15} className="opacity-70" />}
          </motion.div>
        </Link>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={19} />
          <span className="font-medium text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
