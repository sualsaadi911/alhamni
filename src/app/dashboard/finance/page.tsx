"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/roles";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Download, Plus, X, Save } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  desc: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  fileName?: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, desc: "تبرع من مؤسسة الراجحي الخيرية", amount: 50000, type: "income", date: "2024-02-01", category: "تبرعات" },
  { id: 2, desc: "مصاريف تنظيم فعالية القيادة", amount: 12000, type: "expense", date: "2024-02-05", category: "برامج وفعاليات" },
  { id: 3, desc: "رسوم اشتراكات الأعضاء - الربع الثاني", amount: 8500, type: "income", date: "2024-02-10", category: "اشتراكات" },
  { id: 4, desc: "رواتب الفريق - شهر فبراير", amount: 25000, type: "expense", date: "2024-02-28", category: "رواتب وأجور" },
];

export default function FinancePage() {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ desc: "", amount: "", type: "income" as TransactionType, category: "أخرى", fileName: "" });

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoriesDist = useMemo(() => {
    const map = new Map<string, number>();
    let totalExpense = 0;
    transactions.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
      totalExpense += t.amount;
    });
    
    const res = Array.from(map.entries()).map(([label, amt], i) => {
      const colors = ["bg-primary-500", "bg-sky-400", "bg-indigo-400", "bg-purple-400"];
      return {
        label,
        amt,
        percent: totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0,
        color: colors[i % colors.length]
      };
    });
    return res.sort((a, b) => b.percent - a.percent);
  }, [transactions]);

  if (!profile || !hasPermission(profile, "canViewFinance")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-700">ليس لديك صلاحية الوصول</h2>
        </div>
      </div>
    );
  }

  const handleAddTransaction = () => {
    if (!form.desc || !form.amount) return alert("الرجاء تعبئة الوصف والمبلغ");
    const numAmount = parseFloat(form.amount);
    if (isNaN(numAmount) || numAmount <= 0) return alert("المبلغ غير صالح");

    const newTx: Transaction = {
      id: Date.now(),
      desc: form.desc,
      amount: numAmount,
      type: form.type,
      category: form.type === "income" ? "إيراد" : form.category,
      date: new Date().toISOString().split('T')[0],
      fileName: form.fileName,
    };

    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setForm({ desc: "", amount: "", type: "income", category: "أخرى", fileName: "" });
  };

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700">الشؤون المالية (دفتر الأستاذ)</h1>
          <p className="text-gray-400 mt-1">تتبع الحركة المالية وإدارة الإيرادات والمصروفات</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> حركة جديدة
          </button>
          <button className="btn-outline flex items-center gap-2">
            <Download size={18} /> تقرير
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "إجمالي الإيرادات", value: stats.income, icon: TrendingUp, color: "from-blue-400 to-blue-600" },
          { label: "إجمالي المصروفات", value: stats.expense, icon: TrendingDown, color: "from-indigo-400 to-indigo-600" },
          { label: "الرصيد الحالي", value: stats.balance, icon: DollarSign, color: "from-primary-400 to-primary-600" },
        ].map((card, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i} className="bg-white rounded-2xl p-6 shadow-sm border border-primary-50">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-md`}>
              <card.icon size={22} className="text-white" />
            </div>
            <p className="text-3xl font-black text-gray-800 mb-1">{card.value.toLocaleString("ar-SA")} <span className="text-lg">ر.س</span></p>
            <p className="text-sm font-semibold text-gray-500 mb-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-primary-50 p-6">
          <h2 className="text-lg font-bold text-primary-700 mb-5">سجل الحركات المالية</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            <AnimatePresence>
              {transactions.map((t, i) => (
                <motion.div key={t.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-sky-50 text-sky-600" : "bg-indigo-50 text-indigo-500"}`}>
                      {t.type === "income" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{t.desc}</p>
                      <div className="flex gap-2 text-xs text-gray-400 mt-1 font-medium pb-1">
                        <span>{t.date}</span> • <span>{t.category}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-black text-base md:text-lg whitespace-nowrap ${t.type === "income" ? "text-sky-600" : "text-indigo-500"}`}>
                    {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString("ar-SA")} ر.س
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {transactions.length === 0 && <p className="text-center text-gray-400 py-8">لا توجد حركات مالية مسجلة</p>}
          </div>
        </motion.div>

        {/* Expense Categories */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="bg-white rounded-2xl shadow-sm border border-primary-50 p-6 self-start">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <PieChart size={20} />
            </div>
            <h2 className="text-lg font-bold text-primary-700">توزيع المصروفات</h2>
          </div>
          <div className="space-y-5">
            {categoriesDist.length > 0 ? categoriesDist.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-bold">{cat.label}</span>
                  <span className="font-black text-primary-700">{cat.percent}٪</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percent}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${cat.color}`} />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 font-medium">{cat.amt.toLocaleString()} ر.س</p>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">لا توجد مصروفات مسجلة بعد</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-100">
              <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={18} /></button>
              
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Plus size={20}/></div>
                تسجيل حركة مالية
              </h2>

              <div className="space-y-4">
                {/* Toggle Type */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setForm({...form, type: "income"})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.type === "income" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500"}`}>إيراد (+)</button>
                  <button onClick={() => setForm({...form, type: "expense"})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.type === "expense" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}>مصروف (-)</button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">البيان / الوصف</label>
                  <input type="text" placeholder="مثال: رواتب فريق العمل..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">المبلغ (ر.س)</label>
                    <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-200 outline-none transition-all" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">التصنيف</label>
                    <select disabled={form.type === "income"} value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:opacity-50 disabled:bg-slate-50">
                      {form.type === "income" ? (
                        <option value="إيراد">إيراد مالي</option>
                      ) : (
                        <>
                          <option value="رواتب وأجور">رواتب وأجور</option>
                          <option value="برامج وفعاليات">برامج وفعاليات</option>
                          <option value="مصاريف تشغيلية">مصاريف تشغيلية</option>
                          <option value="مشتريات">مشتريات</option>
                          <option value="أخرى">أخرى</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Invoice Upload Simulation */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">المرفقات (صورة فتورة / إيصال بنكي)</label>
                  <label className="flex items-center justify-center w-full h-16 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-primary-400 focus:outline-none">
                     <div className="flex gap-2 items-center text-slate-500">
                       <Download size={18} className="text-slate-400" />
                       <span className="font-semibold text-sm">{form.fileName || "أرفق الفاتورة هنا (اختياري)"}</span>
                     </div>
                     <input type="file" name="invoice_upload" className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if(file) setForm({...form, fileName: file.name});
                        }} 
                     />
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <button onClick={handleAddTransaction} className="btn-primary w-full py-4 justify-center text-sm shadow-lg shadow-primary-500/20"><Save size={18} className="ml-2"/> اعتماد وتأكيد الحسابة</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
