// ── Role Definitions ───────────────────────────────────────────────────────────
export type UserRole =
  | "executive_director"   // المدير التنفيذي
  | "hr_manager"           // مدير الموارد البشرية
  | "volunteer_manager"    // مدير التطوع
  | "finance"              // مدير الشؤون المالية
  | "legal"                // مدير الحوكمة والشؤون القانونية
  | "media"                // مدير المحتوى والإعلام
  | "tech_support";        // مدير الدعم الفني

export const ALL_ROLES: UserRole[] = [
  "executive_director",
  "hr_manager",
  "volunteer_manager",
  "finance",
  "legal",
  "media",
  "tech_support",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  executive_director: "المدير التنفيذي",
  hr_manager:         "مدير الموارد البشرية",
  volunteer_manager:  "مدير التطوع",
  finance:            "مدير الشؤون المالية",
  legal:              "مدير الحوكمة والشؤون القانونية",
  media:              "مدير المحتوى والإعلام",
  tech_support:       "مدير الدعم الفني",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  executive_director: "bg-purple-100 text-purple-700",
  hr_manager:         "bg-pink-100 text-pink-700",
  volunteer_manager:  "bg-emerald-100 text-emerald-700",
  finance:            "bg-sky-100 text-sky-700",
  legal:              "bg-amber-100 text-amber-700",
  media:              "bg-blue-100 text-blue-700",
  tech_support:       "bg-orange-100 text-orange-700",
};

export const ROLE_BG: Record<UserRole, string> = {
  executive_director: "from-purple-400 to-purple-600",
  hr_manager:         "from-pink-400 to-pink-600",
  volunteer_manager:  "from-emerald-400 to-emerald-600",
  finance:            "from-sky-400 to-sky-600",
  legal:              "from-amber-400 to-amber-600",
  media:              "from-blue-400 to-blue-600",
  tech_support:       "from-orange-400 to-orange-600",
};

export const ROLE_EMOJI: Record<UserRole, string> = {
  executive_director: "👑",
  hr_manager:         "👥",
  volunteer_manager:  "🤝",
  finance:            "💰",
  legal:              "⚖️",
  media:              "📢",
  tech_support:       "🔧",
};

// ── Detailed Permission Descriptions (for display in UI) ───────────────────────
export const ROLE_PERMISSIONS_LIST: Record<UserRole, string[]> = {
  executive_director: [
    "إسناد المهام ومتابعة أداء الفريق",
    "الإشراف على الشؤون المالية",
    "اعتماد تقييم الشفافية والإفصاح",
    "متابعة البلاغات والتقارير",
    "سجلات المراجعة والعمليات",
  ],
  hr_manager: [
    "إدارة المستخدمين وإنشاء الحسابات",
    "تفعيل وتعطيل الحسابات",
    "إسناد المهام وحذفها",
    "عرض جميع المهام",
    "سجلات المراجعة",
    "بطاقات أعضاء الإدارة",
  ],
  volunteer_manager: [
    "تسجيل المتطوعين الجدد وإدارة ملفاتهم",
    "تتبع ساعات التطوع والبرامج",
  ],
  finance: [
    "عرض التقارير المالية والميزانيات",
    "إدارة الإيرادات والمصروفات",
  ],
  legal: [
    "إدارة الوثائق القانونية والحوكمة",
    "ملفات السياسات والنظام الأساسي",
    "معيار الشفافية والإفصاح",
    "إدارة التقارير القانونية",
  ],
  media: [
    "إدارة ونشر محتوى الموقع",
    "تحرير الأخبار والإعلانات",
    "بطاقات أعضاء الإدارة",
  ],
  tech_support: [
    "إدارة النظام التقني والبنية التحتية",
    "الدعم الفني للمستخدمين",
    "محادثات ملهم الذكي",
  ],
};

// ── Machine-readable Permission Keys ─────────────────────────────────────────
export type PermissionKey =
  | "canManageUsers"
  | "canAssignTasks"
  | "canViewAllTasks"
  | "canDeleteTasks"
  | "canViewFinance"
  | "canManageLegal"
  | "canManageTransparency"
  | "canApproveTransparency"
  | "canManageReports"
  | "canManageMedia"
  | "canManageSystem"
  | "canViewAuditLog"
  | "canManageBoardCards"
  | "canManageVolunteers"
  | "canViewAnalytics"
  | "canManageServices";

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  canManageUsers:        "إدارة المستخدمين وإنشاء الحسابات",
  canAssignTasks:        "إسناد المهام لأعضاء الفريق",
  canViewAllTasks:       "عرض جميع المهام ومتابعة الأداء",
  canDeleteTasks:        "حذف المهام",
  canViewFinance:        "التقارير المالية والميزانيات",
  canManageLegal:        "الوثائق القانونية والحوكمة",
  canManageTransparency: "معيار الشفافية والإفصاح",
  canApproveTransparency:"اعتماد تقييم الشفافية",
  canManageReports:      "إدارة التقارير",
  canManageMedia:        "إدارة ونشر المحتوى والإعلام",
  canManageSystem:       "إدارة النظام والدعم الفني",
  canViewAuditLog:       "سجلات المراجعة والشفافية",
  canManageBoardCards:   "بطاقات أعضاء الإدارة",
  canManageVolunteers:   "إدارة المتطوعين وتسجيلهم",
  canViewAnalytics:      "لوحة تحليلات البيانات والإحصاءات",
  canManageServices:     "إدارة الخدمات وطلبات العملاء",
};

