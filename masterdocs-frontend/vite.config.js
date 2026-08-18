import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Client-side routes owned by React Router. Render serves static sites file by
// file, so a direct browser hit on /merge looks for dist/merge/index.html and
// 404s if it isn't there. Emitting a copy of index.html per route makes deep
// links resolve to a real file, and React Router takes over from there.
// Keep in sync with the <Route path="..."> entries in src/App.jsx.
const clientRoutes = ['merge', 'split', 'compress', 'pdf-to-image', 'image-to-pdf'];

function spaFallback() {
  let outDir;
  return {
    name: 'spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const source = resolve(outDir, 'index.html');
      for (const route of clientRoutes) {
        const dir = resolve(outDir, route);
        mkdirSync(dir, { recursive: true });
        copyFileSync(source, resolve(dir, 'index.html'));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  // Ensure service worker is copied to dist
  publicDir: 'public',
});
