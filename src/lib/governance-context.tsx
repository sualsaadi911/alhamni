"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useAuth } from "./auth-context";
import { auditLog } from "./audit-log";

export type ComplianceStatus = "yes" | "no" | "partial";

export interface TransparencyQuestion {
  id: string;
  indicatorNumber: string;
  practiceNumber: string;
  questionNumber: string;
  questionText: string;
  weight: number;
  mechanism: string;
  verification: string;
  status: ComplianceStatus;
  comment: string;
  proofUrl: string;
  proofName: string;
  updatedAt: string;
}

export interface GovernanceState {
  questions: TransparencyQuestion[];
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

const INDICATORS_PLACEHOLDER: TransparencyQuestion[] = [
  {
    id: "q1",
    indicatorNumber: "1",
    practiceNumber: "1.1",
    questionNumber: "1.1.1",
    questionText: "هل تقوم الجمعية بنشر أهدافها وبرامجها على موقعها الإلكتروني؟",
    weight: 5,
    mechanism: "وجود أهداف واضحة ومحدثة على الموقع.",
    verification: "رابط صفحة 'عن التطبيق/الجمعية'.",
    status: "yes",
    comment: "منشورة في صفحة 'عن ألهمني'.",
    proofUrl: "/about",
    proofName: "صفحة التعريف",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q2",
    indicatorNumber: "1",
    practiceNumber: "1.2",
    questionNumber: "1.2.1",
    questionText: "هل يتم نشر القوائم المالية المعتمدة لآخر سنتين ماليتين؟",
    weight: 10,
    mechanism: "ملفات PDF للقوائم المالية.",
    verification: "رابط قسم التقارير المالية.",
    status: "partial",
    comment: "تم نشر 2023 وبانتظار اعتماد 2024.",
    proofUrl: "/reports",
    proofName: "التقارير السنوية",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q3",
    indicatorNumber: "2",
    practiceNumber: "2.1",
    questionNumber: "2.1.1",
    questionText: "هل تتوفر سياسة مكتوبة ومعتمدة لتعارض المصالح؟",
    weight: 8,
    mechanism: "وثيقة السياسة معتمدة من مجلس الإدارة.",
    verification: "رابط قسم السياسات.",
    status: "yes",
    comment: "معتمدة ومنشورة.",
    proofUrl: "/policies",
    proofName: "سياسة تعارض المصالح",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q4",
    indicatorNumber: "2",
    practiceNumber: "2.2",
    questionNumber: "2.2.1",
    questionText: "هل يتم نشر أسماء وبيانات أعضاء مجلس الإدارة؟",
    weight: 7,
    mechanism: "قائمة محدثة بالأسماء والمناصب.",
    verification: "رابط صفحة مجلس الإدارة.",
    status: "yes",
    comment: "محدثة في قسم الإدارة.",
    proofUrl: "/board",
    proofName: "مجلس الإدارة",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q5",
    indicatorNumber: "3",
    practiceNumber: "3.1",
    questionNumber: "3.1.1",
    questionText: "هل توفر الجمعية وسيلة لاستقبال المقترحات والشكاوى؟",
    weight: 5,
    mechanism: "وجود نموذج أو رقم تواصل مخصص.",
    verification: "رابط صفحة اتصل بنا.",
    status: "yes",
    comment: "متوفر نموذج ومنصات تواصل.",
    proofUrl: "/contact",
    proofName: "صفحة التواصل",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q6",
    indicatorNumber: "3",
    practiceNumber: "3.2",
    questionNumber: "3.2.1",
    questionText: "هل يتم نشر تقرير سنوي يوضح الأثر الاجتماعي والمستفيدين؟",
    weight: 10,
    mechanism: "تقرير الإنجاز السنوي.",
    verification: "رابط التقارير.",
    status: "no",
    comment: "جاري إعداد تقرير 2024.",
    proofUrl: "",
    proofName: "لا يوجد",
    updatedAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = "alhamni_governance_state";

interface GovernanceContextType {
  state: GovernanceState;
  updateQuestion: (id: string, updates: Partial<TransparencyQuestion>) => void;
  approveAssessment: () => void;
  getSummary: () => {
    totalScore: number;
    maxScore: number;
    percentage: number;
    complianceColor: string;
    yesCount: number;
    noCount: number;
    partialCount: number;
  };
}

const GovernanceContext = createContext<GovernanceContextType>({} as GovernanceContextType);

export function GovernanceProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [state, setState] = useState<GovernanceState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { questions: INDICATORS_PLACEHOLDER, isApproved: false };
    }
    return { questions: INDICATORS_PLACEHOLDER, isApproved: false };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateQuestion = useCallback((id: string, updates: Partial<TransparencyQuestion>) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
      )
    }));

    if (profile) {
      auditLog.add({
        actorUid: profile.uid,
        actorName: profile.name,
        actorRole: profile.role,
        action: "content_updated",
        targetName: `سؤال الشفافية: ${id}`,
        details: "تحديث حالة أو تفاصيل مؤشر الشفافية"
      });
    }
  }, [profile]);

  const approveAssessment = useCallback(() => {
    if (!profile) return;
    setState(prev => ({
      ...prev,
      isApproved: true,
      approvedBy: profile.name,
      approvedAt: new Date().toISOString(),
    }));

    auditLog.add({
      actorUid: profile.uid,
      actorName: profile.name,
      actorRole: profile.role,
      action: "content_published",
      targetName: "تقرير الشفافية والإفصاح",
      details: "اعتماد التقييم الذاتي النهائي"
    });
  }, [profile]);

  const getSummary = useCallback(() => {
    let totalScore = 0;
    let maxScore = 0;
    let yesCount = 0;
    let noCount = 0;
    let partialCount = 0;

    state.questions.forEach(q => {
      maxScore += q.weight;
      if (q.status === "yes") {
        totalScore += q.weight;
        yesCount++;
      } else if (q.status === "partial") {
        totalScore += q.weight * 0.5;
        partialCount++;
      } else {
        noCount++;
      }
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    let complianceColor = "text-red-500";
    if (percentage >= 80) complianceColor = "text-green-500";
    else if (percentage >= 50) complianceColor = "text-amber-500";

    return { totalScore, maxScore, percentage, complianceColor, yesCount, noCount, partialCount };
  }, [state.questions]);

  return (
    <GovernanceContext.Provider value={{ state, updateQuestion, approveAssessment, getSummary }}>
      {children}
    </GovernanceContext.Provider>
  );
}

export const useGovernance = () => useContext(GovernanceContext);
