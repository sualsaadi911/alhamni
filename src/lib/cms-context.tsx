"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { newsArticles as defaultNews, NewsArticle } from "./data/news";
import { projects as defaultProjects, Project } from "./data/projects";
import { auditLog } from "./audit-log";
import { useAuth } from "./auth-context";
import { supabase } from "./supabase";

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

const DEFAULT_BOT_SETTINGS: BotSettings = {
  apiKey: "",
  model: "gemini-1.5-flash-latest",
  systemPrompt: `أنت "مُلهم"، المساعد الذكي الرسمي لجمعية "ألهمني". تحدث باللغة العربية الفصحى البسيطة أو اللهجة السعودية الخفيفة. كن ودوداً ومختصراً. إذا لم تعرف الإجابة، أحل المستخدم لصفحات الموقع.`,
  botName: "مُلهم",
  welcomeMessage: "وعليكم السلام ورحمة الله! أنا مُلهم، مساعدك الذكي في مبادرة ألهمني. كيف أقدر أفيدك اليوم؟ 😊",
};

// ── Supabase helpers ───────────────────────────────────────────────────────────

async function loadFromDB<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from('cms_data')
      .select('value')
      .eq('key', key)
      .single();
    if (error || !data) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

async function saveToDB<T>(key: string, value: T) {
  try {
    await supabase
      .from('cms_data')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  } catch { /* ignore */ }
}

// ── Context type ───────────────────────────────────────────────────────────────

interface CmsContextType {
  settings: SiteSettings;
  updateSettings: (data: Partial<SiteSettings>) => void;
  news: NewsArticle[];
  addNews: (article: Omit<NewsArticle, "id">) => void;
  updateNews: (id: string, data: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, "id">) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  board: BoardMember[];
  addBoardMember: (m: Omit<BoardMember, "id">) => void;
  updateBoardMember: (id: string, data: Partial<BoardMember>) => void;
  deleteBoardMember: (id: string) => void;
  botRules: BotRule[];
  addBotRule: (r: Omit<BotRule, "id">) => void;
  updateBotRule: (id: string, data: Partial<BotRule>) => void;
  deleteBotRule: (id: string) => void;
  botSettings: BotSettings;
  updateBotSettings: (data: Partial<BotSettings>) => void;
  loaded: boolean;
}

const CmsContext = createContext<CmsContextType>({} as CmsContextType);

