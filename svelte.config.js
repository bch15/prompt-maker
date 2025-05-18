import adapter from '@sveltejs/adapter-auto'; // یا adapter-vercel
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // برای SvelteKit جدیدتر
// یا اگر از svelte-preprocess قدیمی‌تر استفاده می‌کنی:
// import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // preprocess: preprocess({ // برای svelte-preprocess قدیمی‌تر
  //   postcss: true,
  // }),
  preprocess: vitePreprocess(), // برای SvelteKit جدیدتر، خودش PostCSS رو مدیریت می‌کنه اگر تنظیم شده باشه

  kit: {
    adapter: adapter(), // آداپتور برای محیط دیپلوی (Vercel)
    // اگر نیاز به تنظیمات خاصی برای مسیرها یا aliasها داری، اینجا اضافه می‌شه
    // files: {
    //   assets: 'static',
    //   hooks: {
    //     client: 'src/hooks.client',
    //     server: 'src/hooks.server',
    //   },
    //   lib: 'src/lib',
    //   params: 'src/params',
    //   routes: 'src/routes',
    //   serviceWorker: 'src/service-worker',
    //   appTemplate: 'src/app.html', // فایل HTML اصلی
    //   errorTemplate: 'src/error.html',
    // },
  },
};

export default config;
