// svelte.config.js
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true, // به svelte-preprocess می‌گوید که PostCSS را برای استایل‌ها اجرا کند (برای Tailwind)
    // اگر از TypeScript استفاده می‌کنید، بخش typescript را هم فعال کنید:
    // typescript: {
    //   tsconfigFile: './tsconfig.json'
    // }
  }),

  // (اختیاری) اگر از SvelteKit استفاده می‌کردید، تنظیمات Kit اینجا قرار می‌گرفت.
  // kit: {
  //   adapter: adapter()
  // }
};

export default config;
