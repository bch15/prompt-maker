<script>
  import { onMount } from 'svelte';
  // فعال کردن activeTab برای دکمه تنظیمات
  import { geminiApiKey as G_API_KEY_STORE, selectedRoleForForm, activeTab } from '../lib/stores.js';

  export let openRouterApiKey;

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
  let selectedModel = 'google/gemini-1.5-flash-latest';

  // برای دراپ‌دان دستی نقش‌ها
  let selectedRole = 'default'; // مقدار پیش‌فرض برای دراپ‌دان دستی
  const articleRoles = [ // تعریف آرایه نقش‌های دستی
    { value: 'default', label: 'بدون نقش خاص / نویسنده عمومی' },
    { value: 'academician', label: 'استاد دانشگاه / پژوهشگر آکادمیک' },
    { value: 'essay_writer', label: 'مقاله‌نویس / انشا نویس حرفه‌ای' },
    { value: 'journalist', label: 'روزنامه‌نگار تحقیقی / گزارشگر ویژه' },
    { value: 'storyteller', label: 'داستان‌گو / روایت‌گر خلاق' },
    { value: 'tech_writer', label: 'نویسنده فنی (مستندات و راهنماها)' },
    { value: 'screenwriter', label: 'فیلم‌نامه‌نویس / نمایشنامه‌نویس' },
    { value: 'poet', label: 'شاعر (سبک‌های مختلف)' },
    { value: 'content_creator', label: 'تولیدکننده محتوا (وبلاگ، شبکه‌های اجتماعی)' },
    { value: 'gov_spokesperson', label: 'سخنگوی دولت / مسئول روابط عمومی سازمان دولتی' },
    { value: 'political_analyst', label: 'تحلیلگر مسائل سیاسی / روابط بین‌الملل' },
    { value: 'economic_analyst', label: 'کارشناس اقتصادی / تحلیلگر بازار' },
    { value: 'basic_scientist', label: 'دانشمند علوم پایه (فیزیک/شیمی/زیست‌شناسی)' },
    { value: 'humanities_scholar', label: 'دانشمند علوم انسانی (جامعه‌شناسی/فلسفه/تاریخ)' },
    { value: 'medical_specialist', label: 'پزشک متخصص / پژوهشگر علوم پزشکی' },
    { value: 'engineering_specialist', label: 'مهندس متخصص (عمران/مکانیک/برق/کامپیوتر)' },
    { value: 'legal_expert', label: 'حقوقدان / وکیل دادگستری' },
    { value: 'children_writer', label: 'نویسنده محتوای کودک و نوجوان' },
    { value: 'critic_arts', label: 'منتقد ادبی / هنری / سینمایی' },
    { value: 'business_consultant', label: 'مشاور کسب و کار / مربی کارآفرینی' },
    { value: 'environmentalist', label: 'متخصص محیط زیست / فعال پایداری' },
  ];

  let pageEstimate = '';
  let isLoading = false;
  let generatedPrompt = '';
  let showOutput = false;
  let localSelectedRoleInfo = null;

  selectedRoleForForm.subscribe(roleData => {
    if (roleData && (roleData.category === 'article' || roleData.category === 'writing' || !roleData.category) ) { // شرط دسته‌بندی را منعطف‌تر کنید
      localSelectedRoleInfo = roleData;
      // اگر نقشی از RoleExplorer آمد، انتخاب دستی را ریست می‌کنیم تا تداخلی نباشد
      selectedRole = 'default'; 
      selectedRoleForForm.set(null); // پاک کردن استور بعد از استفاده
    }
  });

  const WORDS_PER_A4_PAGE_FA = 300;

  $: if (wordCount) {
    const count = parseInt(wordCount);
    if (count && count > 0) {
      pageEstimate = `حدوداً ${pages} صفحه A4.`; // خلاصه تر
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
      isLoading = false; return;
    }
    if (selectedModel.startsWith('google/') && G_API_KEY_STORE !== "AIzaSyC7_BCnYFOtZm4lbNaP1HR5rilgYfwxMDI") {
       alert("خطای داخلی: کلید Gemini نامعتبر است.");
       isLoading = false; return;
    }
    if (!topic || !objective) {
      alert("لطفاً حداقل موضوع و هدف مقاله را مشخص کنید.");
      isLoading = false; return;
    }

    let roleInstruction = '';
    if (localSelectedRoleInfo) {
      roleInstruction = `\n**نقش انتخابی از کاوشگر:** ${localSelectedRoleInfo.act}\n**شرح نقش (به عنوان راهنمای اصلی برای شما):**\n${localSelectedRoleInfo.prompt}\n---`;
    } else if (selectedRole !== 'default') {
      const roleObject = articleRoles.find(r => r.value === selectedRole);
      if (roleObject) {
        // --- اینجا باید کد کامل switch (selectedRole) با تمام case ها و توضیحات دقیق roleInstruction قرار بگیرد ---
        // --- که در پاسخ‌های قبلی مربوط به "تکمیل توضیحات نقش‌ها" ارائه شده بود ---
        // این بخش بسیار طولانی است، شما باید کد کامل را جایگزین کنید. من فقط یک نمونه می‌گذارم:
        switch (selectedRole) {
            case 'academician': roleInstruction = `\n**نقش انتخابی (دستی):** استاد دانشگاه / پژوهشگر آکادمیک\n**توضیحات نقش:** شما به عنوان یک **استاد دانشگاه یا پژوهشگر آکادمیک برجسته** عمل خواهید کرد... (توضیحات کامل نقش از قبل)...`; break;
            case 'essay_writer': roleInstruction = `\n**نقش انتخابی (دستی):** مقاله‌نویس / انشا نویس حرفه‌ای\n**توضیحات نقش:** شما به عنوان یک **مقاله‌نویس ماهر و انشا نویس حرفه‌ای** عمل خواهید کرد... (توضیحات کامل نقش از قبل)...`; break;
            // ... و به همین ترتیب برای تمام نقش‌های دستی دیگر ...
            default: roleInstruction = `\n**نقش انتخابی (دستی):** ${roleObject.label}\n**توضیحات نقش:** لطفاً با در نظر گرفتن ویژگی‌های این نقش، مقاله را تهیه کنید.`;
        }
      }
    }

    // تعریف userPromptForLLM باید اینجا، بعد از ساخت roleInstruction باشد
    let userPromptForLLM = `
یک پرامپت بسیار جامع، دقیق و حرفه‌ای برای نوشتن یک مقاله با مشخصات زیر تولید کن. این پرامپت باید به گونه‌ای باشد که یک نویسنده (انسان یا هوش مصنوعی) بتواند با استفاده از آن، مقاله‌ای کامل و با کیفیت تولید کند. تمام جزئیات ارائه شده را در پرامپت نهایی لحاظ کن و آن را به شکلی ساختاریافته و قابل فهم ارائه بده.
${roleInstruction}

**جزئیات مقاله درخواستی:**
1.  **موضوع اصلی مقاله:** ${topic}
2.  **هدف اصلی از نگارش مقاله:** ${objective}
3.  **سبک نوشتار مورد نظر:** ${style}
4.  **زبان مقاله:** ${language}
5.  **تعداد کلمات تقریبی:** ${wordCount || 'مشخص نشده، اما جامع باشد'} ${pageEstimate ? `(${pageEstimate})` : ''}
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
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel.split('/')[1]}:generateContent?key=${G_API_KEY_STORE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPromptForLLM }] }],
            generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 8192 }
          })
        });
        data = await response.json();
        if (!response.ok || data.error) {
          const errorMessage = data.error ? data.error.message : `HTTP error! status: ${response.status}`;
          alert("خطا از Gemini: " + errorMessage + (data.error?.details ? `\nDetails: ${JSON.stringify(data.error.details)}` : ''));
          isLoading = false; return;
        }
        resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی از Gemini دریافت نشد.";
      } else {
        if (!openRouterApiKey) {
          alert("لطفاً کلید API OpenRouter را در بخش تنظیمات وارد کنید.");
          isLoading = false; return;
        }
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${openRouterApiKey}`,
            "HTTP-Referer": "https://your-site-name.vercel.app", // آدرس سایت خودتان
            "X-Title": "PromptSuite" // نام اپلیکیشن شما
          },
          body: JSON.stringify({ model: selectedModel, messages: [{ role: "user", content: userPromptForLLM }] })
        });
        data = await response.json();
        if (!response.ok || data.error) {
          const errorMessage = data.error ? data.error.message : `HTTP error! status: ${response.status}`;
          alert("خطا از OpenRouter: " + errorMessage);
          isLoading = false; return;
        }
        resultText = data.choices?.[0]?.message?.content || "پاسخی از OpenRouter دریافت نشد.";
      }
      generatedPrompt = resultText.trim();
      showOutput = true;
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

  function copyPrompt() { /* ... کد مثل قبل ... */ }
  function savePrompt() { /* ... کد مثل قبل ... */ }

  // استفاده از کلاس‌های تعریف شده در app.css یا کلاس‌های پیش‌فرض Tailwind
  // این‌ها کلاس‌های تم تیره قبلی هستند، اگر تم جدیدی دارید، آن‌ها را آپدیت کنید
  const inputFieldClass = "input-field-dark"; // یا input-field-space اگر تم جدید است
  const inputLabelClass = "input-label-dark"; // یا input-label-space
  const selectFieldClass = "select-field-dark"; // یا select-field-space (برای select ها)
  const descriptionTextClass = "text-xs text-custom-gray-400 mt-1"; // یا text-gray-500 برای تم روشن
  const fieldsetLegendClass = "fieldset-legend-dark"; // یا fieldset-legend-space

