// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,svelte,ts}", // اطمینان از پوشش تمام فایل‌ها
  ],
  theme: {
    extend: {
      colors: {
        'space-bg': '#FFF7FC',        // پس زمینه اصلی روشن
        'neon-primary': '#1DCD9F',     // سبزآبی/فیروزه‌ای نئونی
        'neon-accent': '#A0153E',      // زرشکی/بنفش تیره نئونی
        'space-text': '#1a202c',       // یک خاکستری تیره برای متن (می‌تونید تغییر بدید)
        'space-text-secondary': '#4a5568', // خاکستری تیره‌تر برای متن ثانویه
        'space-border': '#E2E8F0',     // یک رنگ روشن برای بوردرها
        'space-card': '#FFFFFF',       // رنگ کارت‌ها کمی روشن‌تر از پس‌زمینه یا خود پس‌زمینه
      },
      fontFamily: {
        'sans': ['Tahoma', 'sans-serif'], // فونت فارسی شما
        // می‌تونید یک فونت مدرن‌تر هم برای تم فضایی اضافه کنید اگر دارید
        // 'display': ['Orbitron', 'sans-serif'], // مثال برای فونت فضایی
      },
      boxShadow: {
        'neon-glow-primary': '0 0 15px 5px rgba(29, 205, 159, 0.5)', // درخشش برای 1DCD9F
        'neon-glow-accent': '0 0 15px 5px rgba(160, 21, 62, 0.5)',  // درخشش برای A0153E
        'card-light': '0 4px 15px 0 rgba(0, 0, 0, 0.08)', // سایه ملایم برای کارت‌ها
      },
      // برای انیمیشن‌های نئونی (اختیاری)
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px 2px rgba(29, 205, 159, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px 8px rgba(29, 205, 159, 0.6)' },
        }
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}