"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UserProfile, UserRole } from "./auth-context";
import { hasPermission } from "./roles";
import { auditLog } from "./audit-log";
import { useCms } from "./cms-context";
import { useAuth } from "./auth-context";

export type TaskStatus   = "created" | "in_progress" | "review" | "completed" | "late";
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export interface TaskUpdateEntry {
  id: string;
  timestamp: string;        // ISO
  actorUid: string;
  actorName: string;
  field: string;            // what changed
  oldValue?: string;
  newValue: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;       // uid
  assignedToName: string;
  assignedBy: string;       // uid
  assignedByName: string;
  assignedByRole: UserRole;
  createdAt: string;        // ISO
  dueDate: string;          // ISO
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;         // 0–100
  notes?: string;
  attachments: string[];
  tags: string[];
  updateLog: TaskUpdateEntry[];
}

// ── Static labels / colours ───────────────────────────────────────────────────
export const STATUS_LABELS: Record<TaskStatus, string> = {
  created:     "تم الإنشاء",
  in_progress: "قيد التنفيذ",
  review:      "قيد المراجعة",
  completed:   "مكتملة",
  late:        "متأخرة",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  created:     "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  review:      "bg-amber-100 text-amber-700",
  completed:   "bg-sky-100 text-sky-700",
  late:        "bg-red-100 text-red-700",
};

export const STATUS_DOT: Record<TaskStatus, string> = {
  created:     "bg-slate-400",
  in_progress: "bg-blue-500",
  review:      "bg-amber-500",
  completed:   "bg-sky-500",
  late:        "bg-red-500",
};

export const STATUS_PROGRESS: Record<TaskStatus, string> = {
  created:     "#94A3B8",
  in_progress: "#3B82F6",
  review:      "#F59E0B",
  completed:   "#10B981",
  late:        "#EF4444",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "عاجلة",
  high:   "عالية",
  medium: "متوسطة",
  low:    "منخفضة",
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "bg-red-100 text-red-700 border border-red-200",
  high:   "bg-orange-100 text-orange-700 border border-orange-200",
  medium: "bg-amber-100 text-amber-700 border border-amber-200",
  low:    "bg-slate-100 text-slate-600 border border-slate-200",
};

// ── Seed tasks — UIDs match INITIAL_USERS in auth-context ─────────────────────
const now = new Date();
const d = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();

