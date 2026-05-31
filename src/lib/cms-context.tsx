"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { newsArticles as defaultNews, NewsArticle } from "./data/news";
import { projects as defaultProjects, Project } from "./data/projects";
import { auditLog } from "./audit-log";
import { useAuth } from "./auth-context";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  category: string;
  status: "منشور" | "مسودة";
  date: string;
  content?: string;
}

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  img?: string;
  email?: string;
  phone?: string;
  department?: string;
  status: "نشط" | "غير نشط";
}

export interface BotRule {
  id: string;
  keyword: string;
  response: string;
}

export interface BotSettings {
  apiKey: string;
  model: string;
  systemPrompt: string;
  botName: string;
  welcomeMessage: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  primaryColor: string;
  goldColor: string;
  navyColor: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutSummary: string;
  aboutImageUrl: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  stat4Label: string;
  stat4Value: string;
  enableTaskNotifications: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "مبادرة ألهمني",
  siteTagline: "نُلهم · نُمكّن · نُغيّر",
  logoUrl: "/logo.png",
  primaryColor: "#3B5BA0",
  goldColor: "#BDD8EF",
  navyColor: "#1A2E5B",
  contactEmail: "info@alhamni.sa",
  contactPhone: "+966 11 000 0000",
  contactAddress: "الرياض، المملكة العربية السعودية",
  twitterUrl: "https://twitter.com/alhamni",
  linkedinUrl: "https://linkedin.com/company/alhamni",
  instagramUrl: "https://instagram.com/alhamni",
  heroTitle: "نُلهم الشباب لبناء مستقبل أفضل",
  heroSubtitle: "مبادرة ألهمني — جمعية غير ربحية تعمل على تمكين الشباب السعودي وتطوير مهاراتهم القيادية",
  heroImageUrl: "/images/hero_team.png",
  aboutSummary: "مبادرة ألهمني هي جمعية غير ربحية تأسست بهدف تمكين الشباب السعودي وتنمية قدراتهم القيادية والمهنية، من خلال برامج تدريبية متكاملة ومبادرات مجتمعية فاعلة.",
  aboutImageUrl: "/images/about_mission.png",
  stat1Label: "مستفيد",
  stat1Value: "+٥٠٠٠",
  stat2Label: "برنامج نفّذناه",
  stat2Value: "+٣٠",
  stat3Label: "شريك استراتيجي",
  stat3Value: "+٢٠",
  stat4Label: "متطوع نشط",
  stat4Value: "+٢٠٠",
  enableTaskNotifications: true,
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "انطلاق برنامج القيادة الشبابية ٢٠٢٥", category: "فعاليات", status: "منشور", date: "١٥ رجب ١٤٤٦", content: "يسعد مبادرة ألهمني الإعلان عن انطلاق الدورة الجديدة من برنامج القيادة الشبابية." },
  { id: "a2", title: "توقيع اتفاقية شراكة مع وزارة الموارد البشرية", category: "أخبار", status: "منشور", date: "١٠ رجب ١٤٤٦", content: "وقّعت مبادرة ألهمني اتفاقية شراكة استراتيجية مع وزارة الموارد البشرية والتنمية الاجتماعية." },
  { id: "a3", title: "فرصة تطوع: مطلوب منسق برامج", category: "توظيف", status: "مسودة", date: "٥ رجب ١٤٤٦", content: "تعلن مبادرة ألهمني عن حاجتها لمنسق برامج متطوع." },
];

