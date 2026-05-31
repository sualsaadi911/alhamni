"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Search, Trash2, Eye, X,
  Bot, User, RefreshCw, Clock, Users, Plus, Save, Settings,
  Key, EyeOff, CheckCircle2, AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/roles";
import { useCms } from "@/lib/cms-context";

interface ConversationEntry {
  id: string;
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  timestamp: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

export default function ChatbotAdminPage() {
  const { profile } = useAuth();
  const { botRules, addBotRule, updateBotRule, deleteBotRule, botSettings, updateBotSettings } = useCms();
  
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ConversationEntry | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"conversations" | "rules" | "settings">("conversations");
  const [showApiKey, setShowApiKey] = useState(false);
  const [localBotSettings, setLocalBotSettings] = useState(botSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  const [testReply, setTestReply] = useState("");
  const [testing, setTesting] = useState(false);
  
  // Rule Edit State
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editKeyword, setEditKeyword] = useState("");
  const [editResponse, setEditResponse] = useState("");

  const canManage = profile && hasPermission(profile, "canManageSystem");

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chatbot_conversations")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(200);
      if (error) throw error;
      setConversations(
        (data ?? []).map((row) => ({
          id: row.id,
          sessionId: row.session_id,
          userMessage: row.user_message,
          assistantMessage: row.assistant_message,
          timestamp: row.timestamp,
        }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConversations(); }, []);

  const handleDelete = async (id: string) => {
    if (!canManage) return;
    setDeleting(id);
    try {
      await supabase.from("chatbot_conversations").delete().eq("id", id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = conversations.filter(
    (c) =>
      c.userMessage.toLowerCase().includes(search.toLowerCase()) ||
      c.sessionId.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueSessions = new Set(conversations.map((c) => c.sessionId)).size;
  const todayCount = conversations.filter((c) => {
    if (!c.timestamp) return false;
    const d = new Date(c.timestamp);
    return d.toDateString() === new Date().toDateString();
  }).length;

  const formatTime = (ts: string | null) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
  };

  const handleSaveSettings = () => {
    updateBotSettings(localBotSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleTestBot = async () => {
    if (!testMsg.trim()) return;
    setTesting(true);
    setTestReply("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: testMsg }],
          rules: botRules,
          apiKey: localBotSettings.apiKey || undefined,
        }),
      });
      const data = await res.json();
      setTestReply(data.message || data.error || "لا يوجد رد");
    } catch {
      setTestReply("حدث خطأ في الاتصال");
    } finally {
      setTesting(false);
    }
  };

  const handleSaveRule = () => {
    if (!editKeyword.trim() || !editResponse.trim()) return;
    
    if (editingRuleId === "new") {
      addBotRule({ keyword: editKeyword, response: editResponse });
    } else if (editingRuleId) {
      updateBotRule(editingRuleId, { keyword: editKeyword, response: editResponse });
    }
    
    setEditingRuleId(null);
    setEditKeyword("");
    setEditResponse("");
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bot size={24} className="text-blue-600" />
            إدارة المساعد الذكي "ملهم"
          </h1>
          <p className="text-gray-500 text-sm mt-1">عرض محادثات الزوار وتخصيص ردود البوت</p>
        </div>
        {activeTab === "conversations" && (
          <button
            onClick={fetchConversations}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
          >
            <RefreshCw size={14} />
            تحديث
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("conversations")}
          className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === "conversations" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <span className="flex items-center gap-2"><MessageCircle size={16} /> سجل المحادثات</span>
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === "rules" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <span className="flex items-center gap-2"><Settings size={16} /> الردود التلقائية</span>
        </button>
        <button
          onClick={() => { setActiveTab("settings"); setLocalBotSettings(botSettings); }}
          className={`px-6 py-3 font-semibold text-sm transition-colors ${activeTab === "settings" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <span className="flex items-center gap-2"><Key size={16} /> إعدادات البوت</span>
        </button>
      </motion.div>

      {activeTab === "conversations" ? (
        <>
          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1.5} className="grid grid-cols-3 gap-4">
            {[
              { icon: MessageCircle, label: "إجمالي الرسائل", value: conversations.length, color: "#2B519B" },
              { icon: Users, label: "جلسات فريدة", value: uniqueSessions, color: "#059669" },
              { icon: Clock, label: "رسائل اليوم", value: todayCount, color: "#D97706" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-800">{loading ? "—" : value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversations List */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="بحث في الرسائل..."
                    className="w-full text-sm border border-gray-200 rounded-lg pr-8 pl-3 py-2 outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <span className="text-xs text-gray-400">{filtered.length} رسالة</span>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "460px" }}>
                {loading ? (
                  <div className="flex items-center justify-center py-16 text-gray-400">
                    <RefreshCw size={20} className="animate-spin ml-2" /> جاري التحميل...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <MessageCircle size={32} className="mb-2 opacity-30" />
                    <p className="text-sm">لا توجد محادثات</p>
                  </div>
                ) : (
                  filtered.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelected(conv)}
                      className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors ${
                        selected?.id === conv.id ? "bg-blue-50 border-r-2 border-r-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate font-medium">{conv.userMessage}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{conv.assistantMessage}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[10px] text-gray-400">{formatTime(conv.timestamp)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelected(conv); }}
                            className="w-6 h-6 rounded hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors"
                          >
                            <Eye size={11} />
                          </button>
                          {canManage && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                              disabled={deleting === conv.id}
                              className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors disabled:opacity-40"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-300 mt-1 font-mono">{conv.sessionId.slice(0, 24)}...</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Conversation Detail */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 text-sm">تفاصيل المحادثة</h3>
                {selected && (
                  <button onClick={() => setSelected(null)} className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <X size={12} />
                  </button>
                )}
              </div>

              {!selected ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-16">
                  <Eye size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">اختر محادثة لعرض تفاصيلها</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-xs text-gray-400 text-center mb-4">
                    {formatTime(selected.timestamp)} · {selected.sessionId.slice(0, 32)}...
                  </div>

                  {/* User message */}
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: "#2B519B" }}>
                      <User size={12} />
                    </div>
                    <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tl-none text-sm text-white" style={{ background: "#2B519B" }}>
                      {selected.userMessage}
                    </div>
                  </div>

                  {/* Bot reply */}
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-blue-700" />
                    </div>
                    <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tr-none text-sm text-gray-800 bg-gray-50 border border-gray-100 whitespace-pre-wrap">
                      {selected.assistantMessage}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      ) : activeTab === "rules" ? (
        /* RULES TAB */
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">الكلمات المفتاحية والردود</h2>
              <p className="text-sm text-gray-500">حدد الكلمة المفتاحية (مثل: "تطوع") وضع الرد المناسب ليقوم البوت بالرد تلقائياً.</p>
            </div>
            {canManage && (
              <button
                onClick={() => {
                  setEditingRuleId("new");
                  setEditKeyword("");
                  setEditResponse("");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus size={16} /> إضافة رد جديد
              </button>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {botRules.map((rule) => (
                  <motion.div key={rule.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group"
                  >
                    <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canManage && (
                        <>
                          <button onClick={() => {
                            setEditingRuleId(rule.id);
                            setEditKeyword(rule.keyword);
                            setEditResponse(rule.response);
                          }} className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                            <Settings size={12} />
                          </button>
                          <button onClick={() => deleteBotRule(rule.id)} className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                        الكلمة المفتاحية: {rule.keyword}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed line-clamp-3">
                      {rule.response}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {botRules.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                لا توجد ردود مبرمجة حالياً.
              </div>
            )}
          </div>

          {/* Edit Modal Overlay */}
          <AnimatePresence>
            {editingRuleId && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {editingRuleId === "new" ? "إضافة رد تلقائي جديد" : "تعديل الرد التلقائي"}
                    </h3>
                    <button onClick={() => setEditingRuleId(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الكلمة المفتاحية</label>
                      <input
                        type="text"
                        value={editKeyword}
                        onChange={(e) => setEditKeyword(e.target.value)}
                        placeholder="مثال: تطوع، تبرع، تواصل..."
                        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      />
                      <p className="text-xs text-gray-400 mt-1">يجب أن تكون كلمة مفتاحية شائعة محتمل أن يستخدمها الزائر</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الرد المبرمج (رسالة البوت)</label>
                      <textarea
                        value={editResponse}
                        onChange={(e) => setEditResponse(e.target.value)}
                        placeholder="أدخل الرد الذي سيظهر للمستخدم..."
                        rows={4}
                        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button onClick={() => setEditingRuleId(null)} className="px-5 py-2.5 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors">
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveRule}
                      disabled={!editKeyword.trim() || !editResponse.trim()}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Save size={16} /> حفظ الرد
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* SETTINGS TAB */
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">

          {/* API Key */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Key size={16} className="text-blue-500"/> مفتاح Gemini API</h3>
            <p className="text-xs text-gray-400 mb-4">يُستخدم لتشغيل البوت الذكي. احصل عليه من <span className="text-blue-500 font-medium">aistudio.google.com</span></p>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={localBotSettings.apiKey}
                onChange={e => setLocalBotSettings(p => ({ ...p, apiKey: e.target.value }))}
                placeholder="AIzaSy..."
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 pl-10 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-mono transition-all"
                dir="ltr"
              />
              <button onClick={() => setShowApiKey(p => !p)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showApiKey ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${localBotSettings.apiKey ? "text-green-600" : "text-amber-500"}`}>
              {localBotSettings.apiKey
                ? <><CheckCircle2 size={13}/> مفتاح محفوظ — البوت يعمل بـ Gemini AI</>
                : <><AlertCircle size={13}/> لا يوجد مفتاح — البوت يعمل بالردود التلقائية فقط</>}
            </div>
          </div>

          {/* Model */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Bot size={16} className="text-blue-500"/> إعدادات البوت</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">اسم البوت</label>
                <input value={localBotSettings.botName}
                  onChange={e => setLocalBotSettings(p => ({ ...p, botName: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">نموذج الذكاء الاصطناعي</label>
                <select value={localBotSettings.model}
                  onChange={e => setLocalBotSettings(p => ({ ...p, model: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 bg-white transition-all">
                  <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (أسرع)</option>
                  <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro (أذكى)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (الأحدث)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">رسالة الترحيب</label>
                <input value={localBotSettings.welcomeMessage}
                  onChange={e => setLocalBotSettings(p => ({ ...p, welcomeMessage: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"/>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">رسالة النظام (System Prompt)</label>
                <textarea value={localBotSettings.systemPrompt}
                  onChange={e => setLocalBotSettings(p => ({ ...p, systemPrompt: e.target.value }))}
                  rows={4} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed"/>
                <p className="text-xs text-gray-400 mt-1">هذه التعليمات تُرسل للبوت مع كل محادثة لتحديد شخصيته وأسلوبه</p>
              </div>
            </div>
          </div>

          {/* Test Bot */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MessageCircle size={16} className="text-blue-500"/> اختبر البوت</h3>
            <div className="flex gap-3">
              <input value={testMsg} onChange={e => setTestMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleTestBot()}
                placeholder="اكتب سؤالاً لاختبار البوت..."
                className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"/>
              <button onClick={handleTestBot} disabled={testing || !testMsg.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                {testing ? <RefreshCw size={14} className="animate-spin"/> : <Bot size={14}/>}
                {testing ? "جاري..." : "اختبر"}
              </button>
            </div>
            {testReply && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1"><Bot size={12}/> رد ملهم:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{testReply}</p>
              </div>
            )}
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button onClick={handleSaveSettings}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${settingsSaved ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"}`}>
              {settingsSaved ? <><CheckCircle2 size={16}/> تم الحفظ</> : <><Save size={16}/> حفظ الإعدادات</>}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
