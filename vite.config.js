import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        programmes: resolve(__dirname, 'programmes.html'),
        infrastructure: resolve(__dirname, 'infrastructure.html'),
        beyondAcademics: resolve(__dirname, 'beyond-academics.html'),
        admissionProcess: resolve(__dirname, 'admission-process.html'),
        careers: resolve(__dirname, 'careers.html'),
        faqs: resolve(__dirname, 'faqs.html'),
        contactUs: resolve(__dirname, 'contact-us.html'),
      },
    },
  },
});
