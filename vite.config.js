import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // App.jsx is large; raise the warning limit so the build log stays quiet.
    chunkSizeWarningLimit: 2000,
  },
  // If you deploy to a GitHub Pages *project* site (username.github.io/REPO),
  // uncomment and set this to "/REPO/". For Vercel/Netlify/root domains, leave as "/".
  // base: "/REPO/",
});
