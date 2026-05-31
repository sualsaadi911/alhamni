"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useReports, ReportItem, ReportStatus } from "@/lib/reports-context";
import { hasPermission } from "@/lib/roles";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, Inbox, CheckCircle2, XCircle, 
  Clock, Filter, Search, MoreVertical, Eye, 
  MessageSquare, Calendar, User, Shield, ArrowUpRight,
  TrendingUp, Activity, Lock
} from "lucide-react";

export default function ReportsDashboard() {
  const { profile } = useAuth();
  const { state, updateReportStatus } = useReports();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const [search, setSearch] = useState("");

  if (!profile || !hasPermission(profile, "canManageReports")) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <Lock size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-800">غير مصرح لك بالوصول</h2>
        <p className="text-sm text-slate-500 mt-1">هذا القسم مخصص للمدير التنفيذي ومدير الحوكمة فقط.</p>
      </div>
    );
  }

  const filteredReports = state.reports.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.trackingId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: state.reports.length,
    new: state.reports.filter(r => r.status === "new").length,
    open: state.reports.filter(r => r.status === "reviewing").length,
    resolved: state.reports.filter(r => r.status === "resolved").length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <AlertTriangle className="text-primary-600" size={32} />
            إدارة البلاغات والنزاهة
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">
            مراجعة ومعالجة البلاغات الواردة بنظام السرية التامة
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <StatBadge label="إجمالي" value={stats.total} color="slate" />
          <StatBadge label="جديد" value={stats.new} color="amber" />
          <StatBadge label="قيد المراجعة" value={stats.open} color="blue" />
          <StatBadge label="تم الحل" value={stats.resolved} color="emerald" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث برقم التتبع أو العنوان..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pr-12 pl-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="الكل" />
          <FilterButton active={filter === "new"} onClick={() => setFilter("new")} label="جديد" />
          <FilterButton active={filter === "reviewing"} onClick={() => setFilter("reviewing")} label="قيد المراجعة" />
          <FilterButton active={filter === "resolved"} onClick={() => setFilter("resolved")} label="تم الحل" />
          <FilterButton active={filter === "dismissed"} onClick={() => setFilter("dismissed")} label="مستبعد" />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* List */}
        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">صندوق الوارد</h3>
            <span className="text-[10px] font-bold text-slate-400">{filteredReports.length} بلاغات</span>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  active={selectedReport?.id === report.id}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
              {filteredReports.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <Inbox size={40} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-bold text-sm">لا توجد بلاغات حالياً</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Details View */}
        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div 
                key={selectedReport.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] sticky top-8"
              >
                {/* Detail Header */}
                <div className="p-8 border-b border-slate-50 flex items-start justify-between bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-400 text-[10px] font-black tracking-widest uppercase">
                        {selectedReport.trackingId}
                      </span>
                      <PriorityBadge priority={selectedReport.priority} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedReport.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusDropdown 
                      status={selectedReport.status} 
                      onUpdate={(newStatus) => updateReportStatus(selectedReport.id, newStatus)} 
                    />
                  </div>
                </div>

                {/* Detail Body */}
                <div className="p-8 space-y-10">
                  {/* Category & Reporter */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <TrendingUp size={12} /> التصنيف
                      </p>
                      <p className="text-sm font-black text-slate-800">
                        {selectedReport.category === 'financial' ? 'مالي' : 
                         selectedReport.category === 'administrative' ? 'إداري' : 
                         selectedReport.category === 'ethical' ? 'سلوكي / أخلاقي' : 'أخرى'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <User size={12} /> المُبلّغ
                      </p>
                      <p className="text-sm font-black text-slate-800">
                        {selectedReport.isAnonymous ? 'مجهول الهوية' : selectedReport.reporterName}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Calendar size={12} /> التاريخ
                      </p>
                      <p className="text-sm font-black text-slate-800">
                        {new Date(selectedReport.timestamp).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={14} /> تفاصيل المحتوى
                    </h4>
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 text-slate-700 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                      {selectedReport.description}
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <MessageSquare size={14} /> ملاحظات إدارية داخلية
                    </h4>
                    <textarea 
                      placeholder="أضف ملاحظات التحقيق السرية هنا (لا تظهر للمُبلّغ)..."
                      value={selectedReport.internalNotes || ""}
                      onChange={(e) => updateReportStatus(selectedReport.id, selectedReport.status, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-3xl px-6 py-5 font-bold text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none h-32 italic text-slate-500"
                    />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Shield size={12} className="text-emerald-500" /> البوروتوكول الأمني نشط · هذا البلاغ مُشفر
                   </div>
                   <button className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">طباعة التحديث</button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mb-6">
                  <Eye size={36} />
                </div>
                <h3 className="text-xl font-black text-slate-800">لم يتم اختيار أي بلاغ</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">اختر بلاغاً من القائمة الجانبية لمراجعته واتخاذ الإجراءات اللازمة</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Shared Subcomponents ─────────────────────────────────────────────────────────

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: any = {
    slate:   "bg-slate-50 text-slate-500",
    amber:   "bg-amber-50 text-amber-600",
    blue:    "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className={`px-4 py-2 rounded-xl flex items-center gap-3 ${colors[color]}`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-base font-black tracking-tight">{value}</span>
    </div>
  );
}

function FilterButton({ active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2 rounded-xl whitespace-nowrap text-xs font-black transition-all ${
        active 
        ? 'bg-primary-600 text-white shadow-md shadow-primary-100' 
        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

function ReportCard({ report, active, onClick }: { report: ReportItem; active: boolean; onClick: () => void }) {
  const statusColors: any = {
    new: 'bg-amber-500',
    reviewing: 'bg-blue-500',
    resolved: 'bg-emerald-500',
    dismissed: 'bg-slate-400',
  };

  return (
    <motion.button 
      layout
      onClick={onClick}
      className={`w-full text-right p-5 rounded-3xl border transition-all ${
        active 
        ? 'bg-white border-primary-500 shadow-lg shadow-primary-50/50' 
        : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${statusColors[report.status]}`} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{report.trackingId}</span>
      </div>
      <h4 className={`font-black text-sm mb-2 transition-colors ${active ? 'text-primary-600' : 'text-slate-800'}`}>{report.title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <Calendar size={12} /> {new Date(report.timestamp).toLocaleDateString('ar-SA')}
        </span>
        <PriorityBadge priority={report.priority} size="sm" />
      </div>
    </motion.button>
  );
}

function PriorityBadge({ priority, size = 'default' }: { priority: string, size?: 'sm' | 'default' }) {
  const configs: any = {
    low:    { label: 'عادي', color: 'bg-slate-100 text-slate-500' },
    medium: { label: 'متوسط', color: 'bg-blue-50 text-blue-600' },
    high:   { label: 'مرتفع', color: 'bg-orange-50 text-orange-600' },
    urgent: { label: 'عاجل', color: 'bg-red-50 text-red-600' },
  };
  const config = configs[priority];
  return (
    <span className={`${size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'} rounded-lg font-black tracking-widest uppercase ${config.color}`}>
      {config.label}
    </span>
  );
}

function StatusDropdown({ status, onUpdate }: { status: ReportStatus; onUpdate: (s: ReportStatus) => void }) {
  return (
    <select 
      value={status}
      onChange={(e) => onUpdate(e.target.value as ReportStatus)}
      className="bg-white border border-slate-200 text-slate-800 font-black text-xs px-4 py-2.5 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
    >
      <option value="new">🆕 جديد</option>
      <option value="reviewing">🔍 قيد المراجعة</option>
      <option value="resolved">✅ تم الحل</option>
      <option value="dismissed">🚫 مستبعد</option>
    </select>
  );
}
