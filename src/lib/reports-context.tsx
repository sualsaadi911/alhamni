"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auditLog } from "./audit-log";

export type ReportCategory = "financial" | "administrative" | "ethical" | "other";
export type ReportStatus = "new" | "reviewing" | "resolved" | "dismissed";
export type ReportPriority = "low" | "medium" | "high" | "urgent";

export interface ReportItem {
  id: string;
  trackingId: string;
  category: ReportCategory;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  timestamp: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  internalNotes?: string;
  attachments?: string[];
}

interface ReportsState {
  reports: ReportItem[];
}

interface ReportsContextType {
  state: ReportsState;
  submitReport: (report: Omit<ReportItem, "id" | "trackingId" | "status" | "timestamp" | "internalNotes">) => string;
  updateReportStatus: (id: string, status: ReportStatus, note?: string) => void;
  getReportByTrackingId: (trackingId: string) => ReportItem | undefined;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

const STORAGE_KEY = "alhumani_reports_v1";

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ReportsState>({ reports: [] });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reports", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const submitReport = (data: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const trackingId = "REP-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const newReport: ReportItem = {
      ...data,
      id,
      trackingId,
      status: "new",
      priority: data.priority || "medium",
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      reports: [newReport, ...prev.reports]
    }));

    auditLog.add({
      action: "إرسال بلاغ جديد",
      module: "Governance",
      details: `تم استلام بلاغ جديد برقم تتبع ${trackingId}`,
      user: "System/Anonymous"
    });

    return trackingId;
  };

  const updateReportStatus = (id: string, status: ReportStatus, note?: string) => {
    setState(prev => ({
      ...prev,
      reports: prev.reports.map(r => 
        r.id === id ? { ...r, status, internalNotes: note || r.internalNotes } : r
      )
    }));

    auditLog.add({
      action: "تحديث حالة بلاغ",
      module: "Governance",
      details: `تم تغيير حالة البلاغ ${id} إلى ${status}`,
      user: "Admin"
    });
  };

  const getReportByTrackingId = (trackingId: string) => {
    return state.reports.find(r => r.trackingId === trackingId);
  };

  return (
    <ReportsContext.Provider value={{ state, submitReport, updateReportStatus, getReportByTrackingId }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