</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-8">
  <fieldset class="border border-custom-gray-700 p-4 rounded-lg shadow-sm bg-custom-gray-800"> <!-- استایل تم تیره -->
    <legend class="{fieldsetLegendClass}">۱. اطلاعات پایه مقاله</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div><label for="topic" class="{inputLabelClass}">موضوع اصلی مقاله <span class="text-red-500">*</span>:</label><input type="text" id="topic" bind:value={topic} class="{inputFieldClass}" placeholder="مثلاً: تأثیر هوش مصنوعی..." required/></div>
      <div><label for="objective" class="{inputLabelClass}">هدف اصلی مقاله <span class="text-red-500">*</span>:</label><input type="text" id="objective" bind:value={objective} class="{inputFieldClass}" placeholder="مثلاً: تحلیل چالش‌ها..." required/></div>
    </div>
  </fieldset>

  <!-- نمایش اطلاعات نقش انتخاب شده از RoleExplorer -->
  {#if localSelectedRoleInfo}
  <div class="my-4 p-3 bg-custom-indigo-600/20 border border-custom-indigo-400 rounded-md text-sm"> <!-- استایل برای تم تیره -->
    <p class="font-semibold text-custom-indigo-300">نقش انتخاب شده از کاوشگر: <span class="font-bold text-white">{localSelectedRoleInfo.act}</span></p>
    <p class="mt-1 text-custom-gray-300 line-clamp-3">شرح: {localSelectedRoleInfo.prompt}</p>
    <button type="button" on:click={() => localSelectedRoleInfo = null} class="mt-2 text-xs text-red-400 hover:text-red-300 underline">پاک کردن نقش انتخابی</button>
  </div>
  {/if}

  <!-- دراپ‌دان دستی نقش‌ها (فقط اگر نقشی از کاوشگر انتخاب نشده باشد یا کاربر بخواهد تغییر دهد) -->
  <div class="mt-5"> <!-- این بخش می‌تواند داخل یک فیلدست دیگر هم باشد -->
    <label for="article-role-manual" class="{inputLabelClass}">یا انتخاب نقش به صورت دستی:</label>
    <select id="article-role-manual" bind:value={selectedRole} class="{selectFieldClass}"
            on:change={() => localSelectedRoleInfo = null}>
      {#each articleRoles as role}
        <option value="{role.value}">{role.label}</option>
      {/each}
    </select>
    <p class="{descriptionTextClass}">اگر نقشی از "کاوشگر نقش‌ها" انتخاب کرده‌اید، نیازی به انتخاب از اینجا نیست مگر بخواهید آن را لغو کنید.</p>
  </div>

  <!-- ... بقیه فیلدست‌ها (جزئیات محتوا، منابع، لحن، تنظیمات فنی) با استایل تم تیره ... -->
  <!-- مثال برای یک فیلدست: -->
  <fieldset class="border border-custom-gray-700 p-4 rounded-lg shadow-sm bg-custom-gray-800">
    <legend class="{fieldsetLegendClass}">۲. جزئیات محتوا و ساختار</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div>
        <label for="style" class="{inputLabelClass}">سبک نوشتار:</label>
        <select id="style" bind:value={style} class="{selectFieldClass}">
          <option>آکادمیک و پژوهشی</option>
          <option>ژورنالیستی و خبری</option>
          <!-- ... سایر آپشن‌ها ... -->
        </select>
      </div>
      <!-- ... سایر فیلدهای این فیلدست ... -->
    </div>
    <!-- ... -->
  </fieldset>
  
  <!-- بخش تنظیمات API و مدل -->
  <fieldset class="border border-custom-gray-700 p-4 rounded-lg shadow-sm bg-custom-gray-800">
    <legend class="{fieldsetLegendClass}">۵. تنظیمات فنی</legend>
    <div class="grid grid-cols-1 gap-4 mt-4">
      <div>
        <label for="modelSelect" class="{inputLabelClass}">مدل هوش مصنوعی:</label>
        <select id="modelSelect" bind:value={selectedModel} class="{selectFieldClass}">
          <option value="google/gemini-1.5-flash-latest">Gemini 1.5 Flash (Google)</option>
          <option value="openai/gpt-4o">GPT-4o (OpenAI)</option>
          <!-- ... سایر آپشن‌های مدل ... -->
        </select>
      </div>
      {#if selectedModel.startsWith('google/')}
        <div class="mt-1">
          <label for="geminiApiKeyDisplay" class="{inputLabelClass}">🔑 کلید API (Google):</label>
          <input type="text" id="geminiApiKeyDisplay" value="{G_API_KEY_STORE}" class="{inputFieldClass} bg-custom-gray-900 text-custom-gray-500 cursor-not-allowed" readonly disabled/>
          <p class="{descriptionTextClass}">کلید پیش‌فرض Gemini. مدیریت از <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-custom-indigo-400 hover:underline">Google AI Studio</a>.</p>
        </div>
      {:else}
       <div class="mt-1">
         <label for="openRouterApiKeyInfo" class="{inputLabelClass}">🔑 کلید API (OpenRouter):</label>
         {#if openRouterApiKey}
           <input type="text" id="openRouterApiKeyInfo" value="کلید OpenRouter در تنظیمات وارد شده." class="{inputFieldClass} bg-custom-gray-900 text-green-400 cursor-not-allowed" readonly disabled/>
         {:else}
           <input type="text" id="openRouterApiKeyInfo" value="کلید OpenRouter وارد نشده!" class="{inputFieldClass} bg-custom-gray-900 text-red-500 cursor-not-allowed" readonly disabled/>
         {/if}
         <p class="{descriptionTextClass}">برای مدل‌های غیر Gemini، کلید OpenRouter را از <button type="button" on:click={() => activeTab.set('settings')} class="text-custom-indigo-400 hover:underline font-semibold bg-transparent border-none p-0">تنظیمات API</button> وارد کنید.</p>
       </div>
      {/if}
    </div>
  </fieldset>

  <button type="submit" disabled={isLoading} class="w-full flex items-center justify-center btn-primary-dark !mt-10 disabled:!bg-custom-gray-600 disabled:cursor-not-allowed"> <!-- کلاس دکمه تم تیره -->
    {#if isLoading}
      <!-- ... SVG spinner ... -->
      <span>در حال پردازش...</span>
    {:else}
      <span>🔄 تولید پرامپت حرفه‌ای</span>
    {/if}
  </button>
</form>

{#if showOutput}
<div id="generatedPromptOutput" class="bg-custom-gray-700 p-6 rounded-lg border border-custom-gray-600 space-y-4 mt-10 shadow-lg"> <!-- استایل تم تیره -->
  <h2 class="text-xl font-semibold text-custom-indigo-400">📝 پرامپت تولید شده:</h2>
  <textarea bind:value={generatedPrompt} class="w-full h-96 p-3 rounded-md border-custom-gray-500 bg-custom-gray-800 text-custom-gray-200 text-sm leading-relaxed focus:ring-custom-indigo-400 focus:border-custom-indigo-400 shadow-inner" readonly placeholder="..."></textarea>
  <div class="flex flex-wrap gap-3 mt-4">
    <button on:click={copyPrompt} class="btn-secondary-dark bg-custom-green-600 hover:bg-custom-green-600/90 focus:ring-custom-green-600/50">📋 کپی پرامپت</button> <!-- استایل تم تیره -->
    <button on:click={savePrompt} class="btn-secondary-dark bg-custom-yellow-500 hover:bg-custom-yellow-500/90 focus:ring-custom-yellow-500/50 text-custom-gray-900">💾 ذخیره به‌عنوان فایل</button> <!-- استایل تم تیره -->
  </div>
</div>
{/if}

<style>
  textarea { resize: vertical; }
  .line-clamp-3 { /* برای نمایش خلاصه نقش */
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
</style>