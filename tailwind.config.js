/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', // اگر از SvelteKit استفاده نمی‌کنید و index.html اصلی دارید
    './src/**/*.{html,js,svelte,ts}', // برای SvelteKit یا اگر فایل‌ها در src هستند
  ],
  theme: {
    extend: {
      colors: {
        'space-bg': '#FFF7FC',
        'neon-primary': '#1DCD9F',
        'neon-accent': '#A0153E',
        'space-text': '#2d3748', // کمی تیره‌تر از قبل برای خوانایی بهتر
        'space-text-secondary': '#4a5568',
        'space-border': '#E2E8F0',
        'space-card': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Tahoma', 'sans-serif'],
        // 'display': ['Orbitron', 'sans-serif'], // فونت فضایی اختیاری
      },
      boxShadow: {
        'neon-glow-primary': '0 0 10px 2px rgba(29, 205, 159, 0.6)', // درخشش قوی‌تر
        'neon-glow-accent': '0 0 10px 2px rgba(160, 21, 62, 0.6)',
        'card-light': '0 5px 20px -5px rgba(0, 0, 0, 0.07)', // سایه ملایم‌تر برای کارت‌ها
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 8px 1px theme(colors.neon-primary / 60%)',
          },
          '50%': {
            opacity: '0.85',
            boxShadow: '0 0 18px 5px theme(colors.neon-primary / 70%)',
          },
        },
      },
      animation: {
        'pulse-neon': 'pulseNeon 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
