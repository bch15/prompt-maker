<script>
  import { activeTab, openRouterApiKey, geminiApiKey } from './lib/stores.js';
  import TabButton from './components/TabButton.svelte';
  import ArticlePromptForm from './components/ArticlePromptForm.svelte';
  import DevPromptForm from './components/DevPromptForm.svelte'; // We'll create this
  import SettingsPane from './components/SettingsPane.svelte'; // We'll create this

  let currentTab;
  activeTab.subscribe(value => {
    currentTab = value;
  });

  // This is just to demonstrate reading the store value, not strictly needed here
  let orApiKey;
  openRouterApiKey.subscribe(value => orApiKey = value);

  const G_API_KEY = geminiApiKey; // Make it available to child components if needed via prop or context

</script>

<div class="w-full max-w-5xl bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-10 space-y-8 min-h-[80vh]">
  <header class="text-center mb-10">
    <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      مولد پرامپت پیشرفته
    </h1>
    <p class="text-gray-400 mt-3 text-lg">
      ابزاری برای خلق پرامپت‌های دقیق و جامع با کمک هوش مصنوعی
    </p>
  </header>

  <div class="flex justify-center space-x-2 space-x-reverse border-b border-gray-700 pb-4 mb-6">
    <TabButton tabId="article" currentTab={$activeTab} label="مقاله نویسی" />
    <TabButton tabId="development" currentTab={$activeTab} label="توسعه نرم‌افزار" />
    <TabButton tabId="creative" currentTab={$activeTab} label="خلاقیت و ایده" />
    <TabButton tabId="settings" currentTab={$activeTab} label="تنظیمات API" />
  </div>

  <main class="mt-6">
    {#if $activeTab === 'article'}
      <ArticlePromptForm openRouterApiKey={orApiKey} geminiApiKey={G_API_KEY} />
    {:else if $activeTab === 'development'}
      <DevPromptForm openRouterApiKey={orApiKey} />
    {:else if $activeTab === 'creative'}
      <div class="text-center p-10 text-gray-500">
        <h2 class="text-2xl font-semibold mb-4">پرامپت‌های خلاقیت و ایده‌پردازی</h2>
        <p>این بخش به زودی تکمیل خواهد شد. برای مثال: ایده برای داستان کوتاه، سناریوی ویدیو، نام برند و...</p>
      </div>
    {:else if $activeTab === 'settings'}
      <SettingsPane />
    {/if}
  </main>
</div>

<footer class="w-full max-w-4xl text-center py-8 mt-10 border-t border-gray-700">
  <p class="text-sm text-gray-400">
    Developed by: <strong class="font-mono text-gray-200">Behzad Chaharbaghi</strong>
  </p>
  <p class="text-sm text-gray-500 mt-1">
    GitHub: <a href="https://github.com/bch15" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 hover:underline">https://github.com/bch15</a>
  </p>
</footer>

<style>
  /* Styles specific to App.svelte if any, or use Tailwind utilities */
</style>