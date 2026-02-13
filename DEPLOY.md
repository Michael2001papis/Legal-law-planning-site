# הפעלה אוטומטית מהגיטהאב

כשדוחפים (push) ל־`main` ב־GitHub, הפרויקט נבנה ומועלה אוטומטית.

## תצורה

### 1. Frontend (Vercel) – כבר פעיל ✅
- כתובת: https://legal-law-planning-site.vercel.app
- כל push ל־main מעלה גרסה חדשה אוטומטית

### 2. Backend (Render) – הגדרה חד־פעמית

1. היכנס ל־**https://dashboard.render.com** והתחבר עם GitHub.

2. **New → Web Service**

3. בחר את הריפו: `Michael2001papis/Legal-law-planning-site`

4. הגדרות:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node

5. **Environment Variables:**
   | משתנה | ערך |
   |-------|-----|
   | `MONGODB_URI` | כתובת MongoDB Atlas (חינמי) |
   | `JWT_SECRET` | מחרוזת סודית אקראית |
   | `CLIENT_URL` | `https://legal-law-planning-site.vercel.app` |

6. **MongoDB Atlas (חינמי):**
   - https://cloud.mongodb.com → Create Free Cluster
   - Database Access → Add User
   - Network Access → Allow from anywhere
   - העתק את ה־Connection String ל־`MONGODB_URI`

7. אחרי שהשרת עולה ב־Render, העתק את כתובת ה־API (לדוגמה: `https://mp-movies-api.onrender.com`).

8. **ב־Vercel** – הוסף משתנה סביבה:
   - **Environment Variable:** `VITE_API_URL`
   - **Value:** `https://YOUR-RENDER-URL.onrender.com/api`

9. הרץ **Redeploy** ב־Vercel כדי שהקליינט ישתמש בכתובת ה־API החדשה.

### 3. הרצת Seed (נתוני דוגמה)

ב־Render: **Shell** או דרך הדשבורד הרץ:
```bash
npm run seed
```

או מקומית (עם `MONGODB_URI` של Atlas):
```bash
cd server
MONGODB_URI="your-atlas-uri" npm run seed
```

---

## סיכום

| Push ל־main | תוצאה |
|-------------|--------|
| Vercel | Frontend מעודכן אוטומטית |
| Render | Backend מעודכן אוטומטית (אחרי חיבור ראשוני) |
