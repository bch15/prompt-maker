<script>
  import { openRouterApiKey } from '../lib/stores.js';
  let currentApiKey = $openRouterApiKey;

  function saveApiKey() {
    openRouterApiKey.set(currentApiKey);
    alert('کلید API OpenRouter ذخیره شد.');
  }
</script>

<div class="bg-white p-6 rounded-lg shadow-card-light border border-space-border">
  <h2 class="text-2xl font-semibold text-space-text mb-6 border-b border-space-border pb-3 neon-text-primary filter drop-shadow-[0_0_3px_theme(colors.neon-primary/0.5)]">تنظیمات کلیدهای API</h2>

  <div class="space-y-6"> {/* افزایش فاصله */}
    <div>
      <label for="openrouter-key" class="input-label-space">
        🔑 کلید API OpenRouter:
      </label>
      <input
        type="password"
        id="openrouter-key"
        bind:value={currentApiKey}
        placeholder="sk-or-..."
        class="input-field-space"
      />
      <p class="mt-2 text-xs text-gray-500">
        این کلید در حافظه مرورگر شما (localStorage) ذخیره می‌شود.
        <a href="https://openrouter.ai/keys" target="_blank" class="neon-text-primary hover:underline">دریافت کلید از OpenRouter</a>
      </p>
    </div>
    <button
      on:click={saveApiKey}
      class="w-full sm:w-auto btn-neon-primary"
    >
      ذخیره کلید OpenRouter
    </button>
  </div>

   <div class="mt-10 pt-6 border-t border-space-border"> {/* افزایش فاصله */}
      <label for="gemini-key-display" class="input-label-space">
        🔑 کلید API Google AI Studio (Gemini):
      </label>
      <input
        type="text"
        id="gemini-key-display"
        value="AIzaSyC7_BCnYFOtZm4lbNaP1HR5rilgYfwxMDI"
        readonly
        disabled
        class="input-field-space bg-gray-100 text-gray-500 cursor-not-allowed"
      />
      <p class="mt-2 text-xs text-gray-500">
        این کلید برای مدل Gemini 1.5 Flash به صورت پیش‌فرض تنظیم شده است.
        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="neon-text-primary hover:underline">مدیریت کلیدهای Google AI Studio</a>
      </p>
    </div>
</div>