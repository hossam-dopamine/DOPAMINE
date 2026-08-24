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

const dns = require('dns');
if (dns.setDefaultResultOrder) {
  try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}
}

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;
let transporter587 = null;

if (EMAIL_USER && EMAIL_PASS) {
  try {
    // Primary: Port 465 SSL with forced IPv4
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4, // Force IPv4 to eliminate Linux container ENETUNREACH IPv6 errors
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Secondary Fallback: Port 587 STARTTLS with forced IPv4
    transporter587 = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Mailer: Gmail IPv4 transporters (ports 465 & 587) configured for:', EMAIL_USER);
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

  const senderEmail = EMAIL_USER || 'adorehk2@gmail.com';
  const senderName = 'DOPAMINE Services';

  // 1. Try Brevo HTTPS API (Port 443 - 100% Free: 300 emails/day, completely unblocked on Render)
  const brevoKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : '';
  if (brevoKey.startsWith('xsmtpsib-')) {
    console.warn('⚠️ Mailer [Brevo]: المفتاح المدخل هو مفتاح SMTP (xsmtpsib-) وليس مفتاح API (xkeysib-). يرجى إنشاء مفتاح من تبويب "API Keys" في Brevo.');
  }
  if (brevoKey && brevoKey.length > 10) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html || `<pre>${text}</pre>`,
          textContent: text
        })
      });

      const resData = await response.json();
      if (response.ok) {
        console.log('📧 Mailer [Brevo HTTPS]: Email sent successfully! MessageId:', resData.messageId);
        return true;
      } else {
        console.warn('⚠️ Mailer [Brevo HTTPS] API Error:', resData);
      }
    } catch (err) {
      console.warn('⚠️ Mailer [Brevo HTTPS] HTTP Error:', err.message);
    }
  }

  // 2. Try Resend HTTPS API (Port 443 - 100% Free: 3,000 emails/month, completely unblocked on Render)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.startsWith('re_') && resendKey.length > 20) {
    try {
      const fromEmail = process.env.RESEND_FROM || 'onboarding@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${senderName} <${fromEmail}>`,
          to: [to],
          subject,
          text,
          html
        })
      });

      const resData = await response.json();
      if (response.ok) {
        console.log('📧 Mailer [Resend HTTPS]: Email sent successfully! Id:', resData.id);
        return true;
      } else {
        console.warn('⚠️ Mailer [Resend HTTPS] API Error:', resData);
      }
    } catch (err) {
      console.warn('⚠️ Mailer [Resend HTTPS] HTTP Error:', err.message);
    }
  }

  const mailOptions = {
    from: EMAIL_USER ? `"${senderName}" <${EMAIL_USER}>` : `"${senderName}" <no-reply@dopamine-service.com>`,
    to,
    subject,
    text,
    html,
    headers: {
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      'X-Mailer': 'DOPAMINE-Mailer'
    }
  };

  // 3. Try Gmail SMTP Port 465 (IPv4)
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Mailer [Gmail:465]: Email sent successfully! MessageId:', info.messageId);
      return true;
    } catch (err) {
      console.warn('⚠️ Mailer [Gmail:465] attempt failed:', err.message);
    }
  }

  // 4. Try Gmail SMTP Port 587 (IPv4)
  if (transporter587) {
    try {
      const info587 = await transporter587.sendMail(mailOptions);
      console.log('📧 Mailer [Gmail:587]: Email sent successfully! MessageId:', info587.messageId);
      return true;
    } catch (err) {
      console.warn('⚠️ Mailer [Gmail:587] attempt failed:', err.message);
    }
  }

  // 5. Fallback to mock log
  console.log('⚠️ Mailer: Falling back to local simulated mock delivery.');
  return sendMailMock(mailOptions);
};

const sendApprovalEmail = async (userEmail, username) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-c06w.onrender.com';
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
  const appUrl = process.env.APP_URL || 'https://dopamine-c06w.onrender.com';
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

