"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Bot, User, RefreshCw,
  ChevronDown, Sparkles, Minimize2,
} from "lucide-react";
import { useCms } from "@/lib/cms-context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "مرحبًا بك! أنا ملهم 🤖\nمساعدك الذكي، يسعدني الإجابة على استفساراتك ومساعدتك في الوصول إلى ما تبحث عنه.\n\nيمكنك سؤالي عن برامج الجمعية، فرص التطوع، التبرع، أو أي استفسار آخر.",
};

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatBot() {
  const { botRules } = useCms();
  
  const SUGGESTED_QUESTIONS = [
    "ما هي رؤية ومهمة جمعية ألهمني؟",
    "كيف يمكنني التطوع في الجمعية؟",
    "ما هي برامج الجمعية الحالية؟",
    "كيف أتبرع لدعم الجمعية؟",
    "كيف أتواصل مع الجمعية؟",
    "وش أوقات العمل؟",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionId] = useState(generateSessionId);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom();
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNewMessage(false);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      const userMessage: Message = { role: "user", content };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setShowSuggestions(false);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            sessionId,
            rules: botRules,
          }),
        });

        const data = await res.json();
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message || data.error || "عذراً، حدث خطأ.",
        };

        setMessages((prev) => [...prev, assistantMessage]);
        if (!isOpen || isMinimized) setHasNewMessage(true);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "عذراً، تعذّر الاتصال. يرجى التحقق من اتصالك والمحاولة مجدداً.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, sessionId, isOpen, isMinimized]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowSuggestions(true);
    setInput("");
  };

  const toggleOpen = () => {
    setIsOpen((v) => !v);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A3668 0%, #2B519B 50%, #3B6AC7 100%)" }}
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.93 }}
        aria-label="فتح المساعد الذكي ملهم"
      >
        {/* Shine layer */}
        <span className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 70%)" }} />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}>
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex flex-col items-center gap-0.5">
              {/* Bot face */}
              <div className="relative">
                {/* Antenna */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-1 h-2 bg-white/70 rounded-full" />
                  <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_2px_rgba(103,232,249,0.8)]" />
                </div>
                {/* Head */}
                <div className="w-8 h-7 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center gap-1 mt-1">
                  {/* Eyes */}
                  <motion.div
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_1px_rgba(103,232,249,0.9)]"
                  />
                  <motion.div
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 0.05 }}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_4px_1px_rgba(103,232,249,0.9)]"
                  />
                </div>
                {/* Mouth */}
                <div className="w-4 h-1 rounded-full bg-white/40 mx-auto mt-0.5" />
              </div>
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-60"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 30, originX: 0, originY: 1 }}
            animate={isMinimized
              ? { opacity: 1, scale: 1, y: 0, height: "auto" }
              : { opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              height: isMinimized ? "auto" : "520px",
              background: "#fff",
              border: "1px solid #E2E8F0",
            }}
          >
            {/* Header (Premium Glassmorphism) */}
            <div
              className="flex items-center justify-between px-4 py-4 text-white select-none backdrop-blur-md relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(43, 81, 155, 0.95) 0%, rgba(26, 54, 104, 0.98) 100%)" }}
            >
              {/* Subtle glass effect highlight */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-lg border-2 border-white/20">
                  <div className="w-full h-full rounded-full overflow-hidden bg-blue-50">
                    <img 
                      src="/images/bot-avatar.png" 
                      alt="ملهم" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">ملهم</p>
                  <p className="text-[11px] text-blue-200">المساعد الذكي · متاح دائماً</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="محادثة جديدة"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                  title={isMinimized ? "توسيع" : "تصغير"}
                >
                  {isMinimized ? <ChevronDown size={14} /> : <Minimize2 size={14} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="إغلاق"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth" style={{ background: "#F8FAFC" }}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                          msg.role === "assistant"
                            ? "bg-white border border-blue-100 shadow-sm"
                            : "text-white"
                        }`}
                        style={msg.role === "user" ? { background: "#2B519B" } : {}}
                      >
                        {msg.role === "assistant" ? (
                          <div className="w-full h-full bg-white">
                            <img src="/images/bot-avatar.png" alt="ملهم" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <User size={14} />
                        )}
                      </div>

                      {/* Bubble (Polished Style) */}
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                          msg.role === "user"
                            ? "text-white rounded-tl-none font-medium"
                            : "text-gray-800 rounded-tr-none border border-blue-50/50"
                        }`}
                        style={msg.role === "user"
                          ? { background: "linear-gradient(135deg, #2B519B 0%, #1A3668 100%)" }
                          : { background: "#fff", boxShadow: "0 4px 12px -2px rgba(0,0,0,0.05)" }}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading (Sleek Indicator) */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-end gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center overflow-hidden shadow-sm">
                        <img src="/images/bot-avatar.png" alt="ملهم" className="w-full h-full object-cover" />
                      </div>
                      <div className="px-5 py-4 rounded-2xl rounded-tr-none bg-white border border-blue-50 shadow-md">
                        <div className="flex gap-1.5 items-center">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                backgroundColor: ["#3B82F6", "#60A5FA", "#3B82F6"] 
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1,
                                delay: d * 0.2 
                              }}
                              className="w-2 h-2 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested Questions */}
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-1"
                    >
                      <p className="text-xs text-gray-400 mb-2 text-center">اقتراحات للبدء</p>
                      <div className="flex flex-col gap-1.5">
                        {SUGGESTED_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="text-right text-xs px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-3 py-3 border-t border-gray-100 bg-white">
                  {/* Quick suggestions toggle */}
                  <div className="flex justify-end mb-1.5">
                    <button
                      onClick={() => setShowSuggestions(v => !v)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                        showSuggestions
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <Sparkles size={11}/> أسئلة شائعة
                    </button>
                  </div>
                  <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-blue-400 focus-within:bg-white transition-colors">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="اكتب رسالتك..."
                      rows={1}
                      disabled={isLoading}
                      className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 outline-none max-h-28"
                      style={{ minHeight: "24px", fontFamily: "inherit" }}
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isLoading}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                      style={{ background: input.trim() && !isLoading ? "#2B519B" : "#E2E8F0" }}
                    >
                      <Send size={14} className={input.trim() && !isLoading ? "text-white" : "text-gray-400"} style={{ transform: "scaleX(-1)" }} />
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-gray-300 mt-1.5">
                    مدعوم بالذكاء الاصطناعي · جمعية ألهمني
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
