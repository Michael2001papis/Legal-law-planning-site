# העלאת הפרויקט ל-GitHub

## צעדים להעלאה ראשונה

**חשוב:** הרץ את הפקודות מתוך תיקיית הפרויקט (`f:\Legal-law-planning-site`).

### 1. אתחול Git (אם עדיין לא נעשה)
```bash
git init
```

### 2. הוספת הקבצים
```bash
git add .
```

### 3. commit ראשון
```bash
git commit -m "Initial commit - MP Movies platform"
```

### 4. חיבור לריפו ב-GitHub
```bash
git remote add origin https://github.com/Michael2001papis/Legal-law-planning-site.git
```

### 5. העלאה
```bash
git branch -M main
git push -u origin main
```

---

## אם Push נכשל

### שגיאת גודל קובץ (File too large)
- ודא ש-`node_modules` לא מועלה (מופיע ב-.gitignore)
- אם הוספת קבצים לפני שהגדרת .gitignore, הרץ:
  ```bash
  git rm -r --cached node_modules
  git rm -r --cached client/node_modules
  git rm -r --cached server/node_modules
  git add .
  git commit -m "Remove node_modules from tracking"
  ```

### בעיית Authentication
- השתמש ב-[Personal Access Token](https://github.com/settings/tokens) במקום סיסמה
- או: GitHub CLI (`gh auth login`)

### Remote כבר קיים
```bash
git remote remove origin
git remote add origin https://github.com/Michael2001papis/Legal-law-planning-site.git
```