const DEFAULT_BOARD: BoardMember[] = [
  { id: "b1", name: "أ. عبدالعزيز بونيان", title: "المؤسس والرئيس التنفيذي", department: "القيادة التنفيذية", email: "inspiredme019@gmail.com", bio: "أسس مبادرة ألهمني عام ٢٠٢٠ بهدف تمكين الشباب وتنمية قدراتهم. يقود رؤية المبادرة الاستراتيجية ويُشرف على جميع عملياتها.", status: "نشط" },
  { id: "b2", name: "أ. رهف الشيباني", title: "نائب الرئيس التنفيذي للشؤون الداخلية", department: "القيادة التنفيذية", bio: "تتولى الإشراف على العمليات الداخلية للمبادرة وضمان سير العمل وفق أعلى معايير الجودة والكفاءة.", status: "نشط" },
  { id: "b3", name: "أ. رهف هزازي", title: "مدير الإعلام والاتصال", department: "لجنة الإعلام والاتصال", status: "نشط" },
  { id: "b4", name: "أ. صابرين ثابت", title: "نائبة قسم الإعلام والاتصال", department: "لجنة الإعلام والاتصال", status: "نشط" },
  { id: "b5", name: "أ. ولاء الشريف", title: "نائب لجنة صناعة المحتوى", department: "لجنة الإعلام والاتصال", status: "نشط" },
  { id: "b6", name: "أ. عبدالله العقيل", title: "مدير الموارد البشرية والجودة", department: "لجنة الموارد البشرية والجودة", status: "نشط" },
  { id: "b7", name: "أ. حصة أباحسين", title: "مدير لجنة الشؤون القانونية والحوكمة", department: "لجنة الشؤون القانونية والحوكمة", status: "نشط" },
  { id: "b8", name: "أ. حاتم الشهراني", title: "مسؤول الشؤون المالية", department: "لجنة الشؤون المالية", status: "نشط" },
  { id: "b9", name: "أ. أفنان الشهري", title: "مدير لجنة التصميم", department: "لجنة التصميم والإبداع", status: "نشط" },
  { id: "b10", name: "أ. ملاك العبيدان", title: "عضو", department: "عضو مجلس", status: "نشط" },
];

const DEFAULT_BOT_RULES: BotRule[] = [
  { id: "br1", keyword: "رؤية", response: "رؤيتنا هي بناء مجتمع ملهم قادر على التغيير. ونسعى لتمكين الأفراد من تحقيق إمكاناتهم من خلال التعليم، التطوع، والمبادرات المجتمعية. 🌟" },
  { id: "br2", keyword: "تطوع", response: "نرحب بالمتطوعين في مجالات متنوعة (تعليم، صحة، بيئة، تقنية، إعلام).\nيمكنك التسجيل والاطلاع على الفرص المتاحة عبر زيارة صفحة التطوع:\n👉 /volunteer" },
  { id: "br3", keyword: "فرص", response: "نرحب بالمتطوعين في مجالات متنوعة (تعليم، صحة، بيئة، تقنية، إعلام).\nيمكنك التسجيل والاطلاع على الفرص المتاحة عبر زيارة صفحة التطوع:\n👉 /volunteer" },
  { id: "br4", keyword: "برامج", response: "نقدم عدة برامج ومبادرات نوعيّة، منها:\n- تطوير الشباب والقيادة 🚀\n- التأهيل المهني 💼\n- مشاريع خدمة المجتمع 🤝\n\nبإمكانك استكشافها عبر صفحة المشاريع:\n👉 /projects" },
  { id: "br5", keyword: "تبرع", response: "دعمكم يصنع الأمل! 💖\nيتم توجيه التبرعات لدعم برامجنا ومشاريعنا المجتمعية. للمساهمة ومعرفة التفاصيل، يرجى زيارة صفحة التبرع:\n👉 /donate" },
  { id: "br6", keyword: "تواصل", response: "نسعد دائماً بالاستماع إليك ومساعدتك! 📞\nيمكنك التواصل معنا مباشرة عبر صفحة التواصل:\n👉 /contact" },
  { id: "br7", keyword: "مرحبا", response: "أهلاً بك! 🎉 أنا ملهم، كيف يمكنني إلهامك ومساعدتك اليوم؟" },
  { id: "br8", keyword: "ألهمني", response: "جمعية ألهمني هي منظمة غير ربحية تسعى إلى إلهام المجتمع وتمكينه من خلال برامج ومبادرات متنوعة." },
  { id: "br9", keyword: "حوكمة", response: "نلتزم بأعلى معايير الشفافية والحوكمة. يمكنك الاطلاع على تقارير الإفصاح المالي ومحاضر الجمعية العمومية بزيارة قسم الحوكمة:\n👉 /governance" },
  { id: "br10", keyword: "وظائف", response: "يسعدنا اهتمامك بالانضمام لفريقنا! نعلن عن الشواغر الوظيفية عبر منصاتنا الرسمية واحياناً ضمن الأخبار. يمكنك الانضمام الآن كمتطوع لتكن الأقرب متى ما توفرت شاغرة." },
  { id: "br11", keyword: "أوقات العمل", response: "ساعات العمل الرسمية لإدارة الجمعية هي من يوم الأحد وحتى الخميس (8 صباحاً إلى 4 مساءً). للتفاصيل حول المراكز والفروع راجع صفحة التواصل." },
  { id: "br12", keyword: "شكوى", response: "يهمنا جداً سماعك وسد أي خلل! يمكنك رفع الشكاوى أو المقترحات عبر تعبئة النموذج في صفحة طلبات الدعم أو التواصل معنا مباشرة." }
];

