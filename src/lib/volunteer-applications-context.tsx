"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ApplicationStatus = "قيد المراجعة" | "مقبول" | "مرفوض";

export interface VolunteerApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  date: string;
  status: ApplicationStatus;
}

interface VolunteerApplicationsContextType {
  applications: VolunteerApplication[];
  submitApplication: (data: Omit<VolunteerApplication, "id" | "date" | "status">) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  pendingCount: number;
}

const INITIAL: VolunteerApplication[] = [
  {
    id: "a1", name: "نورة القحطاني", phone: "0551234567",
    email: "noura@example.com", program: "منسق فعاليات",
    message: "أرغب في المشاركة في برامج التوعية المجتمعية وتنمية مهاراتي القيادية.",
    date: "2026-04-22", status: "قيد المراجعة",
  },
  {
    id: "a2", name: "فيصل الدوسري", phone: "0509876543",
    email: "faisal@example.com", program: "مصمم جرافيك",
    message: "لدي خبرة في البرمجة وأريد المساهمة في دعم المبادرات التقنية.",
    date: "2026-04-20", status: "قيد المراجعة",
  },
  {
    id: "a3", name: "منال الشهري", phone: "0567891234",
    email: "manal@example.com", program: "مدرب متطوع",
    message: "خريجة إدارة أعمال وأريد دعم رواد الأعمال الشباب.",
    date: "2026-04-18", status: "مقبول",
  },
];

const VolunteerApplicationsContext = createContext<VolunteerApplicationsContextType>({} as VolunteerApplicationsContextType);

export function VolunteerApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<VolunteerApplication[]>(INITIAL);

  const submitApplication = useCallback((data: Omit<VolunteerApplication, "id" | "date" | "status">) => {
    const newApp: VolunteerApplication = {
      id: `app-${Date.now()}`,
      ...data,
      date: new Date().toISOString().split("T")[0],
      status: "قيد المراجعة",
    };
    setApplications(prev => [newApp, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const pendingCount = applications.filter(a => a.status === "قيد المراجعة").length;

  return (
    <VolunteerApplicationsContext.Provider value={{ applications, submitApplication, updateStatus, pendingCount }}>
      {children}
    </VolunteerApplicationsContext.Provider>
  );
}

export const useVolunteerApplications = () => useContext(VolunteerApplicationsContext);
