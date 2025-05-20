// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(), // پلاگین رسمی Svelte برای Vite
  ],
  // (اختیاری) اگر می‌خواهید برنامه را در یک زیرپوشه روی سرور دیپلوی کنید (مثلاً برای GitHub Pages)
  // base: '/your-repo-name/', // نام ریپازیتوری خود را جایگزین کنید

  // (اختیاری) تنظیمات سرور توسعه
  server: {
    port: 5173, // پورتی که سرور توسعه روی آن اجرا می‌شود (پیش‌فرض Vite)
    open: true, // به طور خودکار مرورگر را پس از اجرا باز می‌کند
  },

  // (اختیاری) تنظیمات بیلد
  build: {
    // outDir: 'dist', // پوشه خروجی برای بیلد (پیش‌فرض Vite)
    // sourcemap: true, // ایجاد سورس‌مپ برای دیباگینگ کد بیلد شده (برای تولید معمولاً false یا 'hidden')
  },
});