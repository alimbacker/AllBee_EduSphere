# 🐝 AllBee EduSphere
**Smart Student Management by AllBee**

## Demo Login Credentials
| Username | Password | Role |
|----------|----------|------|
| superadmin | super123 | Super Admin (all institutions) |
| svce_admin | svce123 | College Admin |
| gvs_admin | gvs123 | School Admin |
| tech_admin | tech123 | Computer Institute Admin |
| dance_admin | dance123 | Dance School Admin |

## Features
- Multi-institution management (College, School, Computer Institute, Dance School)
- Student registration with photo upload
- Attendance tracking (daily, P/A/L)
- Fee management with receipts
- Homework assignment & tracking
- Exam marks & grading
- Assignments management
- Timetable builder (printable)
- ID Card generator (printable)
- Fee Receipt generator (printable)
- WhatsApp / SMS / Email alerts to parents
- Reports with CSV export
- Light / Dark mode
- All data saved in browser localStorage

## Setup & Deploy to GitHub Pages

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open: http://localhost:5173/allbee-edusphere/

### 3. Deploy to GitHub Pages

**First time:**
1. Create a new GitHub repository named `allbee-edusphere`
2. Run:
```bash
git init
git add .
git commit -m "Initial commit - AllBee EduSphere"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/allbee-edusphere.git
git push -u origin main
npm run deploy
```

3. Go to GitHub repo → Settings → Pages → Source: `gh-pages` branch → Save

**Your app will be live at:**
```
https://YOUR_USERNAME.github.io/allbee-edusphere/
```

**Future updates:**
```bash
git add . && git commit -m "Update" && git push && npm run deploy
```

## Tech Stack
- React 18
- Vite 5
- Pure CSS-in-JS (no external UI library)
- localStorage for data persistence

## Note
If you deploy to a different repo name, update `base` in `vite.config.js`:
```js
base: '/your-repo-name/',
```
