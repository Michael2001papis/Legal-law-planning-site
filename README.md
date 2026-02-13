# עולם הסרטים של MP

פלטפורמת סרטים בסגנון Netflix לצורכי לימוד והדגמה.

## התקנה והפעלה

```bash
# התקנת תלויות (שורש + client + server)
npm install
cd client && npm install
cd ../server && npm install
cd ..

# בנייה
npm run build

# פיתוח (הפעלת שרת וקליינט במקביל)
npm run dev
```

## דרישות

- **Node.js** 18+
- **MongoDB** (פועל מקומית או כתובת ב-.env)

## הגדרה

1. העתק `.env.example` ל-`.env`
2. הגדר `MONGODB_URI`, `JWT_SECRET` לפי הצורך
3. הרץ seed לנתוני דוגמה: `cd server && npm run seed`

## חשבון מנהל לדוגמה

- **אימייל:** admin@mp.com  
- **סיסמה:** admin123  

## מבנה הפרויקט

```
├── client/          # React + Vite
├── server/          # Node.js + Express + MongoDB
├── package.json     # סקריפטים משותפים
└── .env.example
```

## Routes מרכזיים

| Route | תיאור |
|-------|-------|
| /disclaimer | תקנון חובה |
| /auth/login | התחברות |
| /auth/register | הרשמה |
| /home | דף הבית |
| /movie/:id | דף סרט |
| /search | חיפוש |
| /my-list | הרשימה שלי |
| /profile | פרופיל |
| /devices | מכשירים מחוברים |
| /admin/* | ניהול (admin / content_admin) |

## מנויים (Plans)

- **basic** – מכשיר אחד, קטלוג מצומצם
- **platinum** – עד 3 מכשירים, קטלוג מורחב
- **diamond** – ללא הגבלה

## הפעלה אוטומטית מהגיטהאב

- **Frontend (Vercel):** כל push ל־main מעלה גרסה חדשה
- **Backend (Render):** חיבור חד־פעמי – ראה [DEPLOY.md](./DEPLOY.md)