export function CmsProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();

  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [news, setNews] = useState<NewsArticle[]>(defaultNews);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [board, setBoard] = useState<BoardMember[]>(DEFAULT_BOARD);
  const [botRules, setBotRules] = useState<BotRule[]>(DEFAULT_BOT_RULES);
  const [botSettings, setBotSettings] = useState<BotSettings>(DEFAULT_BOT_SETTINGS);

  // Load all data from Supabase on mount
  useEffect(() => {
    async function loadAll() {
      const [s, n, p, a, b, br, bs] = await Promise.all([
        loadFromDB('settings', DEFAULT_SETTINGS),
        loadFromDB('news', defaultNews),
        loadFromDB('projects', defaultProjects),
        loadFromDB('announcements', DEFAULT_ANNOUNCEMENTS),
        loadFromDB('board', DEFAULT_BOARD),
        loadFromDB('botRules', DEFAULT_BOT_RULES),
        loadFromDB('botSettings', DEFAULT_BOT_SETTINGS),
      ]);
      setSettings({ ...DEFAULT_SETTINGS, ...s });
      setNews(n);
      setProjects(p);
      setAnnouncements(a);
      setBoard(b);
      setBotRules(br);
      setBotSettings(bs);
      setLoaded(true);
    }
    loadAll();
  }, []);

  // Debounce timers
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  function debounceSave<T>(key: string, value: T) {
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => saveToDB(key, value), 600);
  }

  const logAction = useCallback((action: "content_published" | "content_updated", targetName: string) => {
    if (!profile) return;
    auditLog.add({
      actorUid: profile.uid, actorName: profile.name, actorRole: profile.role,
      action, targetName,
    });
  }, [profile]);

  // ── Settings ────────────────────────────────────────────────────────────────
  const updateSettings = useCallback((data: Partial<SiteSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...data };
      debounceSave('settings', next);
      return next;
    });
    logAction("content_updated", "إعدادات الموقع");
  }, [logAction]);

  // ── News ────────────────────────────────────────────────────────────────────
  const addNews = useCallback((article: Omit<NewsArticle, "id">) => {
    const newItem: NewsArticle = { ...article, id: `news-${Date.now()}` };
    setNews(prev => { const next = [newItem, ...prev]; debounceSave('news', next); return next; });
    logAction("content_published", newItem.title);
  }, [logAction]);

  const updateNews = useCallback((id: string, data: Partial<NewsArticle>) => {
    setNews(prev => { const next = prev.map(n => n.id === id ? { ...n, ...data } : n); debounceSave('news', next); return next; });
    logAction("content_updated", data.title || id);
  }, [logAction]);

  const deleteNews = useCallback((id: string) => {
    setNews(prev => { const next = prev.filter(n => n.id !== id); debounceSave('news', next); return next; });
  }, []);

  // ── Projects ────────────────────────────────────────────────────────────────
  const addProject = useCallback((project: Omit<Project, "id">) => {
    const newItem: Project = { ...project, id: `proj-${Date.now()}` };
    setProjects(prev => { const next = [newItem, ...prev]; debounceSave('projects', next); return next; });
    logAction("content_published", newItem.title);
  }, [logAction]);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects(prev => { const next = prev.map(p => p.id === id ? { ...p, ...data } : p); debounceSave('projects', next); return next; });
    logAction("content_updated", data.title || id);
  }, [logAction]);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => { const next = prev.filter(p => p.id !== id); debounceSave('projects', next); return next; });
  }, []);

  // ── Announcements ───────────────────────────────────────────────────────────
  const addAnnouncement = useCallback((a: Omit<Announcement, "id">) => {
    const newItem: Announcement = { ...a, id: `ann-${Date.now()}` };
    setAnnouncements(prev => { const next = [newItem, ...prev]; debounceSave('announcements', next); return next; });
    logAction("content_published", newItem.title);
  }, [logAction]);

  const updateAnnouncement = useCallback((id: string, data: Partial<Announcement>) => {
    setAnnouncements(prev => { const next = prev.map(a => a.id === id ? { ...a, ...data } : a); debounceSave('announcements', next); return next; });
    logAction("content_updated", data.title || id);
  }, [logAction]);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => { const next = prev.filter(a => a.id !== id); debounceSave('announcements', next); return next; });
  }, []);

  // ── Board ────────────────────────────────────────────────────────────────────
  const addBoardMember = useCallback((m: Omit<BoardMember, "id">) => {
    const newItem: BoardMember = { ...m, id: `board-${Date.now()}` };
    setBoard(prev => { const next = [...prev, newItem]; debounceSave('board', next); return next; });
    logAction("content_published", newItem.name);
  }, [logAction]);

  const updateBoardMember = useCallback((id: string, data: Partial<BoardMember>) => {
    setBoard(prev => { const next = prev.map(m => m.id === id ? { ...m, ...data } : m); debounceSave('board', next); return next; });
    logAction("content_updated", data.name || id);
  }, [logAction]);

  const deleteBoardMember = useCallback((id: string) => {
    setBoard(prev => { const next = prev.filter(m => m.id !== id); debounceSave('board', next); return next; });
  }, []);

  // ── Bot Rules ────────────────────────────────────────────────────────────────
  const addBotRule = useCallback((r: Omit<BotRule, "id">) => {
    const newItem: BotRule = { ...r, id: `br-${Date.now()}` };
    setBotRules(prev => { const next = [...prev, newItem]; debounceSave('botRules', next); return next; });
    logAction("content_published", r.keyword);
  }, [logAction]);

  const updateBotRule = useCallback((id: string, data: Partial<BotRule>) => {
    setBotRules(prev => { const next = prev.map(r => r.id === id ? { ...r, ...data } : r); debounceSave('botRules', next); return next; });
    logAction("content_updated", data.keyword || id);
  }, [logAction]);

  const deleteBotRule = useCallback((id: string) => {
    setBotRules(prev => { const next = prev.filter(r => r.id !== id); debounceSave('botRules', next); return next; });
  }, []);

  const updateBotSettings = useCallback((data: Partial<BotSettings>) => {
    setBotSettings(prev => { const next = { ...prev, ...data }; debounceSave('botSettings', next); return next; });
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
      loaded,
    }}>
      {children}
    </CmsContext.Provider>
  );
}

export const useCms = () => useContext(CmsContext);
