import adapter from '@sveltejs/adapter-auto'; // یا @sveltejs/adapter-vercel
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(), // این برای Tailwind با PostCSS کار می‌کند

  kit: {
    adapter: adapter(),
    // اگر alias خاصی برای مسیرها دارید، اینجا تنظیم کنید
    // alias: {
    //   '$components': 'src/components',
    //   '$lib': 'src/lib'
    // }
  }
};

export default config;