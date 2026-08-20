const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// HTML escape utility to prevent injection in email templates
const escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('📧 Mailer: Gmail SMTP transporter configured successfully for:', EMAIL_USER);
  } catch (err) {
    console.error('❌ Mailer configuration error:', err.message);
  }
} else {
  console.log('⚠️ Mailer: EMAIL_USER or EMAIL_PASS not set. Emails will be simulated and logged locally.');
}

const sendMailMock = (options) => {
  const logDir = path.join(__dirname, '..');
  const logPath = path.join(logDir, 'mock_emails.txt');
  const divider = '\n' + '='.repeat(60) + '\n';
  const mailContent = `
Time: ${new Date().toISOString()}
To: ${options.to}
Subject: ${options.subject}
Body:
${options.text || options.html}
`;
  
  try {
    fs.appendFileSync(logPath, divider + mailContent + divider, 'utf8');
    console.log(`📝 Mailer [MOCK]: Email successfully simulated and written to: ${logPath}`);
    return true;
  } catch (err) {
    console.error('❌ Mailer [MOCK] error:', err.message);
    return false;
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) {
    console.error('❌ Mailer: Target recipient (to) is missing.');
    return false;
  }

  const mailOptions = {
    from: EMAIL_USER ? `"DOPAMINE Services" <${EMAIL_USER}>` : '"DOPAMINE Services" <no-reply@dopamine-service.com>',
    to,
    subject,
    text,
    html,
    headers: {
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      'X-Mailer': 'DOPAMINE-Mailer'
    }
  };

  // 1. Try Gmail SMTP first if configured
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Mailer [Gmail]: Email sent successfully! MessageId:', info.messageId);
      return true;
    } catch (err) {
      console.error('⚠️ Mailer [Gmail] SMTP send failed:', err.message);
    }
  }

  // 2. Try Resend HTTP API as fallback if configured with a real API key
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.startsWith('re_') && resendKey.length > 20) {
    try {
      const fromEmail = process.env.RESEND_FROM || 'onboarding@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `DOPAMINE Services <${fromEmail}>`,
          to: [to],
          subject,
          text,
          html
        })
      });

      const resData = await response.json();
      if (response.ok) {
        console.log('📧 Mailer [Resend]: Email sent successfully! Id:', resData.id);
        return true;
      } else {
        console.error('❌ Mailer [Resend] API Error:', resData);
      }
    } catch (err) {
      console.error('❌ Mailer [Resend] HTTP Error:', err.message);
    }
  }

  // 3. Fallback to mock log
  console.log('⚠️ Mailer: Falling back to local simulated mock delivery.');
  return sendMailMock(mailOptions);
};

