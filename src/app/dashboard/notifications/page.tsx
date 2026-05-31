"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Megaphone, Users, FileText, CheckCircle, Trash2, Check } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const initialNotifications = [
  { id: 1, title: "تم نشر إعلان جديد", body: "تم نشر إعلان برنامج القيادة الشبابية ٢٠٢٥", icon: Megaphone, color: "text-blue-500 bg-blue-50", time: "منذ ٢ ساعة", read: false },
  { id: 2, title: "طلب موافقة", body: "مستخدم جديد يحتاج إلى موافقة للانضمام", icon: Users, color: "text-indigo-500 bg-indigo-50", time: "منذ ٥ ساعات", read: false },
  { id: 3, title: "وثيقة محدّثة", body: "تم تحديث النظام الأساسي للجمعية", icon: FileText, color: "text-purple-500 bg-purple-50", time: "أمس", read: true },
  { id: 4, title: "اكتمل التقرير", body: "تقرير الربع الأول للعام ١٤٤٦ جاهز للمراجعة", icon: CheckCircle, color: "text-primary-500 bg-primary-50", time: "منذ ٣ أيام", read: true },
  { id: 5, title: "تحديث الميزانية", body: "تمت مراجعة الميزانية الشهرية وتحديثها", icon: FileText, color: "text-orange-500 bg-orange-50", time: "منذ ٥ أيام", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary-700 flex items-center gap-3">
            الإشعارات
            {unreadCount > 0 && (
              <span className="text-sm bg-red-500 text-white px-2.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : "كل الإشعارات مقروءة"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-outline flex items-center gap-2 text-sm"
          >
            <Check size={16} />
            تعليم الكل كمقروء
          </button>
        )}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="bg-white rounded-2xl shadow-sm border border-primary-50 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <Bell size={48} className="mx-auto mb-4 text-primary-200" />
            <p className="text-gray-400 font-medium">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
                className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors ${!n.read ? "bg-primary-50/30" : ""}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                  <n.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`font-semibold text-sm ${!n.read ? "text-gray-900" : "text-gray-600"}`}>{n.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{n.body}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="w-8 h-8 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors"
                      title="تعليم كمقروء"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(n.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