const sendSuspensionEmail = async (userEmail, username, reason) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-c06w.onrender.com';
  const safeUsername = escapeHTML(username);
  const safeReason = escapeHTML(reason);
  const subject = '⚠️ إشعار هام: تم تعليق وحظر حسابك - DOPAMINE';
  const text = `مرحباً ${username}،\n\nنود إبلاغك بأنه قد تم تعليق وحظر حسابك في منصة DOPAMINE من قبل الإدارة.\n\nسبب الحظر:\n${reason || 'مخالفة شروط الاستخدام أو قرارات الإدارة.'}\n\nتم إيقاف صلاحيات الوصول إلى لوحة التحكم الخاصة بك مؤقتاً.\nإذا كنت ترى أن هذا الإجراء تم بالخطأ، يرجى التواصل مع إدارة المنصة.\n\nمع تحيات إدارة DOPAMINE.`;
  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px 24px; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 16px; max-width: 560px; margin: 20px auto; background: #0f131a; color: #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 12px; background: rgba(239, 68, 68, 0.12); border-radius: 14px; border: 1px solid rgba(239, 68, 68, 0.3); margin-bottom: 12px;">
          <span style="font-size: 32px;">⛔</span>
        </div>
        <h2 style="color: #ef4444; margin: 0; font-size: 22px; font-weight: 800;">تم تعليق وحظر الحساب</h2>
        <p style="color: #94a3b8; font-size: 13.5px; margin-top: 6px;">مرحباً ${safeUsername}، نفيدك بتفاصيل قرار الإدارة بخصوص حسابك.</p>
      </div>

      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <p style="font-size: 14.5px; color: #cbd5e1; line-height: 1.6; margin-top: 0; margin-bottom: 12px;">
          نحيطكم علماً بأنه قد تم <strong>حظر وتعليق صلاحيات الوصول</strong> إلى حسابك ولوحة التحكم في منصة DOPAMINE.
        </p>
        <div style="background: rgba(239, 68, 68, 0.08); border-right: 4px solid #ef4444; padding: 14px 16px; border-radius: 8px;">
          <strong style="color: #fca5a5; display: block; margin-bottom: 6px; font-size: 13.5px;">سبب الحظر الموضح من الإدارة:</strong>
          <p style="margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.55;">${safeReason || 'مخالفة معايير وشروط الاستخدام.'}</p>
        </div>
      </div>

      <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; text-align: center;">
        إذا كنت تعتقد أن هذا الإجراء تم عن طريق الخطأ أو ترغب في الاستفسار، يمكنك التواصل مباشرة مع إدارة الدعم الفني.
      </p>

      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;">
      <p style="font-size: 11.5px; color: #64748b; text-align: center; margin: 0;">
        هذا إشعار إداري رسمي من نظام إدارة DOPAMINE-SERVICE &copy; 2026
      </p>
    </div>
  `;
  return await sendEmail({ to: userEmail, subject, text, html });
};

const sendReactivationEmail = async (userEmail, username) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-c06w.onrender.com';
  const safeUsername = escapeHTML(username);
  const subject = '✅ تم إلغاء الحظر وإعادة تنشيط حسابك - DOPAMINE';
  const text = `مرحباً ${username}،\n\nيسعدنا إبلاغك بأنه قد تم فك الحظر وإعادة تنشيط حسابك في منصة DOPAMINE بنجاح.\nيمكنك الآن معاودة تسجيل الدخول واستئناف كافة الأنشطة والمهام من خلال لوحة التحكم الخاصة بك.\n\nرابط تسجيل الدخول: ${appUrl}\n\nنتمنى لك عملاً موفقاً،\nمع تحيات إدارة DOPAMINE.`;
  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px 24px; border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 16px; max-width: 560px; margin: 20px auto; background: #0f131a; color: #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 12px; background: rgba(16, 185, 129, 0.12); border-radius: 14px; border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 12px;">
          <span style="font-size: 32px;">🔓</span>
        </div>
        <h2 style="color: #10b981; margin: 0; font-size: 22px; font-weight: 800;">تم إعادة تنشيط الحساب بنجاح</h2>
        <p style="color: #94a3b8; font-size: 13.5px; margin-top: 6px;">مرحباً ${safeUsername}، تم فك الحظر عن لوحة التحكم الخاصة بك.</p>
      </div>

      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.65; margin: 0 0 16px 0;">
          يسرنا إبلاغك بأنه قد تم <strong>إلغاء الحظر وتصفير حالة الإيقاف</strong>، وأصبح حسابك نشطاً بالكامل وجاهزاً للاستخدام.
        </p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0;">
          يمكنك الآن الدخول إلى لوحة التحكم الخاصة بك ومواصلة إدارة مهامك وبياناتك بكل سهولة.
        </p>
        <div style="text-align: center; margin: 20px 0 10px 0;">
          <a href="${appUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block; font-size: 15px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);">تسجيل الدخول واستئناف العمل</a>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;">
      <p style="font-size: 11.5px; color: #64748b; text-align: center; margin: 0;">
        هذا البريد تم إرساله تلقائياً من نظام إدارة DOPAMINE-SERVICE &copy; 2026
      </p>
    </div>
  `;
  return await sendEmail({ to: userEmail, subject, text, html });
};