const sendApprovalEmail = async (userEmail, username) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-service.com';
  const safeUsername = escapeHTML(username);
  const subject = 'تفعيل حسابك في خدمات DOPAMINE';
  const text = `مرحباً ${username}،\n\nيسعدنا إبلاغك بأنه قد تمت مراجعة طلبك والموافقة على تفعيل حسابك بنجاح.\nيمكنك الآن تسجيل الدخول واستخدم كافة الخدمات من خلال لوحة التحكم الخاصة بك.\n\nرابط تسجيل الدخول: ${appUrl}\n\nمع تحيات إدارة DOPAMINE.`;
  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 20px auto; background-color: #ffffff; color: #1a202c; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #10b981; margin: 0; font-size: 22px; font-weight: 700;">تهانينا، تم تفعيل حسابك!</h2>
        <p style="color: #718096; font-size: 14px; margin-top: 6px;">مرحباً ${safeUsername}، تم تفعيل لوحة تحكم Dopamine بنجاح.</p>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">يسعدنا إبلاغك بأنه قد تمت مراجعة طلبك و<strong>الموافقة على تفعيل حسابك بنجاح</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">يمكنك الآن تسجيل الدخول للبدء في إدارة مشروعك الخاص واستخدام كافة الخدمات المتوفرة.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}" style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">تسجيل الدخول للنظام</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;">
      <p style="font-size: 12px; color: #a0aec0; text-align: center; margin: 0;">هذا البريد تم إرساله تلقائياً من نظام إدارات DOPAMINE-SERVICE.</p>
    </div>
  `;
  return await sendEmail({ to: userEmail, subject, text, html });
};

const sendRejectionEmail = async (userEmail, username, reason) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-service.com';
  const safeUsername = escapeHTML(username);
  const safeReason = escapeHTML(reason);
  const subject = 'بخصوص طلب انضمامك لخدمات DOPAMINE';
  const text = `مرحباً ${username}،\n\nنأسف لإبلاغك بأنه بعد مراجعة طلبك، تعذر علينا الموافقة على تفعيل حسابك في الوقت الحالي.\n\nسبب الرفض:\n${reason || 'لم يتم تحديد سبب محدد من قبل الإدارة.'}\n\nإذا كان لديك أي استفسار، يرجى التواصل مع الدعم الفني لمشروعك.\n\nمع تحيات إدارة DOPAMINE.`;
  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 20px auto; background-color: #ffffff; color: #1a202c; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #ef4444; margin: 0; font-size: 22px; font-weight: 700;">بخصوص طلب تفعيل حسابك</h2>
        <p style="color: #718096; font-size: 14px; margin-top: 6px;">مرحباً ${safeUsername}، نفيدك علماً بحالة طلبك.</p>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">نشكرك على رغبتك في استخدام خدماتنا.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">بعد مراجعة طلب التسجيل الخاص بك، نأسف لإبلاغك بـ<strong>عدم الموافقة على تفعيل الحساب في الوقت الحالي</strong>.</p>
      <div style="background-color: #fef2f2; border-right: 4px solid #ef4444; padding: 18px; margin: 24px 0; border-radius: 8px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 6px; font-size: 14px;">سبب الرفض الموضح من الإدارة:</strong>
        <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">${safeReason || 'لم يتم توفير سبب محدد من قبل الإدارة.'}</p>
      </div>
      <p style="font-size: 14px; color: #718096; line-height: 1.5;">إذا كنت ترى أن هناك سوء فهم أو ترغب في تعديل البيانات، يرجى التواصل مع الدعم الفني.</p>
      <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;">
      <p style="font-size: 12px; color: #a0aec0; text-align: center; margin: 0;">هذا البريد تم إرساله تلقائياً من نظام إدارات DOPAMINE-SERVICE.</p>
    </div>
  `;
  return await sendEmail({ to: userEmail, subject, text, html });
};

const sendOtpEmail = async (userEmail, username, otpCode) => {
  const safeUsername = escapeHTML(username);
  const safeOtp = escapeHTML(otpCode);
  const subject = `رمز التحقق الخاص بك: ${safeOtp} - DOPAMINE`;
  const text = `مرحباً ${username}،\n\nرمز التحقق لتأكيد بريدك الإلكتروني وإنشاء الحساب في DOPAMINE هو:\n\n${otpCode}\n\nهذا الرمز صالح لمدة 10 دقائق فقط.\nبرجاء عدم مشاركة هذا الرمز مع أي شخص للحفاظ على أمان حسابك.\n\nمع تحيات إدارة DOPAMINE.`;
  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px 24px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; max-width: 540px; margin: 20px auto; background: #0f131a; color: #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 12px;">
          <span style="font-size: 28px;">🔥</span>
        </div>
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">DOPAMINE-SERVICE</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">تأكيد البريد الإلكتروني وإنشاء الحساب</p>
      </div>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
        <p style="font-size: 14px; color: #cbd5e1; margin-top: 0; margin-bottom: 16px;">
          مرحباً <strong>${safeUsername}</strong>، استخدم رمز التحقق التالي لإتمام تسجيل حسابك:
        </p>
        <div style="background: #18202c; border: 1px dashed #10b981; border-radius: 10px; padding: 14px 24px; display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: 800; color: #10b981; font-family: monospace;">
          ${safeOtp}
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 14px; margin-bottom: 0;">
          ⏳ الرمز صالح لمدة <strong>10 دقائق</strong> فقط.
        </p>
      </div>

      <div style="background: rgba(239, 68, 68, 0.08); border-right: 3px solid #ef4444; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 12px; color: #fca5a5; line-height: 1.5;">
          ⚠️ <strong>تنبيه أمني:</strong> لا تشارك هذا الرمز مع أي شخص. لن تطلب منك إدارة DOPAMINE هذا الرمز أبداً.
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;">
      <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
        إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.<br>
        DOPAMINE-SERVICE &copy; 2026
      </p>
    </div>
  `;
  return await sendEmail({ to: userEmail, subject, text, html });
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendOtpEmail
};

