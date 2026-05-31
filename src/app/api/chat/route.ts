import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface BotRule {
  keyword: string;
  response: string;
}

// تفحص الردود المخصصة فقط (بدون الردود الافتراضية)
function checkCustomRules(userMessage: string, rules: BotRule[]): string | null {
  if (!rules || !Array.isArray(rules) || rules.length === 0) return null;
  const text = userMessage.trim().toLowerCase();
  for (const rule of rules) {
    if (rule.keyword && text.includes(rule.keyword.toLowerCase())) {
      return rule.response;
    }
  }
  return null;
}

function getBotResponse(userMessage: string, rules: BotRule[]): string {
  if (!userMessage) return "عذراً، لم أفهم رسالتك. كيف يمكنني مساعدتك؟";

  const text = userMessage.trim().toLowerCase();

  // Greetings
  if (text.match(/(السلام|هلا|مرحبا|كيف الحال|شخبارك|صباح|مساء|هاي|اهلا|أهلا)/)) {
    return "وعليكم السلام ورحمة الله! أنا 'مُلهم'، مساعدك الذكي في مبادرة ألهمني. كيف أقدر أفيدك اليوم؟ 😊";
  }

  // Identity
  if (text.match(/(من انت|من انتم|وش انت|عرف نفسك|ايش انت)/)) {
    return "أنا مُلهم، المساعد الذكي لمبادرة ألهمني. أنا هنا لمساعدتك في التعرف على برامجنا، طموحاتنا، وكيفية الانضمام إلينا.";
  }

  // Policy / Privacy
  if (text.match(/(سياسة|سياستكم|خصوصية|شروط|بيانات|معلوماتي)/)) {
    return "نحن في ألهمني نلتزم بحماية خصوصيتك وبياناتك الشخصية وفق أعلى معايير الأمان. لا نشارك معلوماتك مع أي طرف ثالث دون إذنك. للاطلاع على سياسة الخصوصية الكاملة يمكنك زيارة صفحة 'سياسة الخصوصية' في الموقع.";
  }

  // Volunteering
  if (text.match(/(تطوع|اشارك|انضم|مشاركة|انضمام)/)) {
    return "نسعد جداً برغبتك في التطوع! يمكنك الانضمام إلينا من خلال الضغط على زر 'انضم إلينا' في القائمة الرئيسية أو زيارة صفحة التطوع المخصصة.";
  }

  // Vision / Goals
  if (text.match(/(رؤية|هدف|رسالة|مبادرة|ايش تسوون|ماذا تفعلون|عن الجمعية|عن ألهمني|عن الهمني)/)) {
    return "رؤيتنا في ألهمني هي تمكين الشباب السعودي وتطوير مهاراتهم القيادية والمهنية ليكونوا لبنة فاعلة في رؤية المملكة ٢٠٣٠.";
  }

  // Programs
  if (text.match(/(برنامج|برامج|دورة|دورات|تدريب|ورشة|فعالية|نشاط)/)) {
    return "لدينا برامج متنوعة في القيادة، وريادة الأعمال، والتطوير المهني. يمكنك الاطلاع على جميع البرامج المتاحة في صفحة 'البرامج' على موقعنا.";
  }

  // Contact
  if (text.match(/(تواصل|اتصال|ايميل|بريد|رقم|هاتف|واتس|جوال)/)) {
    return "يمكنك التواصل معنا عبر صفحة 'تواصل معنا' في الموقع، أو عبر حساباتنا على منصات التواصل الاجتماعي. سنرد عليك في أقرب وقت ممكن.";
  }

  // Registration / Membership
  if (text.match(/(تسجيل|عضوية|اشتراك|سجل|حساب)/)) {
    return "للتسجيل في برامجنا أو الانضمام كعضو، يمكنك زيارة صفحة 'انضم إلينا' واتباع خطوات التسجيل البسيطة.";
  }

  // Dynamic CMS Rules
  if (rules && Array.isArray(rules)) {
    for (const rule of rules) {
      if (text.includes(rule.keyword.toLowerCase())) {
        return rule.response;
      }
    }
  }

  return "شكراً لتواصلك! للإجابة على سؤالك بشكل أدق، هل يمكنك توضيح ما تبحث عنه؟ أنا هنا للمساعدة في كل ما يخص برامج ألهمني وفرص التطوع والانضمام.";
}

async function getGeminiResponse(messages: any[], rules: BotRule[], overrideKey?: string, overrideModel?: string): Promise<string> {
  const apiKey = overrideKey || process.env.GOOGLE_AI_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("Missing Gemini Key");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const lastMessage = messages[messages.length - 1].content;

  const knowledgeBase = rules.map(r => `السؤال: ${r.keyword} -> الإجابة: ${r.response}`).join("\n");
  const systemInstructions = `أنت "مُلهم"، المساعد الذكي الرسمي لجمعية "ألهمني". معلوماتك الرسمية:\n${knowledgeBase}\n\nتعليمات مهمة:\n- تحدث باللغة العربية الفصحى البسيطة أو اللهجة السعودية الخفيفة\n- كن ودوداً ومختصراً\n- إذا لم تعرف الإجابة، اعترف بذلك وأحل المستخدم لصفحات الموقع\n- لا تخترع معلومات غير موجودة في قاعدة المعرفة`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const model = genAI.getGenerativeModel({
      model: overrideModel || "gemini-1.5-flash-latest",
      systemInstruction: systemInstructions,
    });

    const history = messages
      .slice(0, -1)
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId, rules, apiKey: clientApiKey, model: clientModel } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "رسائل غير صالحة" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    let assistantMessage = "";

    const activeKey = (clientApiKey && clientApiKey !== "") ? clientApiKey : process.env.GOOGLE_AI_KEY;

    // تحقق من الردود التلقائية أولاً قبل Gemini
    const ruleMatch = checkCustomRules(lastMessage.content, rules || []);

    try {
      if (ruleMatch) {
        // رد مخصص موجود — استخدمه مباشرة
        assistantMessage = ruleMatch;
      } else if (activeKey && activeKey !== "your_api_key_here") {
        assistantMessage = await getGeminiResponse(messages, rules || [], activeKey, clientModel);
      } else {
        assistantMessage = getBotResponse(lastMessage.content, rules || []);
      }
    } catch (error: any) {
      console.error("Gemini Error, falling back to rules:", error.message);
      assistantMessage = getBotResponse(lastMessage.content, rules || []);
    }

    if (sessionId) {
      supabase.from("chatbot_conversations").insert({
        session_id: sessionId,
        user_message: lastMessage.content || "",
        assistant_message: assistantMessage,
      }).then(({ error }) => { if (error) console.error("Supabase Logging Error:", error); });
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { error: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
