<script>
  import { openRouterApiKey } from '../lib/stores.js';
  let currentApiKey = $openRouterApiKey;

  function saveApiKey() {
    openRouterApiKey.set(currentApiKey);
    alert('کلید API OpenRouter ذخیره شد.');
  }
</script>

<div class="bg-gray-700 p-6 rounded-lg shadow-md">
  <h2 class="text-2xl font-semibold text-white mb-6 border-b border-gray-600 pb-3">تنظیمات کلیدهای API</h2>

  <div class="space-y-4">
    <div>
      <label for="openrouter-key" class="block text-sm font-medium text-gray-300 mb-1">
        🔑 کلید API OpenRouter:
      </label>
      <input
        type="password"
        id="openrouter-key"
        bind:value={currentApiKey}
        placeholder="sk-or-..."
        class="w-full bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-500 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <p class="mt-1 text-xs text-gray-400">
        این کلید در حافظه مرورگر شما (localStorage) ذخیره می‌شود.
        <a href="https://openrouter.ai/keys" target="_blank" class="text-indigo-400 hover:underline">دریافت کلید از OpenRouter</a>
      </p>
    </div>
    <button
      on:click={saveApiKey}
      class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
    >
      ذخیره کلید OpenRouter
    </button>
  </div>

   <div class="mt-8 pt-4 border-t border-gray-600">
      <label for="gemini-key-display" class="block text-sm font-medium text-gray-300 mb-1">
        🔑 کلید API Google AI Studio (Gemini):
      </label>
      <input
        type="text"
        id="gemini-key-display"
        value="AIzaSyC7_BCnYFOtZm4lbNaP1HR5rilgYfwxMDI"
        readonly
        disabled
        class="w-full bg-gray-900 border border-gray-700 text-gray-500 px-3 py-2 rounded-md sm:text-sm cursor-not-allowed"
      />
      <p class="mt-1 text-xs text-gray-400">
        این کلید برای مدل Gemini 1.5 Flash به صورت پیش‌فرض تنظیم شده است.
        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-indigo-400 hover:underline">مدیریت کلیدهای Google AI Studio</a>
      </p>
    </div>
</div>