// ── Storage helpers ────────────────────────────────────────────────────────────

const DEFAULT_BOT_SETTINGS: BotSettings = {
  apiKey: "",
  model: "gemini-1.5-flash-latest",
  systemPrompt: `أنت "مُلهم"، المساعد الذكي الرسمي لجمعية "ألهمني". تحدث باللغة العربية الفصحى البسيطة أو اللهجة السعودية الخفيفة. كن ودوداً ومختصراً. إذا لم تعرف الإجابة، أحل المستخدم لصفحات الموقع.`,
  botName: "مُلهم",
  welcomeMessage: "وعليكم السلام ورحمة الله! أنا مُلهم، مساعدك الذكي في مبادرة ألهمني. كيف أقدر أفيدك اليوم؟ 😊",
};

const STORAGE_KEYS = {
  settings:      "alhamni_cms_settings",
  news:          "alhamni_cms_news",
  projects:      "alhamni_cms_projects",
  announcements: "alhamni_cms_announcements",
  board:         "alhamni_cms_board",
  botRules:      "alhamni_cms_bot_rules",
  botSettings:   "alhamni_cms_bot_settings",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* full */ }
}

// ── Context type ───────────────────────────────────────────────────────────────

interface CmsContextType {
  // Site settings
  settings: SiteSettings;
  updateSettings: (data: Partial<SiteSettings>) => void;

  // News
  news: NewsArticle[];
  addNews: (article: Omit<NewsArticle, "id">) => void;
  updateNews: (id: string, data: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, "id">) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Board
  board: BoardMember[];
  addBoardMember: (m: Omit<BoardMember, "id">) => void;
  updateBoardMember: (id: string, data: Partial<BoardMember>) => void;
  deleteBoardMember: (id: string) => void;

  // Bot Rules
  botRules: BotRule[];
  addBotRule: (r: Omit<BotRule, "id">) => void;
  updateBotRule: (id: string, data: Partial<BotRule>) => void;
  deleteBotRule: (id: string) => void;

  // Bot Settings
  botSettings: BotSettings;
  updateBotSettings: (data: Partial<BotSettings>) => void;
}

const CmsContext = createContext<CmsContextType>({} as CmsContextType);

