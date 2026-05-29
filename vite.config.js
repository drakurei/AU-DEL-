import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // Served from https://drakurei.github.io/AU-DEL-/ on GitHub Pages.
  base: '/AU-DEL-/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        programmes: resolve(__dirname, 'programmes.html'),
        contact: resolve(__dirname, 'contact.html'),
        mentions: resolve(__dirname, 'mentions-legales.html'),
        confidentialite: resolve(__dirname, 'confidentialite.html'),
        cgv: resolve(__dirname, 'cgv.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
