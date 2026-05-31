import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock Email Service
 * In production, replace this with Nodemailer, Resend, or SendGrid.
 */
async function sendMockEmail(data: {
  to: string;
  subject: string;
  templateName: string;
  variables: Record<string, string>;
}) {
  console.log('--- 📧 MOCK EMAIL SENT ---');
  console.log(`To: ${data.to}`);
  console.log(`Subject: ${data.subject}`);
  console.log('Content:');
  
  let content = "";
  if (data.templateName === 'new_task') {
    content = `
السلام عليكم،
تم إسناد مهمة جديدة إليك.
عنوان المهمة: ${data.variables.title}
تاريخ التسليم: ${data.variables.dueDate}

يرجى الدخول إلى النظام للاطلاع على التفاصيل وتنفيذ المهمة في الوقت المحدد.
رابط المهمة: ${data.variables.link}

مع خالص التحية.
    `;
  } else if (data.templateName === 'update_task') {
    content = `
السلام عليكم،
تم تحديث المهمة المسندة إليك: ${data.variables.title}
تاريخ التسليم الجديد: ${data.variables.dueDate}

يرجى الدخول للمراجعة.
    `;
  }
  
  console.log(content);
  console.log('---------------------------');
  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, task, recipientEmail } = body;

    if (!recipientEmail || !task) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Determine Subject
    const subject = type === 'new' ? 'إشعار بمهمة جديدة' : 'تحديث في مهمة مسندة';
    const templateName = type === 'new' ? 'new_task' : 'update_task';

    // Send the "Email"
    await sendMockEmail({
      to: recipientEmail,
      subject,
      templateName,
      variables: {
        title: task.title,
        dueDate: new Date(task.dueDate).toLocaleDateString('ar-SA'),
        link: `${req.nextUrl.origin}/dashboard/tasks`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
