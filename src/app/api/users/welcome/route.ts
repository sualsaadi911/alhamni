import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function buildWelcomeEmail(name: string, email: string, password: string, role: string, siteUrl: string) {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>مرحباً بك في ألهمني</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d6a9f 100%);padding:40px 48px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:800;letter-spacing:-0.5px;">ألهمني</h1>
              <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:14px;">منصة إدارة مبادرة ألهمني</p>
            </td>
          </tr>

          <!-- Welcome Banner -->
          <tr>
            <td style="background:#eef4fb;padding:28px 48px;text-align:center;border-bottom:1px solid #dce8f5;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#1e3a5f;">🎉 أهلاً وسهلاً، ${name}!</p>
              <p style="margin:10px 0 0;font-size:15px;color:#5a7a9a;line-height:1.7;">
                تم إنشاء حسابك في منصة ألهمني. يمكنك الآن تسجيل الدخول والبدء.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafd;border:1.5px solid #d0e1f5;border-radius:14px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#1e3a5f;border-bottom:1px solid #d0e1f5;padding-bottom:12px;">
                      🔐 بيانات تسجيل الدخول
                    </p>
                    <table width="100%">
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:13px;color:#7a95b0;">القسم / الدور</span><br/>
                          <span style="font-size:15px;font-weight:600;color:#1e3a5f;">${role}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px dashed #d0e1f5;">
                          <span style="font-size:13px;color:#7a95b0;">البريد الإلكتروني</span><br/>
                          <span style="font-size:15px;font-weight:600;color:#1e3a5f;direction:ltr;display:block;">${email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px dashed #d0e1f5;">
                          <span style="font-size:13px;color:#7a95b0;">كلمة المرور المؤقتة</span><br/>
                          <span style="font-size:18px;font-weight:800;color:#2d6a9f;letter-spacing:2px;direction:ltr;display:block;background:#e8f0fb;padding:8px 12px;border-radius:8px;margin-top:4px;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e6;border:1.5px solid #ffd878;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#8a6200;line-height:1.7;">
                      ⚠️ <strong>ملاحظة:</strong> هذه كلمة مرور مؤقتة. يُنصح بتغييرها فور تسجيل دخولك الأول من خلال إعدادات الحساب.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/login"
                      style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#2d6a9f);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 48px;border-radius:50px;letter-spacing:0.3px;">
                      تسجيل الدخول الآن ←
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f7fb;padding:24px 48px;text-align:center;border-top:1px solid #dce8f5;">
              <p style="margin:0;font-size:12px;color:#9ab0c5;line-height:1.8;">
                هذا البريد أُرسل تلقائياً من منصة ألهمني · جمعية ألهمني<br/>
                إذا لم تطلب هذا الحساب، تجاهل هذا البريد أو تواصل معنا.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP not configured — skipping welcome email");
      return NextResponse.json({ skipped: true });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${req.headers.get("host")}`;

    await transporter.sendMail({
      from: `"منصة ألهمني" <${smtpUser}>`,
      to: email,
      subject: `🎉 مرحباً بك في ألهمني يا ${name}`,
      html: buildWelcomeEmail(name, email, password, role, siteUrl),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Welcome email error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