const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "إعداد تقرير الربع الثاني",
    description: "تجميع وتحليل البيانات المالية للربع الثاني وإعداد التقرير الشامل.",
    assignedTo: "u3", assignedToName: "خالد الزهراني",
    assignedBy: "u1", assignedByName: "محمد العمري", assignedByRole: "executive_director",
    createdAt: d(-5), dueDate: d(3),
    priority: "high", status: "in_progress", progress: 60,
    notes: "يجب مراجعة أرقام الربع الأول أولاً.",
    attachments: [], tags: ["مالية", "ربعي"],
    updateLog: [
      {
        id: "ul1", timestamp: d(-5), actorUid: "u1", actorName: "محمد العمري",
        field: "الحالة", newValue: "تم الإنشاء",
      },
      {
        id: "ul2", timestamp: d(-3), actorUid: "u3", actorName: "خالد الزهراني",
        field: "الحالة", oldValue: "تم الإنشاء", newValue: "قيد التنفيذ",
      },
    ],
  },
  {
    id: "t2",
    title: "تحديث سياسة الخصوصية",
    description: "مراجعة وتحديث سياسة الخصوصية وفق اللوائح الجديدة.",
    assignedTo: "u4", assignedToName: "نورة القحطاني",
    assignedBy: "u1", assignedByName: "محمد العمري", assignedByRole: "executive_director",
    createdAt: d(-2), dueDate: d(7),
    priority: "medium", status: "created", progress: 0,
    notes: "",
    attachments: [], tags: ["قانوني", "وثائق"],
    updateLog: [
      {
        id: "ul3", timestamp: d(-2), actorUid: "u1", actorName: "محمد العمري",
        field: "الحالة", newValue: "تم الإنشاء",
      },
    ],
  },
  {
    id: "t3",
    title: "نشر إعلان برنامج القيادة",
    description: "نشر إعلان الدورة الجديدة على المنصات الرقمية وموقع الجمعية.",
    assignedTo: "u5", assignedToName: "فيصل الدوسري",
    assignedBy: "u1", assignedByName: "محمد العمري", assignedByRole: "executive_director",
    createdAt: d(-8), dueDate: d(-1),
    priority: "urgent", status: "late", progress: 30,
    notes: "تأخر بسبب انتظار الموافقة.",
    attachments: [], tags: ["إعلام", "برامج"],
    updateLog: [
      {
        id: "ul4", timestamp: d(-8), actorUid: "u1", actorName: "محمد العمري",
        field: "الحالة", newValue: "تم الإنشاء",
      },
      {
        id: "ul5", timestamp: d(-5), actorUid: "u5", actorName: "فيصل الدوسري",
        field: "التقدم", oldValue: "0%", newValue: "30%",
      },
    ],
  },
  {
    id: "t4",
    title: "اجتماع مراجعة الميزانية السنوية",
    description: "تحضير عرض تفصيلي للميزانية السنوية لعرضه في اجتماع مجلس الإدارة.",
    assignedTo: "u3", assignedToName: "خالد الزهراني",
    assignedBy: "u1", assignedByName: "محمد العمري", assignedByRole: "executive_director",
    createdAt: d(-3), dueDate: d(10),
    priority: "high", status: "review", progress: 85,
    notes: "بانتظار مراجعة المدير التنفيذي.",
    attachments: [], tags: ["مالية", "مجلس"],
    updateLog: [
      {
        id: "ul6", timestamp: d(-3), actorUid: "u1", actorName: "محمد العمري",
        field: "الحالة", newValue: "تم الإنشاء",
      },
      {
        id: "ul7", timestamp: d(-1), actorUid: "u3", actorName: "خالد الزهراني",
        field: "الحالة", oldValue: "قيد التنفيذ", newValue: "قيد المراجعة",
      },
    ],
  },
  {
    id: "t5",
    title: "تحديث النظام الأساسي للجمعية",
    description: "مراجعة شاملة للنظام الأساسي وإدخال التعديلات المقترحة من مجلس الإدارة.",
    assignedTo: "u4", assignedToName: "نورة القحطاني",
    assignedBy: "u1", assignedByName: "محمد العمري", assignedByRole: "executive_director",
    createdAt: d(-1), dueDate: d(14),
    priority: "medium", status: "in_progress", progress: 20,
    notes: "",
    attachments: [], tags: ["قانوني", "حوكمة"],
    updateLog: [
      {
        id: "ul8", timestamp: d(-1), actorUid: "u1", actorName: "محمد العمري",
        field: "الحالة", newValue: "تم الإنشاء",
      },
    ],
  },
  {
    id: "t6",
    title: "إطلاق حملة التواصل الاجتماعي",
    description: "تصميم وجدولة محتوى حملة رمضان على جميع المنصات.",
    assignedTo: "u5", assignedToName: "فيصل الدوسري",
    assignedBy: "u2", assignedByName: "سارة الأحمدي", assignedByRole: "hr_manager",
    createdAt: d(-2), dueDate: d(5),
    priority: "high", status: "in_progress", progress: 45,
    notes: "",
    attachments: [], tags: ["إعلام", "حملة"],
    updateLog: [
      {
        id: "ul9", timestamp: d(-2), actorUid: "u2", actorName: "سارة الأحمدي",
        field: "الحالة", newValue: "تم الإنشاء",
      },
    ],
  },
];

// ── Data isolation helper ─────────────────────────────────────────────────────
/**
 * Returns only tasks the given user is allowed to see:
 * - executive_director & hr_manager → all tasks
 * - everyone else → tasks assigned to them OR assigned by them
 */
export function filterTasksForUser(tasks: Task[], profile: UserProfile): Task[] {
  if (hasPermission(profile, "canViewAllTasks")) return tasks;
  return tasks.filter(
    t => t.assignedTo === profile.uid || t.assignedBy === profile.uid
  );
}