export function CmsProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    // Auto-upgrade colors if they are still using the old default ones
    if (saved.primaryColor === "#1E4490") saved.primaryColor = "#3B5BA0";
    if (saved.goldColor === "#CDA620") saved.goldColor = "#BDD8EF";
    if (saved.navyColor === "#0F2148") saved.navyColor = "#1A2E5B";
    return { ...DEFAULT_SETTINGS, ...saved };
  });
  const [news, setNews] = useState<NewsArticle[]>(() =>
    loadFromStorage(STORAGE_KEYS.news, defaultNews)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage(STORAGE_KEYS.projects, defaultProjects)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadFromStorage(STORAGE_KEYS.announcements, DEFAULT_ANNOUNCEMENTS)
  );
  const [board, setBoard] = useState<BoardMember[]>(() => {
    const saved = loadFromStorage(STORAGE_KEYS.board, DEFAULT_BOARD);
    if (saved.length > 0 && !("department" in saved[0])) {
      return DEFAULT_BOARD; // Upgrade to new format
    }
    return saved;
  });
  const [botRules, setBotRules] = useState<BotRule[]>(() =>
    loadFromStorage(STORAGE_KEYS.botRules, DEFAULT_BOT_RULES)
  );
  const [botSettings, setBotSettings] = useState<BotSettings>(() =>
    loadFromStorage(STORAGE_KEYS.botSettings, DEFAULT_BOT_SETTINGS)
  );

  // Persist on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.settings, settings); }, [settings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.news, news); }, [news]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.projects, projects); }, [projects]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.announcements, announcements); }, [announcements]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.board, board); }, [board]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.botRules, botRules); }, [botRules]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.botSettings, botSettings); }, [botSettings]);

  const logAction = useCallback((action: "content_published" | "content_updated", targetName: string) => {
    if (!profile) return;
    auditLog.add({
      actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
      action, targetName,
    });
  }, [profile]);

  // ── Settings ────────────────────────────────────────────────────────────────
  const updateSettings = useCallback((data: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
    logAction("content_updated", "إعدادات الموقع");
  }, [logAction]);

  // ── News ────────────────────────────────────────────────────────────────────
  const addNews = useCallback((article: Omit<NewsArticle, "id">) => {
    const newItem: NewsArticle = { ...article, id: `news-${Date.now()}` };
    setNews(prev => [newItem, ...prev]);
    logAction("content_published", newItem.title);
  }, [logAction]);

  const updateNews = useCallback((id: string, data: Partial<NewsArticle>) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
    logAction("content_updated", data.title || id);
  }, [logAction]);

  const deleteNews = useCallback((id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  }, []);

  // ── Projects ────────────────────────────────────────────────────────────────
  const addProject = useCallback((project: Omit<Project, "id">) => {
    const newItem: Project = { ...project, id: `proj-${Date.now()}` };
    setProjects(prev => [newItem, ...prev]);
    logAction("content_published", newItem.title);
  }, [logAction]);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    logAction("content_updated", data.title || id);
  }, [logAction]);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // ── Announcements ───────────────────────────────────────────────────────────
  const addAnnouncement = useCallback((a: Omit<Announcement, "id">) => {
    const newItem: Announcement = { ...a, id: `ann-${Date.now()}` };
    setAnnouncements(prev => [newItem, ...prev]);
    logAction("content_published", newItem.title);
  }, [logAction]);

  const updateAnnouncement = useCallback((id: string, data: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    logAction("content_updated", data.title || id);
  }, [logAction]);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  // ── Board ────────────────────────────────────────────────────────────────────
  const addBoardMember = useCallback((m: Omit<BoardMember, "id">) => {
    const newItem: BoardMember = { ...m, id: `board-${Date.now()}` };
    setBoard(prev => [...prev, newItem]);
    logAction("content_published", newItem.name);
  }, [logAction]);

  const updateBoardMember = useCallback((id: string, data: Partial<BoardMember>) => {
    setBoard(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    logAction("content_updated", data.name || id);
  }, [logAction]);

  const deleteBoardMember = useCallback((id: string) => {
    setBoard(prev => prev.filter(m => m.id !== id));
  }, []);

  // ── Bot Rules ────────────────────────────────────────────────────────────────
  const addBotRule = useCallback((r: Omit<BotRule, "id">) => {
    const newItem: BotRule = { ...r, id: `br-${Date.now()}` };
    setBotRules(prev => [...prev, newItem]);
    logAction("content_published", r.keyword);
  }, [logAction]);

  const updateBotRule = useCallback((id: string, data: Partial<BotRule>) => {
    setBotRules(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    logAction("content_updated", data.keyword || id);
  }, [logAction]);

  const deleteBotRule = useCallback((id: string) => {
    setBotRules(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateBotSettings = useCallback((data: Partial<BotSettings>) => {
    setBotSettings(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <CmsContext.Provider value={{
      settings, updateSettings,
      news, addNews, updateNews, deleteNews,
      projects, addProject, updateProject, deleteProject,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      board, addBoardMember, updateBoardMember, deleteBoardMember,
      botRules, addBotRule, updateBotRule, deleteBotRule,
      botSettings, updateBotSettings,
    }}>
      {children}
    </CmsContext.Provider>
  );
}

export const useCms = () => useContext(CmsContext);
