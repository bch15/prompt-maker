import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess({
    postcss: true, // Ensure PostCSS (for Tailwind) is processed
  }),
};