function makeLogEntry(
  actor: UserProfile,
  field: string,
  newValue: string,
  oldValue?: string
): TaskUpdateEntry {
  return {
    id: `ul-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    actorUid: actor.uid,
    actorName: actor.name,
    field,
    oldValue,
    newValue,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────
interface TasksContextType {
  tasks: Task[];
  /** Filtered tasks based on caller's profile — use this in UI */
  getVisibleTasks: (profile: UserProfile) => Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updateLog">, actor: UserProfile) => void;
  updateTask: (id: string, updates: Partial<Task>, actor: UserProfile) => void;
  deleteTask: (id: string, actor: UserProfile) => void;
  updateProgress: (id: string, progress: number, actor: UserProfile) => void;
  updateStatus: (id: string, status: TaskStatus, actor: UserProfile) => void;
}

const TasksContext = createContext<TasksContextType>({} as TasksContextType);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { allUsers } = useAuth();
  const { settings } = useCms();
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);

  const getVisibleTasks = useCallback((profile: UserProfile) => {
    return filterTasksForUser(tasks, profile);
  }, [tasks]);


  const triggerNotification = useCallback(async (type: "new" | "update", task: Task) => {
    if (!settings.enableTaskNotifications) return;
    
    const userProfile = allUsers.find(u => u.uid === task.assignedTo);
    if (!userProfile?.email) return;

    try {
      await fetch("/api/tasks/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          task,
          recipientEmail: userProfile.email
        }),
      });
    } catch (err) {
      console.error("Notification trigger failed:", err);
    }
  }, [allUsers, settings.enableTaskNotifications]);

  const addTask = useCallback((
    task: Omit<Task, "id" | "createdAt" | "updateLog">,
    actor: UserProfile
  ) => {
    const newTask: Task = {
      ...task,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updateLog: [makeLogEntry(actor, "الحالة", "تم الإنشاء")],
    };
    setTasks(prev => [newTask, ...prev]);

    // Trigger Email
    triggerNotification("new", newTask);

    auditLog.add({
      actorUid: actor.uid, actorName: actor.name, actorRole: actor.role,
      action: "task_created",
      targetId: newTask.id, targetName: newTask.title,
      details: `مُسندة إلى: ${newTask.assignedToName}`,
    });
  }, []);

  const updateTask = useCallback((
    id: string,
    updates: Partial<Task>,
    actor: UserProfile
  ) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const logEntry = makeLogEntry(actor, "تعديل", "تم التعديل");
      const updatedTask = { ...t, ...updates, updateLog: [...t.updateLog, logEntry] };
      
      // Trigger Email for updates
      triggerNotification("update", updatedTask);
      
      return updatedTask;
    }));

    auditLog.add({
      actorUid: actor.uid, actorName: actor.name, actorRole: actor.role,
      action: "task_updated", targetId: id,
    });
  }, []);

  const deleteTask = useCallback((id: string, actor: UserProfile) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));

    auditLog.add({
      actorUid: actor.uid, actorName: actor.name, actorRole: actor.role,
      action: "task_deleted", targetId: id, targetName: task?.title,
    });
  }, [tasks]);

  const updateProgress = useCallback((
    id: string,
    progress: number,
    actor: UserProfile
  ) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      let status: TaskStatus = t.status;
      if (progress === 100) status = "completed";
      else if (progress > 0 && t.status === "created") status = "in_progress";
      const logEntry = makeLogEntry(actor, "التقدم", `${progress}%`, `${t.progress}%`);
      return { ...t, progress, status, updateLog: [...t.updateLog, logEntry] };
    }));

    auditLog.add({
      actorUid: actor.uid, actorName: actor.name, actorRole: actor.role,
      action: "task_progress_updated", targetId: id,
      details: `التقدم: ${progress}%`,
    });
  }, []);

  const updateStatus = useCallback((
    id: string,
    status: TaskStatus,
    actor: UserProfile
  ) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      let progress = t.progress;
      if (status === "completed") progress = 100;
      if (status === "created")   progress = 0;
      const logEntry = makeLogEntry(
        actor, "الحالة", STATUS_LABELS[status], STATUS_LABELS[t.status]
      );
      return { ...t, status, progress, updateLog: [...t.updateLog, logEntry] };
    }));

    auditLog.add({
      actorUid: actor.uid, actorName: actor.name, actorRole: actor.role,
      action: "task_status_changed", targetId: id,
      details: `الحالة الجديدة: ${STATUS_LABELS[status]}`,
    });
  }, []);

  return (
    <TasksContext.Provider value={{
      tasks,
      getVisibleTasks,
      addTask,
      updateTask,
      deleteTask,
      updateProgress,
      updateStatus,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
