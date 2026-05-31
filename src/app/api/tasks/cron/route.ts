import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock Email Service
 */
async function sendMockEmail(to: string, subject: string, content: string) {
  console.log(`--- 📧 CRON EMAIL SENT to ${to} ---`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${content}`);
  console.log('---------------------------');
  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const { tasks, users } = await req.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Tasks list required' }, { status: 400 });
    }

    const now = new Date();
    const notificationsSent = [];

    for (const task of tasks) {
      if (task.status === 'completed') continue;

      const dueDate = new Date(task.dueDate);
      const diffMs = dueDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const user = users.find((u: any) => u.uid === task.assignedTo);
      if (!user?.email) continue;

      let type = "";
      let subject = "";
      let message = "";

      // Logic for 48h, 24h and Overdue
      if (diffHours <= 0) {
        type = "overdue";
        subject = "⚠️ تنبيه: تأخرت المهمة عن موعدها";
        message = `السلام عليكم، المهمة "${task.title}" قد تجاوزت موعد التسليم النهائي (${new Date(task.dueDate).toLocaleDateString('ar-SA')}). يرجى التحديث فوراً.`;
      } else if (diffHours <= 24 && diffHours > 20) {
        // Simple window check to avoid double-sending if run hourly
        type = "24h";
        subject = "⏳ تذكير: 24 ساعة متبقية على المهمة";
        message = `السلام عليكم، متبقي 24 ساعة فقط لتسليم المهمة: ${task.title}.`;
      } else if (diffHours <= 48 && diffHours > 44) {
        type = "48h";
        subject = "🔔 تذكير: 48 ساعة متبقية على المهمة";
        message = `السلام عليكم، متبقي 48 ساعة لتسليم المهمة: ${task.title}. موعد التسليم: ${new Date(task.dueDate).toLocaleDateString('ar-SA')}.`;
      }

      if (type) {
        await sendMockEmail(user.email, subject, message);
        notificationsSent.push({ taskId: task.id, type, email: user.email });
      }
    }

    return NextResponse.json({ success: true, notificationsSent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
