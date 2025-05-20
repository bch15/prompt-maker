/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}', // مهم: تمام فایل‌هایی که ممکنه کلاس Tailwind داشته باشن
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tahoma', 'sans-serif'], // تنظیم فونت پیش‌فرض فارسی
      },
      // اینجا می‌تونی سایر شخصی‌سازی‌های تم Tailwind رو اضافه کنی
      // مثلا رنگ‌ها، فاصله‌ها و ...
    },
  },
  plugins: [
    // اینجا می‌تونی پلاگین‌های Tailwind مثل @tailwindcss/forms یا @tailwindcss/typography رو اضافه کنی
  ],
};