<script>
  import { onMount } from 'svelte';
  import { geminiApiKey as G_API_KEY_STORE } from '../lib/stores.js'; // Access the store value
  export let openRouterApiKey; // Passed as prop from App.svelte
  // export let geminiApiKey; // Also passed as prop, or use the store directly

  // Form state
  let topic = '';
  let objective = '';
  let style = 'آکادمیک و پژوهشی';
  let language = 'فارسی معیار';
  let wordCount = '';
  let audience = '';
  let keywords = '';
  let outline = '';
  let sources = 'مقالات علمی و پژوهشی (Google Scholar, PubMed, IEEE Xplore)';
  let referencingStyle = '';
  let tone = 'بی‌طرف و عینی';
  let perspective = 'سوم شخص (دانشنامه ای/ علمی)';
  let negativeKeywords = '';
  let specificInstructions = '';
  let notes = '';
  let selectedModel = 'google/gemini-1.5-flash-latest'; // Default to Gemini Flash
  // API Key for OpenRouter will be taken from the prop 'openRouterApiKey'
  // API Key for Gemini is hardcoded or taken from prop 'geminiApiKey'

  let pageEstimate = '';
  let isLoading = false;
  let generatedPrompt = '';
  let showOutput = false;

  const WORDS_PER_A4_PAGE_FA = 300;

  $: if (wordCount) {
    const count = parseInt(wordCount);
    if (count && count > 0) {
      const pages = Math.ceil(count / WORDS_PER_A4_PAGE_FA);
      pageEstimate = `حدوداً ${pages} صفحه A4 (با فونت و فاصله استاندارد).`;
    } else {
      pageEstimate = '';
    }
  } else {
    pageEstimate = '';
  }

  async function handleSubmit() {
    isLoading = true;
    showOutput = false;

    const currentApiKey = selectedModel.startsWith('google/') ? G_API_KEY_STORE : openRouterApiKey;

    if (!currentApiKey && !selectedModel.startsWith('google/')) {
      alert("لطفاً کلید API OpenRouter را در بخش تنظیمات وارد کنید یا یک مدل Gemini انتخاب نمایید.");
      isLoading = false;
      return;
    }
     if (selectedModel.startsWith('google/') && G_API_KEY_STORE !== "AIzaSyC7_BCnYFOtZm4lbNaP1HR5rilgYfwxMDI") {
       // This is a sanity check, though the input is disabled.
       // The store value should always be the hardcoded one.
       alert("خطای داخلی: کلید Gemini نامعتبر است.");
       isLoading = false;
       return;
     }


    if (!topic || !objective) {
      alert("لطفاً حداقل موضوع و هدف مقاله را مشخص کنید.");
      isLoading = false;
      return;
    }

    let userPromptForLLM = `
یک پرامپت بسیار جامع، دقیق و حرفه‌ای برای نوشتن یک مقاله با مشخصات زیر تولید کن. این پرامپت باید به گونه‌ای باشد که یک نویسنده (انسان یا هوش مصنوعی) بتواند با استفاده از آن، مقاله‌ای کامل و با کیفیت تولید کند. تمام جزئیات ارائه شده را در پرامپت نهایی لحاظ کن و آن را به شکلی ساختاریافته و قابل فهم ارائه بده.

**جزئیات مقاله درخواستی:**

1.  **موضوع اصلی مقاله:** ${topic}
2.  **هدف اصلی از نگارش مقاله:** ${objective}
3.  **سبک نوشتار مورد نظر:** ${style}
4.  **زبان مقاله:** ${language}
5.  **تعداد کلمات تقریبی:** ${wordCount || 'مشخص نشده، اما جامع باشد'} (در صورت ذکر، حدود ${wordCount ? Math.ceil(parseInt(wordCount) / WORDS_PER_A4_PAGE_FA) : 'N/A'} صفحه A4)
6.  **مخاطب هدف مقاله:** ${audience || 'عمومی با سطح دانش متوسط'}
7.  **کلمات کلیدی اصلی که باید پوشش داده شوند:** ${keywords || 'بر اساس موضوع و هدف تعیین شود'}
8.  **ساختار یا سرفصل‌های پیشنهادی (در صورت وجود، آن‌ها را به عنوان راهنما در نظر بگیر و در صورت نیاز گسترش بده):**
    ${outline ? outline.split('\n').map(s => `- ${s}`).join('\n') : 'ساختار استاندارد مقاله (مقدمه، بدنه اصلی با پاراگراف‌های موضوعی، نتیجه‌گیری) پیشنهاد شود.'}
9.  **نوع منابع پیشنهادی برای تحقیق و استناد:** ${sources}
10. **سبک رفرنس‌دهی (در صورت تمایل نویسنده به استفاده):** ${referencingStyle || 'نیازی به تاکید بر سبک خاصی نیست، مگر اینکه محتوا آکادمیک باشد که در آن صورت APA یا معادل آن پیشنهاد شود.'}
11. **لحن کلی مقاله:** ${tone}
12. **زاویه دید نوشتار:** ${perspective}
13. **نکات یا عباراتی که باید از آن‌ها اجتناب شود:** ${negativeKeywords || 'تا حد امکان از کلیشه‌ها و اطلاعات اثبات‌نشده پرهیز شود.'}
14. **دستورالعمل‌های خاص دیگر (در صورت وجود، حتما لحاظ شود):**
    ${specificInstructions || 'خلاقیت در ارائه محتوا و استفاده از مثال‌های به‌روز تشویق می‌شود.'}

**نکات اضافی برای شما (هوش مصنوعی سازنده پرامپت):**
${notes || 'پرامپتی تولید کن که نویسنده را به بهترین شکل ممکن برای خلق یک مقاله عالی راهنمایی کند.'}

پرامپت نهایی باید شامل تمام این موارد باشد و به صورت یک دستورالعمل کامل برای نویسنده مقاله ارائه شود. مثلاً با عباراتی مانند "شما مامور به نوشتن مقاله‌ای هستید با موضوع..." یا "لطفاً مقاله‌ای با مشخصات زیر تهیه کنید:" شروع شود و سپس تمام جزئیات را لیست کند.
پرامپت باید به زبان فارسی روان و واضح باشد.
`;

    try {
      let response, data, resultText;

      if (selectedModel.startsWith('google/')) {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel.split('/')[1]}:generateContent?key=${G_API_KEY_STORE}`, { // Use the hardcoded key
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPromptForLLM }] }],
            generationConfig: { // Optional: good defaults
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          })
        });
        data = await response.json();
        if (!response.ok || data.error) {
          const errorMessage = data.error ? data.error.message : `HTTP error! status: ${response.status}`;
          alert("خطا از Gemini: " + errorMessage + (data.error?.details ? `\nDetails: ${JSON.stringify(data.error.details)}` : ''));
          isLoading = false;
          return;
        }
        resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی از Gemini دریافت نشد یا پاسخ فاقد محتوای متنی بود.";
      } else { // OpenRouter models
        if (!openRouterApiKey) {
          alert("لطفاً کلید API OpenRouter را در بخش تنظیمات وارد کنید.");
          isLoading = false;
          return;
        }
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openRouterApiKey}`, // Use the key from prop/store
            "HTTP-Referer": "https://prompt-suite.bch.com", // Replace with your site
            "X-Title": "Prompt Suite by Bch" // Replace with your app name
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [{ role: "user", content: userPromptForLLM }],
            // temperature: 0.7, // Add other params as needed
            // max_tokens: 4096
          })
        });
        data = await response.json();
        if (!response.ok || data.error) {
          const errorMessage = data.error ? data.error.message : `HTTP error! status: ${response.status}`;
          alert("خطا از OpenRouter: " + errorMessage);
          isLoading = false;
          return;
        }
        resultText = data.choices?.[0]?.message?.content || "پاسخی از OpenRouter دریافت نشد یا پاسخ فاقد محتوای متنی بود.";
      }
      generatedPrompt = resultText.trim();
      showOutput = true;
      // Scroll to output might need a slight delay for DOM update
      setTimeout(() => {
        const outputEl = document.getElementById('generatedPromptOutput');
        if (outputEl) outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);

    } catch (err) {
      alert("خطا در برقراری ارتباط با API: " + err.message);
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  function copyPrompt() {
    if (!generatedPrompt) {
      alert("هنوز پرامپتی برای کپی وجود ندارد!");
      return;
    }
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      alert("پرامپت با موفقیت کپی شد!");
    }).catch(err => {
      alert("خطا در کپی پرامپت. لطفاً دستی کپی کنید.");
      console.error('Error copying text: ', err);
    });
  }

  function savePrompt() {
    if (!generatedPrompt) {
      alert("هنوز پرامپتی برای ذخیره وجود ندارد!");
      return;
    }
    const blob = new Blob([generatedPrompt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = URL.createObjectURL(blob);
    link.download = `article_prompt_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    alert("پرامپت در فایل متنی ذخیره شد.");
  }

  // Common input field classes for styling
  const inputFieldClass = "w-full bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const inputLabelClass = "block text-sm font-medium text-gray-300 mb-1";
  const descriptionTextClass = "text-xs text-gray-400 mt-1";
  const fieldsetLegendClass = "font-semibold text-lg text-indigo-400 px-2";

</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-8">
  <!-- بخش اطلاعات پایه مقاله -->
  <fieldset class="border border-gray-600 p-4 rounded-md">
    <legend class="{fieldsetLegendClass}">۱. اطلاعات پایه مقاله</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div><label for="topic" class="{inputLabelClass}">موضوع اصلی مقاله:</label><input type="text" id="topic" bind:value={topic} class="{inputFieldClass}" placeholder="مثلاً: تأثیر هوش مصنوعی بر آینده مشاغل در ایران"/></div>
      <div><label for="objective" class="{inputLabelClass}">هدف اصلی مقاله:</label><input type="text" id="objective" bind:value={objective} class="{inputFieldClass}" placeholder="مثلاً: تحلیل چالش‌ها و فرصت‌ها، ارائه راهکار"/></div>
    </div>
  </fieldset>

  <!-- بخش جزئیات محتوا و ساختار -->
  <fieldset class="border border-gray-600 p-4 rounded-md">
    <legend class="{fieldsetLegendClass}">۲. جزئیات محتوا و ساختار</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <label for="style" class="{inputLabelClass}">سبک نوشتار:</label>
        <select id="style" bind:value={style} class="{inputFieldClass}">
          <option>آکادمیک و پژوهشی</option>
          <option>ژورنالیستی و خبری</option>
          <option>تحلیلی و انتقادی</option>
          <option>آموزشی و راهنما</option>
          <option>داستانی و روایی</option>
          <option>ترغیبی و تبلیغاتی</option>
          <option>رسمی و اداری</option>
        </select>
      </div>
      <div>
        <label for="language" class="{inputLabelClass}">زبان مقاله:</label>
        <select id="language" bind:value={language} class="{inputFieldClass}">
          <option>فارسی معیار</option>
          <option>English (US)</option>
          <option>English (UK)</option>
          <option>فارسی با لحن محاوره‌ای (در صورت لزوم)</option>
        </select>
      </div>
      <div>
        <label for="wordCount" class="{inputLabelClass}">تعداد کلمات مورد نظر:</label>
        <input type="number" id="wordCount" bind:value={wordCount} class="{inputFieldClass}" placeholder="مثلاً 2000"/>
        <p class="{descriptionTextClass} min-h-[1rem]">{pageEstimate}</p>
      </div>
      <div>
        <label for="audience" class="{inputLabelClass}">مخاطب هدف:</label>
        <input type="text" id="audience" bind:value={audience} class="{inputFieldClass}" placeholder="مثلاً: دانشجویان، مدیران، عموم مردم، متخصصین حوزه X"/>
      </div>
    </div>
    <div class="mt-6">
      <label for="keywords" class="{inputLabelClass}">کلمات کلیدی اصلی (با کاما جدا کنید):</label>
      <input type="text" id="keywords" bind:value={keywords} class="{inputFieldClass}" placeholder="هوش مصنوعی، بازار کار، اتوماسیون، آینده‌پژوهی"/>
    </div>
    <div class="mt-6">
      <label for="outline" class="{inputLabelClass}">ساختار یا سرفصل‌های پیشنهادی (اختیاری):</label>
      <textarea id="outline" bind:value={outline} class="{inputFieldClass} min-h-[100px]" rows="4" placeholder="مقدمه
بخش اول: تعریف و تاریخچه
بخش دوم: کاربردهای فعلی
بخش سوم: چالش‌ها
نتیجه‌گیری و پیشنهادات"></textarea>
      <p class="{descriptionTextClass}">هر سرفصل را در یک خط جدید وارد کنید. می‌توانید جزئیات بیشتری برای هر بخش نیز بنویسید.</p>
    </div>
  </fieldset>

  <!-- بخش منابع و استنادات -->
   <fieldset class="border border-gray-600 p-4 rounded-md">
    <legend class="{fieldsetLegendClass}">۳. منابع و استنادات</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <label for="sources" class="{inputLabelClass}">منابع ترجیحی برای جستجو:</label>
        <select id="sources" bind:value={sources} class="{inputFieldClass}">
          <option>مقالات علمی و پژوهشی (Google Scholar, PubMed, IEEE Xplore)</option>
          <option>کتاب‌های مرجع و تخصصی (Anna's Archive, Libgen)</option>
          <option>وب‌سایت‌های خبری و تحلیلی معتبر</option>
          <option>گزارش‌های سازمانی و دولتی</option>
          <option>ترکیبی از موارد فوق</option>
          <option>نیازی به جستجوی آنلاین گسترده نیست</option>
        </select>
      </div>
      <div>
        <label for="referencingStyle" class="{inputLabelClass}">سبک رفرنس‌دهی (اختیاری):</label>
        <select id="referencingStyle" bind:value={referencingStyle} class="{inputFieldClass}">
          <option value="">مهم نیست / ذکر نشود</option>
          <option>APA</option>
          <option>MLA</option>
          <option>Chicago</option>
          <option>Harvard</option>
          <option>Vancouver</option>
        </select>
      </div>
    </div>
  </fieldset>

  <!-- بخش لحن و نکات تکمیلی -->
  <fieldset class="border border-gray-600 p-4 rounded-md">
    <legend class="{fieldsetLegendClass}">۴. لحن و نکات تکمیلی</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <label for="tone" class="{inputLabelClass}">لحن کلی مقاله:</label>
        <select id="tone" bind:value={tone} class="{inputFieldClass}">
            <option>بی‌طرف و عینی</option>
            <option>ترغیبی و متقاعدکننده</option>
            <option>انتقادی و چالش‌برانگیز</option>
            <option>خوش‌بینانه و امیدوارکننده</option>
            <option>محتاط و واقع‌بینانه</option>
            <option>آموزشی و ساده</option>
        </select>
      </div>
      <div>
        <label for="perspective" class="{inputLabelClass}">زاویه دید (Perspective):</label>
        <select id="perspective" bind:value={perspective} class="{inputFieldClass}">
          <option>سوم شخص (دانشنامه ای/ علمی)</option>
          <option>اول شخص (تجربه شخصی/ نظر نویسنده - با احتیاط)</option>
          <option>دوم شخص (خطاب به خواننده - برای راهنماها)</option>
        </select>
      </div>
    </div>
    <div class="mt-6">
      <label for="negativeKeywords" class="{inputLabelClass}">نکات یا عباراتی که باید از آن‌ها اجتناب شود:</label>
      <input type="text" id="negativeKeywords" bind:value={negativeKeywords} class="{inputFieldClass}" placeholder="مثلاً: استفاده بیش از حد از اصطلاحات فنی پیچیده، نتیجه‌گیری قطعی"/>
    </div>
    <div class="mt-6">
      <label for="specificInstructions" class="{inputLabelClass}">دستورالعمل‌های خاص (اختیاری):</label>
      <textarea id="specificInstructions" bind:value={specificInstructions} class="{inputFieldClass} min-h-[80px]" rows="3" placeholder="مثلاً: شامل حداقل یک مثال واقعی از ایران باشد، یک جدول مقایسه‌ای ارائه شود، در انتها یک فراخوان به اقدام (Call to Action) داشته باشد."></textarea>
    </div>
    <div class="mt-6">
      <label for="notes" class="{inputLabelClass}">یادداشت‌های اضافی برای نویسنده پرامپت (شما):</label>
      <textarea id="notes" bind:value={notes} class="{inputFieldClass} min-h-[80px]" rows="3" placeholder="هر نکته دیگری که فکر می‌کنید به تولید پرامپت بهتر کمک می‌کند."></textarea>
    </div>
  </fieldset>

  <!-- بخش تنظیمات API و مدل -->
  <fieldset class="border border-gray-600 p-4 rounded-md">
    <legend class="{fieldsetLegendClass}">۵. تنظیمات فنی</legend>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mt-4"> <!-- Changed to 1 column for API keys -->
      <div>
        <label for="modelSelect" class="{inputLabelClass}">مدل هوش مصنوعی برای تولید پرامپت:</label>
        <select id="modelSelect" bind:value={selectedModel} class="{inputFieldClass}">
          <option value="google/gemini-1.5-flash-latest">Gemini 1.5 Flash (Google)</option>
          <option value="openai/gpt-4o">GPT-4o (OpenAI)</option>
          <option value="openai/gpt-4-turbo">GPT-4 Turbo (OpenAI)</option>
          <option value="anthropic/claude-3-opus-20240229">Claude 3 Opus (Anthropic)</option>
          <option value="anthropic/claude-3-sonnet-20240229">Claude 3 Sonnet (Anthropic)</option>
          <option value="anthropic/claude-3-haiku-20240307">Claude 3 Haiku (Anthropic)</option>
          <option value="mistralai/mistral-large-latest">Mistral Large (Mistral)</option>
        </select>
      </div>
      <!-- API Key inputs are now managed in SettingsPane or hardcoded -->
      {#if selectedModel.startsWith('google/')}
        <div class="mt-0"> <!-- No extra margin-top if it's the only field -->
          <label for="geminiApiKeyDisplay" class="{inputLabelClass}">🔑 کلید API (Google AI Studio):</label>
          <input type="text" id="geminiApiKeyDisplay" value="{G_API_KEY_STORE}" class="{inputFieldClass} bg-gray-900 text-gray-500 cursor-not-allowed" readonly disabled/>
          <p class="{descriptionTextClass}">این کلید به صورت پیش‌فرض برای مدل Gemini تنظیم شده و غیرقابل تغییر است. می‌توانید کلیدهای خود را از <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-indigo-400 hover:underline">Google AI Studio</a> مدیریت کنید.</p>
        </div>
      {:else}
       <div class="mt-0">
         <label for="openRouterApiKeyInfo" class="{inputLabelClass}">🔑 کلید API (OpenRouter):</label>
         {#if openRouterApiKey}
           <input type="text" id="openRouterApiKeyInfo" value="کلید OpenRouter در تنظیمات وارد شده است." class="{inputFieldClass} bg-gray-900 text-green-400 cursor-not-allowed" readonly disabled/>
           <p class="{descriptionTextClass}">برای تغییر کلید OpenRouter به بخش <button type="button" on:click={() => activeTab.set('settings')} class="text-indigo-400 hover:underline">تنظیمات API</button> مراجعه کنید.</p>
         {:else}
           <input type="text" id="openRouterApiKeyInfo" value="کلید API OpenRouter وارد نشده است!" class="{inputFieldClass} bg-gray-900 text-red-400 cursor-not-allowed" readonly disabled/>
           <p class="{descriptionTextClass}">لطفاً کلید API OpenRouter خود را در بخش <button type="button" on:click={() => activeTab.set('settings')} class="text-indigo-400 hover:underline">تنظیمات API</button> وارد کنید.</p>
         {/if}
       </div>
      {/if}
    </div>
  </fieldset>

  <button type="submit" disabled={isLoading} class="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-lg font-semibold transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed">
    {#if isLoading}
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>در حال پردازش...</span>
    {:else}
      <span>🔄 تولید پرامپت حرفه‌ای</span>
    {/if}
  </button>
</form>

{#if showOutput}
<div id="generatedPromptOutput" class="bg-gray-700 p-6 rounded-lg border border-gray-600 space-y-4 mt-10 shadow-lg">
  <h2 class="text-xl font-semibold text-indigo-300">📝 پرامپت تولید شده:</h2>
  <textarea bind:value={generatedPrompt} class="w-full h-96 p-3 rounded-md border border-gray-500 bg-gray-800 text-gray-200 text-sm leading-relaxed focus:ring-indigo-500 focus:border-indigo-500" readonly placeholder="پرامپت تولید شده در اینجا نمایش داده می‌شود..."></textarea>
  <div class="flex flex-wrap gap-3 mt-4">
    <button on:click={copyPrompt} class="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-700">📋 کپی پرامپت</button>
    <button on:click={savePrompt} class="bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-700">💾 ذخیره به‌عنوان فایل متنی</button>
  </div>
</div>
{/if}

<style>
  /* You can add component-specific styles here or use Tailwind classes directly */
  textarea { resize: vertical; }
</style>