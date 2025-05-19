<script>
  import { onMount } from 'svelte';
  import { activeTab, openRouterApiKey as orApiKeyStore, geminiApiKey as geminiApiKeyStoreValue } from './lib/stores.js';
  import TabButton from './components/TabButton.svelte';
  import ArticlePromptForm from './components/ArticlePromptForm.svelte';
  import DevPromptForm from './components/DevPromptForm.svelte';
  import SettingsPane from './components/SettingsPane.svelte';

  let currentTab;
  activeTab.subscribe(value => {
    currentTab = value;
  });

  let orApiKey;
  orApiKeyStore.subscribe(value => orApiKey = value);

  const G_API_KEY = geminiApiKeyStoreValue; // از استور خوانده می‌شود

</script>

<div class="w-full max-w-5xl card-space-theme space-y-8 min-h-[80vh] mx-auto">
  <header class="text-center mb-10 pt-6 sm:pt-0"> {/* کمی پدینگ بالا برای موبایل */}
    <h1 class="text-4xl sm:text-5xl font-extrabold neon-text-primary filter drop-shadow-[0_0_10px_theme(colors.neon-primary/0.6)]">
      مولد پرامپت پیشرفته
    </h1>
    <p class="text-space-text-secondary mt-4 text-lg">
      ابزاری برای خلق پرامپت‌های دقیق و جامع با کمک هوش مصنوعی
    </p>
  </header>

  <div class="flex justify-center flex-wrap gap-2 border-b border-space-border pb-4 mb-6 px-2"> {/* flex-wrap و gap برای نمایش بهتر در موبایل */}
    <TabButton tabId="article" currentTab={$activeTab} label="مقاله نویسی" />
    <TabButton tabId="development" currentTab={$activeTab} label="توسعه نرم‌افزار" />
    <TabButton tabId="creative" currentTab={$activeTab} label="خلاقیت و ایده" />
    <TabButton tabId="settings" currentTab={$activeTab} label="تنظیمات API" />
  </div>

  <main class="mt-6 px-1 sm:px-0"> {/* پدینگ افقی برای موبایل در محتوای اصلی */}
    {#if $activeTab === 'article'}
      <ArticlePromptForm openRouterApiKey={orApiKey} geminiApiKey={G_API_KEY} />
    {:else if $activeTab === 'development'}
      <DevPromptForm openRouterApiKey={orApiKey} />
    {:else if $activeTab === 'creative'}
      <div class="text-center p-6 sm:p-10 text-space-text-secondary bg-white rounded-lg border border-space-border shadow-sm">
        <h2 class="text-2xl font-semibold mb-4 neon-text-primary">پرامپت‌های خلاقیت و ایده‌پردازی</h2>
        <p>این بخش به زودی تکمیل خواهد شد. برای مثال: ایده برای داستان کوتاه، سناریوی ویدیو، نام برند و...</p>
      </div>
    {:else if $activeTab === 'settings'}
      <SettingsPane />
    {/if}
  </main>
</div>

<footer class="w-full max-w-4xl text-center py-8 mt-12 border-t border-space-border mx-auto">
  <p class="text-sm text-space-text-secondary">
    Built from a Need. (Enjoy!) By:
    Behzad Chaharbaghi
  </p>
  <p class="text-sm text-space-text-secondary mt-1">
    <a href="https://github.com/bch15/Promptลอง" target="_blank" rel="noopener noreferrer" class="neon-text-primary hover:underline">View project on GitHub</a>
  </p>
</footer>


<style>
  /* در صورت نیاز به استایل خاص برای App.svelte */
</style>