"use client";
import { useState } from "react";
import { useGovernance } from "@/lib/governance-context";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/roles";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, CheckCircle2, AlertCircle, XCircle, 
  FileText, MessageSquare, Upload, ArrowUpRight, 
  Download, BarChart3, PieChart as PieIcon, Info
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function TransparencyDashboard() {
  const { profile } = useAuth();
  const { state, updateQuestion, approveAssessment, getSummary } = useGovernance();
  const summary = getSummary();
  const [activeTab, setActiveTab] = useState<"table" | "charts">("table");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  if (!profile || !hasPermission(profile, "canManageTransparency")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldCheck size={56} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
          <p className="text-gray-400 mt-2 text-sm">هذا القسم مخصص للمدير التنفيذي ومدير الحوكمة والشؤون القانونية</p>
        </div>
      </div>
    );
  }

  const canEdit = hasPermission(profile, "canManageTransparency");
  const canApprove = hasPermission(profile, "canApproveTransparency") && !state.isApproved;

  const chartData = [
    { name: "متحقق", value: summary.yesCount, color: "#10B981" },
    { name: "جزئي", value: summary.partialCount, color: "#F59E0B" },
    { name: "غير متحقق", value: summary.noCount, color: "#EF4444" },
  ];

  const barData = state.questions.map(q => ({
    name: `مؤشر ${q.indicatorNumber}`,
    score: q.status === "yes" ? 100 : q.status === "partial" ? 50 : 0
  }));

  const handleEdit = (q: any) => {
    setEditingId(q.id);
    setEditForm({ ...q });
  };

  const handleSave = () => {
    if (editingId && editForm) {
      updateQuestion(editingId, editForm);
      setEditingId(null);
    }
  };

  const exportToExcel = () => {
    const data = state.questions.map(q => ({
      "رقم المؤشر": q.indicatorNumber,
      "الممارسة": q.practiceNumber,
      "السؤال": q.questionNumber,
      "نص السؤال": q.questionText,
      "الوزن": q.weight,
      "الحالة": q.status === "yes" ? "متحقق" : q.status === "partial" ? "جزئي" : "غير متحقق",
      "الشاهد": q.proofName,
      "التعليق": q.comment
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الشفافية");
    XLSX.writeFile(wb, "تقرير_الشفافية_الكامل.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    doc.text("تقرير معيار الشفافية والإفصاح", 105, 15, { align: "center" });
    
    const tableData = state.questions.map(q => [
      q.questionNumber,
      q.questionText,
      q.weight,
      q.status === "yes" ? "متحقق" : q.status === "partial" ? "جزئي" : "غير متحقق"
    ]);

    (doc as any).autoTable({
      head: [["#", "السؤال", "الوزن", "الحالة"]],
      body: tableData,
      startY: 25,
      styles: { font: "Roboto", halign: "right" },
      headStyles: { fillColor: [59, 91, 160] }
    });
    doc.save("تقرير_الشفافية.pdf");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <ShieldCheck className="text-primary-600" size={32} />
            معيار الشفافية والإفصاح
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            نموذج التقييم الذاتي لحوكمة الجمعيات الأهلية وفق معايير المركز الوطني (NCVC)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={exportToExcel}
              className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 transition-all border-l border-gray-100 flex items-center gap-2 text-sm"
            >
              <FileText size={16} className="text-emerald-600" />
              Excel
            </button>
            <button 
              onClick={exportToPDF}
              className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
            >
              <ArrowUpRight size={16} className="text-primary-600" />
              PDF
            </button>
          </div>
          {canApprove && (
            <button 
              onClick={approveAssessment}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
            >
              <CheckCircle2 size={18} />
              اعتماد التقييم
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          label="نسبة الامتثال" 
          value={`${Math.round(summary.percentage)}%`}
          subValue={`${summary.totalScore} / ${summary.maxScore} نقطة`}
          icon={ShieldCheck}
          color="primary"
          progress={summary.percentage}
        />
        <SummaryCard 
          label="المؤشرات المتحققة" 
          value={summary.yesCount.toString()}
          subValue="من أصل ٦ مؤشرات"
          icon={CheckCircle2}
          color="green"
        />
        <SummaryCard 
          label="جزئي / غير محقق" 
          value={(summary.partialCount + summary.noCount).toString()}
          subValue="تتطلب إجراءات تصحيحية"
          icon={AlertCircle}
          color="amber"
        />
        <SummaryCard 
          label="حالة التقرير" 
          value={state.isApproved ? "تم الاعتماد" : "قيد المراجعة"}
          subValue={state.isApproved ? `بواسطة: ${state.approvedBy}` : "لم يتم التوقيع النهائي بعد"}
          icon={state.isApproved ? CheckCircle2 : Info}
          color={state.isApproved ? "sky" : "slate"}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-50">
          <button 
            onClick={() => setActiveTab("table")}
            className={`flex-1 px-6 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === "table" ? "text-primary-600 bg-primary-50/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
          >
            <FileText size={18} />
            جدول التقييم التفصيلي
          </button>
          <button 
            onClick={() => setActiveTab("charts")}
            className={`flex-1 px-6 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === "charts" ? "text-primary-600 bg-primary-50/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
          >
            <BarChart3 size={18} />
            التحليل البياني والامتثال
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "table" ? (
              <motion.div 
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider">
                      <th className="px-4 py-4 rounded-r-xl">رقم السؤال</th>
                      <th className="px-4 py-4">نص السؤال</th>
                      <th className="px-4 py-4 text-center">الوزن</th>
                      <th className="px-4 py-4 text-center">الحالة</th>
                      <th className="px-4 py-4">الشاهد / التعليق</th>
                      <th className="px-4 py-4 rounded-l-xl text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-sm">
                    {state.questions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50 group transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-gray-400 font-bold">{q.questionNumber}</td>
                        <td className="px-4 py-4 min-w-[300px]">
                          <div className="flex flex-col">
                            <span className="text-gray-800 font-bold">{q.questionText}</span>
                            <span className="text-xs text-gray-400 mt-1 italic">{q.mechanism}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-black">
                            {q.weight}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={q.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 max-w-[200px]">
                            {q.proofUrl ? (
                              <a href={q.proofUrl} target="_blank" className="text-primary-600 hover:underline flex items-center gap-1 text-xs truncate">
                                <ArrowUpRight size={12} />
                                {q.proofName}
                              </a>
                            ) : (
                              <span className="text-gray-300 text-xs italic">لا يوجد مستند</span>
                            )}
                            {q.comment && (
                              <div className="flex items-start gap-1 text-gray-500 text-xs italic">
                                <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                                <span className="truncate">{q.comment}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {canEdit && (
                            <button 
                              onClick={() => handleEdit(q)}
                              className="text-primary-500 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-xl transition-all font-bold text-xs"
                            >
                              تعديل الإجابة
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                key="charts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4"
              >
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                  <h3 className="font-black text-gray-700 mb-6 flex items-center gap-2">
                    <PieIcon size={20} className="text-primary-500" />
                    توزيع حالات الامتثال
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {chartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                  <h3 className="font-black text-gray-700 mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary-500" />
                    تحليل الامتثال لكل مؤشر
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: '#F3F4F6' }} />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                           {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score === 100 ? "#10B981" : entry.score === 50 ? "#F59E0B" : "#EF4444"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4 italic font-medium">
                    النسبة المئوية للامتثال المحققة لكل مؤشر تقييم
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xl font-black text-gray-800">تعديل بيانات المؤشر</h3>
                <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <XCircle size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                  <p className="text-xs font-black text-primary-600 uppercase mb-1">المؤشر المختار</p>
                  <p className="text-sm font-bold text-primary-900">{editForm.questionText}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">حالة الامتثال</label>
                    <select 
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="yes">متحقق (١٠٠٪)</option>
                      <option value="partial">جزئي (٥٠٪)</option>
                      <option value="no">غير متحقق (٠٪)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">اسم الشاهد / المستند</label>
                    <input 
                      type="text"
                      value={editForm.proofName}
                      onChange={(e) => setEditForm({...editForm, proofName: e.target.value})}
                      placeholder="مثال: القوائم المالية ٢٠٢٣"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">رابط المستند (اختياري)</label>
                  <input 
                    type="text"
                    value={editForm.proofUrl}
                    onChange={(e) => setEditForm({...editForm, proofUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">ملاحظات إضافية</label>
                  <textarea 
                    value={editForm.comment}
                    onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                  >
                    حفظ التعديلات
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

function SummaryCard({ label, value, subValue, icon: Icon, color, progress }: any) {
  const colors: any = {
    primary: "from-primary-500 to-primary-700 bg-primary-50 text-white",
    green:   "from-emerald-500 to-emerald-700 bg-emerald-50 text-white",
    amber:   "from-amber-500 to-amber-700 bg-amber-50 text-white",
    sky:     "from-sky-500 to-sky-700 bg-sky-50 text-white",
    slate:   "from-slate-500 to-slate-700 bg-slate-50 text-white",
  };

  const bgColors: any = {
    primary: "bg-primary-50 text-primary-600",
    green:   "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    sky:     "bg-sky-50 text-sky-600",
    slate:   "bg-slate-50 text-slate-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${bgColors[color].split(' ')[0]}`}
          />
        </div>
      )}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-black text-gray-800 tracking-tight">
            {value}
          </h3>
          <p className="text-gray-500 text-[11px] font-bold mt-1.5 flex items-center gap-1.5 opacity-80">
            {subValue}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${bgColors[color]} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ComplianceStatus }) {
  const configs: any = {
    yes: { 
      label: "متحقق", 
      icon: CheckCircle2, 
      color: "bg-emerald-50 text-emerald-700 border-emerald-100" 
    },
    no: { 
      label: "غير متحقق", 
      icon: XCircle, 
      color: "bg-red-50 text-red-700 border-red-100" 
    },
    partial: { 
      label: "جزئي", 
      icon: AlertCircle, 
      color: "bg-amber-50 text-amber-700 border-amber-100" 
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.color} font-black text-[11px]`}>
      <Icon size={12} />
      {config.label}
    </div>
  );
}