const sendNewTaskNotificationEmail = async (userEmail, username, task) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-c06w.onrender.com';
  const safeUsername = escapeHTML(username || 'عضو فريق DOPAMINE');
  const safeTitle = escapeHTML(task.title || 'مهمة جديدة');
  const safeTaskNumber = escapeHTML(task.taskNumber || '-');
  const safeCurrency = escapeHTML(task.currency || 'USD');
  const amount = Number(task.gross || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const safeMonth = escapeHTML(task.month || '');
  const isWithdrawal = task.type === 'withdrawal';
  const opTitle = isWithdrawal ? 'تسجيل عملية سحب جديدة' : 'إسناد مهمة جديدة لك';

  const subject = `📌 ${opTitle}: ${safeTitle} - DOPAMINE`;
  const text = `مرحباً ${username}،\n\nتم تسجيل ${isWithdrawal ? 'عملية سحب' : 'مهمة جديدة'} لك في منصة DOPAMINE:\n` +
    `- عنوان المهمة: ${task.title}\n` +
    `- رقم المهمة: ${task.taskNumber || '-'}\n` +
    `- المبلغ: ${amount} ${safeCurrency}\n` +
    (safeMonth ? `- الشهر: ${safeMonth}\n` : '') +
    `\nيمكنك مراجعة كافة التفاصيل وتسجيل الدخول عبر الرابط التالي:\n${appUrl}\n\nمع تحيات إدارة DOPAMINE.`;

  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px 24px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; max-width: 580px; margin: 20px auto; background: #0f131a; color: #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 12px; background: rgba(249, 115, 22, 0.12); border-radius: 14px; border: 1px solid rgba(249, 115, 22, 0.3); margin-bottom: 12px;">
          <span style="font-size: 30px;">🔥</span>
        </div>
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">DOPAMINE-SERVICE</h2>
        <p style="color: #94a3b8; font-size: 13.5px; margin-top: 6px;">إشعار بالمهام والعمليات الجديدة</p>
      </div>

      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px; margin-bottom: 22px;">
        <p style="font-size: 15px; color: #cbd5e1; margin-top: 0; margin-bottom: 16px;">
          مرحباً <strong>${safeUsername}</strong>، تم ${opTitle} في حسابك بالتفاصيل التالية:
        </p>

        <div style="background: #151a23; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">المهمة / الوصف:</span>
            <strong style="color: #ffffff; font-size: 14px;">${safeTitle}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">رقم المهمة (Task #):</span>
            <span style="color: #f97316; font-weight: 700; font-family: monospace; font-size: 14px;">${safeTaskNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">القيمة:</span>
            <strong style="color: #10b981; font-size: 16px;">${amount} ${safeCurrency}</strong>
          </div>
          ${safeMonth ? `
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8; font-size: 13px;">الشهر المستهدف:</span>
            <span style="color: #cbd5e1; font-size: 13px;">${safeMonth}</span>
          </div>` : ''}
        </div>

        <div style="text-align: center; margin: 24px 0 8px 0;">
          <a href="${appUrl}" style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block; font-size: 14.5px; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.35);">
            فتح لوحة التحكم ومتابعة العمل
          </a>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;">
      <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
        هذا إشعار تلقائي صادر عن نظام إدارة DOPAMINE-SERVICE &copy; 2026
      </p>
    </div>
  `;

  return await sendEmail({ to: userEmail, subject, text, html });
};

const sendPayoutReceiptEmail = async (userEmail, username, payoutData) => {
  const appUrl = process.env.APP_URL || 'https://dopamine-c06w.onrender.com';
  const safeUsername = escapeHTML(username || 'عضو فريق DOPAMINE');
  const safeCurrency = escapeHTML(payoutData.currency || 'USD');
  const amount = Number(payoutData.amount || payoutData.gross || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const safePaymentMethod = escapeHTML(payoutData.paymentMethod || 'InstaPay');
  const safePaymentDetails = escapeHTML(payoutData.paymentDetails || '-');
  const safeRefNumber = escapeHTML(payoutData.refNumber || payoutData.taskNumber || '-');
  const safeMonth = escapeHTML(payoutData.month || '');
  const safeDate = payoutData.date ? escapeHTML(payoutData.date) : new Date().toLocaleDateString('ar-EG');
  const safeNotes = escapeHTML(payoutData.notes || '');

  const subject = `💵 إيصال صرف مستحقات (Payout Receipt): ${amount} ${safeCurrency} - DOPAMINE`;
  const text = `مرحباً ${username}،\n\nتم تسجيل وصرف مستحقات مالية (Payout) لك في منصة DOPAMINE:\n` +
    `- المبلغ المنصرف: ${amount} ${safeCurrency}\n` +
    `- طريقة التحويل: ${safePaymentMethod}\n` +
    `- بيانات التحويل: ${safePaymentDetails}\n` +
    `- رقم المرجع / الحوالة: ${safeRefNumber}\n` +
    (safeMonth ? `- الشهر المستهدف: ${safeMonth}\n` : '') +
    `- تاريخ الصرف: ${safeDate}\n` +
    (safeNotes ? `- ملاحظات الإدارة: ${safeNotes}\n` : '') +
    `\nيمكنك مراجعة كافة التفاصيل وكشف الحساب عبر الرابط التالي:\n${appUrl}\n\nشكراً لجهودك وعطائك المستمر مع فريق DOPAMINE.`;

  const html = `
    <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px 24px; border: 1px solid rgba(16,185,129,0.3); border-radius: 18px; max-width: 580px; margin: 20px auto; background: #0b1118; color: #e2e8f0; box-shadow: 0 12px 35px rgba(0,0,0,0.6);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 14px; background: rgba(16, 185, 129, 0.15); border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.35); margin-bottom: 12px;">
          <span style="font-size: 32px;">💵</span>
        </div>
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">DOPAMINE-SERVICE</h2>
        <p style="color: #34d399; font-size: 14px; font-weight: 700; margin-top: 6px;">إيصال صرف مستحقات رسمي (Payout Voucher)</p>
      </div>

      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 22px;">
        <span style="font-size: 13px; color: #94a3b8; display: block; margin-bottom: 4px;">إجمالي المبلغ المحول</span>
        <strong style="font-size: 30px; color: #10b981; font-weight: 900;">${amount} <span style="font-size: 18px;">${safeCurrency}</span></strong>
      </div>

      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px; margin-bottom: 22px;">
        <p style="font-size: 14.5px; color: #cbd5e1; margin-top: 0; margin-bottom: 16px;">
          مرحباً <strong>${safeUsername}</strong>، نود إعلامك بأنه تم تحويل وصرف مستحقاتك المالية بنجاح بالبيانات التالية:
        </p>

        <div style="background: #111722; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">طريقة الدفع / التحويل:</span>
            <strong style="color: #ffffff; font-size: 13.5px;">${safePaymentMethod}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">بيانات المحفظة / الحساب:</span>
            <span style="color: #60a5fa; font-weight: 600; font-family: monospace; font-size: 13.5px;">${safePaymentDetails}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">رقم الحوالة / المرجع:</span>
            <span style="color: #fb923c; font-weight: 700; font-family: monospace; font-size: 13.5px;">${safeRefNumber}</span>
          </div>
          ${safeMonth ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 13px;">عن شهر:</span>
            <span style="color: #c084fc; font-weight: 600; font-size: 13.5px;">${safeMonth}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; ${safeNotes ? 'margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.07); padding-bottom: 8px;' : ''}">
            <span style="color: #94a3b8; font-size: 13px;">تاريخ الصرف:</span>
            <span style="color: #cbd5e1; font-size: 13px;">${safeDate}</span>
          </div>
          ${safeNotes ? `
          <div style="margin-top: 8px;">
            <span style="color: #94a3b8; font-size: 12.5px; display: block; margin-bottom: 4px;">ملاحظات الإدارة:</span>
            <p style="margin: 0; color: #f1f5f9; font-size: 13px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">${safeNotes}</p>
          </div>` : ''}
        </div>

        <div style="text-align: center; margin: 24px 0 8px 0;">
          <a href="${appUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block; font-size: 14.5px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);">
            عرض كشف الحساب وتأكيد الاستلام
          </a>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;">
      <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
        هذا الإيصال صادر رسمياً وموثق إلكترونياً من منصة DOPAMINE-SERVICE &copy; 2026
      </p>
    </div>
  `;

  return await sendEmail({ to: userEmail, subject, text, html });
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendSuspensionEmail,
  sendReactivationEmail,
  sendOtpEmail,
  sendNewTaskNotificationEmail,
  sendPayoutReceiptEmail
};



