# 🚀 دليل النشر أونلاين الكامل - DOPAMINE-SERVICE

هذا الدليل يشرح كيفية رفع مشروع **DOPAMINE-SERVICE** أونلاين على **Render.com** مع قاعدة بيانات سحابية مجانية **MongoDB Atlas** في 5 خطوات بسيطة.

---

## 📋 الخطوة 1: إنشاء قاعدة بيانات سحابية مجانية (MongoDB Atlas)

1. اذهب إلى [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) وأنشئ حساب مجاني.
2. أنشئ **Database Cluster** جديد (اختر الخطة المجانية **M0 Free Shared**).
3. اختر السيرفر المقترح (مثل AWS - Frankfurt أو AWS - Ireland).
4. اضبط اسم المستخدم وكلمة المرور لقاعدة البيانات (مثلاً `admin` وكلمة سر قوية).
5. في قسم **Network Access**، أضف IP الرقم `0.0.0.0/0` ليتصل السيرفر من أي مكان.
6. اضغط **Connect** ← اختر **Connect your application** وانسخ رابط الاتصال (**Connection String**)، سيكون شكله كالتالي:
   ```text
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/dopamine_service?retryWrites=true&w=majority
   ```

---

## 🔒 الخطوة 2: تجهيز مفتاح التشفير (Encryption Key)

تحتاج مفتاح تشفير عشوائي بطول 64 حرف (32-byte Hex). يمكنك إنشاؤه عبر تشغيل هذا الأمر في Terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 الخطوة 3: إنشاء حساب المسؤول الأول (Admin Account Setup)

قبل النشر، قم بإنشاء ملف `.env` داخل مجلد `server/`:

```env
PORT=3000
MONGODB_URI=رابط_قاعدة_البيانات_من_الخطوة_1
JWT_SECRET=مفتاح_عشوائي_طويل_للتوكن
ENCRYPTION_KEY=مفتاح_التشفير_من_الخطوة_2
ADMIN_USERNAME=admin
ADMIN_PASSWORD=كلمة_سر_المدير_الجديدة
NODE_ENV=production
```

ثم شغّل سكريبت إنشاء الحساب ونقل البيانات المحلية:
```bash
cd server
npm install
npm run setup    # لإنشاء حساب المدير في قاعدة البيانات
npm run migrate  # لنقل بياناتك المحلية من data.json إلى MongoDB
```

---

## 🌐 الخطوة 4: النشر على Render.com (مجاني 100%)

1. اذهب إلى [render.com](https://render.com) وأنشئ حساب مجاني.
2. ارفع مشروعك على GitHub (أو ارفع مجلد `server/` كـ Web Service).
3. اضغط **New +** ← اختر **Web Service**.
4. اربط حساب GitHub واختر مستودع المشروع (أو اختر المجلد `server`).
5. اضبط الإعدادات كالتالي:
   - **Name**: `dopamine-service` (أو أي اسم تفضله)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. في قسم **Environment Variables**، أضف القيم التالية:
   - `MONGODB_URI` = رابط MongoDB Atlas
   - `JWT_SECRET` = مفتاح JWT
   - `ENCRYPTION_KEY` = مفتاح التشفير (64-hex)
   - `NODE_ENV` = `production`
7. اضغط **Create Web Service**.

---

## 🎉 الخطوة 5: التشغيل!

سيقوم موقع Render ببناء وتشغيل سيرفرك تلقائياً ويوفر لك رابطاً مشفراً بدومين مجاني وبشهادة أمان **HTTPS**:
```text
https://dopamine-service.onrender.com
```

### 👤 الحساب الافتراضي للدخول:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: كلمة السر التي اخترتها في الخطوة 3 (ويمكنك تغييرها في أي وقت من زر "تغيير كلمة المرور" داخل التطبيق).

---

## 🛡️ مميزات الأمان المفعّلة تلقائياً:
- ✅ تشفير كلمات السر بـ **bcrypt (Salt 12)**
- ✅ تشفير الحسابات والـ VPN بـ **AES-256-GCM**
- ✅ مصادقة **JWT Token** مسجلة مع وقت انتهاء صلاحية (24 ساعة)
- ✅ **Helmet Security Headers + Rate Limiting** لحماية السيرفر من هجمات DDoS والتجسس
- ✅ فصل التقرير المخصص لكل موظف بحيث لا يرى إلا مهامه فقط
