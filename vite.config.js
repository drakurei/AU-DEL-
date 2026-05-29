import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        programmes: resolve(__dirname, 'programmes.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
