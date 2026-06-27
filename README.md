# EduSphere — Smart Student Management

A single-page React app (by AllBee Solutions) for schools & coaching centres:
students, batches, attendance, fees, tests, notes, and more.

- **Database:** Firebase **Firestore** (real-time).
- **File storage** (Notes — PDF / Word, view-only): **Supabase Storage**.
- **Build:** Vite + React 18.

---

## 1. Prerequisites

- **Node.js 18 or newer** (`node -v` to check). Get it from https://nodejs.org.

## 2. Install & run locally

```bash
npm install
npm run dev
```

Vite prints a local URL (usually http://localhost:5173). Open it in your browser.

## 3. Configure your services

### a) Firebase (database)
Open **`src/firebase.js`**.

- If you already have a working `firebase.js`, just paste your version over this file.
  It must export: `db, doc, setDoc, onSnapshot, collection, getDocs`.
- Otherwise, fill in the `firebaseConfig` object with the values from
  **Firebase console → Project settings → Your apps → SDK setup & config**.

> The Firebase web-config values are safe to commit. Your data is protected by your
> **Firestore security rules**, not by hiding these keys.

### b) Supabase (file storage for Notes)
Open **`src/App.jsx`** and set the three constants near the top:

```js
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
const SUPA_BUCKET = "notes";
```

Get the URL and **anon public** key from **Supabase → Project Settings → API**.
The anon key is a public key and is safe to commit — access is controlled by the
bucket policies below.

Then, one time, in your Supabase project:

1. **Storage → New bucket** → name it exactly **`notes`**, leave **Public** OFF,
   and set the **file size limit to at least 10 MB**.
2. **SQL Editor** → run:

   ```sql
   create policy "notes read"   on storage.objects for select
     to anon, authenticated using ( bucket_id = 'notes' );
   create policy "notes insert" on storage.objects for insert
     to anon, authenticated with check ( bucket_id = 'notes' );
   create policy "notes delete" on storage.objects for delete
     to anon, authenticated using ( bucket_id = 'notes' );
   ```

## 4. Build for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the production build locally to test it
```

---

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "EduSphere app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

> `node_modules/` and `dist/` are git-ignored on purpose — the host rebuilds them.

## 6. Deploy

Pick one. All three serve the static `dist/` build.

### Vercel (easiest)
1. Import the GitHub repo at https://vercel.com/new.
2. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
3. Deploy. (`vercel.json` is already included.)

### Netlify
1. "Add new site" → import the repo at https://app.netlify.com.
2. Build command `npm run build`, publish dir `dist` (already set in `netlify.toml`).
3. Deploy.

### GitHub Pages
1. In **`vite.config.js`**, uncomment and set `base: "/YOUR-REPO/"` (the repo name),
   **only** if using a project page (`username.github.io/YOUR-REPO`). For a custom
   domain or user page, leave `base` as `/`.
2. Build and publish `dist/` (e.g. with the `gh-pages` package or a GitHub Action).

### Custom domain (e.g. edusphere.allbeesolutions.com)
On Vercel/Netlify, add the domain in the project's **Domains** settings and point a
CNAME from your DNS provider to the host. Leave `base` as `/` in `vite.config.js`.

---

## Project structure

```
edusphere/
├── index.html            # Vite HTML shell
├── package.json          # deps + scripts
├── vite.config.js        # build config (GitHub Pages base note inside)
├── vercel.json           # SPA fallback for Vercel
├── netlify.toml          # build + SPA fallback for Netlify
├── .gitignore
└── src/
    ├── main.jsx          # mounts <App/>
    ├── index.css         # tiny global reset
    ├── firebase.js       # Firestore config  ← put your config here
    └── App.jsx           # the whole app      ← Supabase keys near the top
```

## Notes

- **PDF/Word viewing** in Notes loads pdf.js / mammoth from a CDN at runtime, so the
  app needs internet access (it already did for Excel import). No extra npm packages.
- Old notes that stored their file inline still open; new uploads go to Supabase.
- Security posture: with roll-no + DOB login (not Firebase/Supabase Auth), the Notes
  bucket policies above allow the public `anon` role. That's a reasonable start; for
  stricter control, move auth to Supabase Auth and gate policies on `auth.uid()`.