export const ROLE_PERMISSION_KEYS: Record<UserRole, PermissionKey[]> = {
  // المدير التنفيذي: إشراف عام — يرى المهام، المالية، الشفافية، البلاغات، سجل العمليات
  executive_director: [
    "canViewAllTasks", "canAssignTasks",
    "canViewFinance",
    "canManageTransparency", "canApproveTransparency",
    "canManageReports",
    "canViewAuditLog",
    "canViewAnalytics",
    "canManageServices",
  ],
  // HR: إدارة المستخدمين والمهام وبطاقات الإدارة
  hr_manager: [
    "canManageUsers", "canAssignTasks", "canViewAllTasks",
    "canDeleteTasks", "canViewAuditLog", "canManageBoardCards",
  ],
  // مدير التطوع: إدارة المتطوعين فقط
  volunteer_manager: [
    "canManageVolunteers",
  ],
  // مالية: التقارير المالية والبلاغات
  finance: [
    "canViewFinance",
  ],
  // قانوني: الحوكمة والشفافية والبلاغات
  legal: [
    "canManageLegal", "canManageTransparency", "canManageReports",
  ],
  // إعلام: المحتوى وبطاقات الإدارة والخدمات
  media: [
    "canManageMedia", "canManageBoardCards", "canManageServices",
  ],
  // دعم فني: النظام والشات والخدمات
  tech_support: [
    "canManageSystem",
    "canManageServices",
  ],
};

// ── Per-user permission check (respects customPermissions if set) ─────────────
export function hasPermission(
  profile: { role: UserRole; customPermissions?: PermissionKey[] },
  key: PermissionKey
): boolean {
  const custom = profile.customPermissions;
  if (custom && custom.length > 0) return custom.includes(key);
  return ROLE_PERMISSION_KEYS[profile.role].includes(key);
}

// ── Permission Matrix ──────────────────────────────────────────────────────────
export const permissions = {
  /** HR فقط ينشئ الحسابات ويديرها */
  canManageUsers: (role: UserRole): boolean =>
    role === "hr_manager",

  /** المدير التنفيذي و HR يسندان المهام */
  canAssignTasks: (role: UserRole): boolean =>
    ["executive_director", "hr_manager"].includes(role),

  /** المدير التنفيذي و HR يشوفان كل المهام */
  canViewAllTasks: (role: UserRole): boolean =>
    ["executive_director", "hr_manager"].includes(role),

  /** الجميع يقدر يحدّث تقدم مهمته */
  canUpdateTaskProgress: (_role: UserRole): boolean => true,

  /** HR فقط يحذف المهام */
  canDeleteTasks: (role: UserRole): boolean =>
    role === "hr_manager",

  /** المالية + المدير التنفيذي للإشراف */
  canViewFinance: (role: UserRole): boolean =>
    ["finance", "executive_director"].includes(role),

  /** القانوني فقط */
  canManageLegal: (role: UserRole): boolean =>
    role === "legal",

  /** القانوني + المدير التنفيذي للاعتماد */
  canManageTransparency: (role: UserRole): boolean =>
    ["legal", "executive_director"].includes(role),

  /** المدير التنفيذي فقط يعتمد الشفافية */
  canApproveTransparency: (role: UserRole): boolean =>
    role === "executive_director",

  /** القانوني والمدير يديرون التقارير */
  canManageReports: (role: UserRole): boolean =>
    ["executive_director", "legal"].includes(role),

  /** الإعلام فقط */
  canManageMedia: (role: UserRole): boolean =>
    role === "media",

  /** الدعم الفني فقط */
  canManageSystem: (role: UserRole): boolean =>
    role === "tech_support",

  /** المدير التنفيذي، الدعم الفني، والإعلام */
  canManageServices: (role: UserRole): boolean =>
    ["executive_director", "tech_support", "media"].includes(role),

  /** المدير التنفيذي و HR يشوفان سجلات المراجعة */
  canViewAuditLog: (role: UserRole): boolean =>
    ["executive_director", "hr_manager"].includes(role),

  /** HR والإعلام يديرون بطاقات الأعضاء */
  canManageBoardCards: (role: UserRole): boolean =>
    ["hr_manager", "media"].includes(role),

  /** مدير التطوع فقط */
  canManageVolunteers: (role: UserRole): boolean =>
    role === "volunteer_manager",

  isAdmin: (role: UserRole): boolean =>
    role === "executive_director",
};
