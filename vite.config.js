import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services/index.html'),
        network: resolve(__dirname, 'network/index.html'),
        aboutUs: resolve(__dirname, 'about-us/index.html'),
        contactUs: resolve(__dirname, 'contact-us/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
