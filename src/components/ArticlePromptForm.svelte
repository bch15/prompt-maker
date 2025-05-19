<script>
  import { onMount } from 'svelte';
  import { geminiApiKey as G_API_KEY_STORE, activeTab } from '../lib/stores.js';
  export let openRouterApiKey;

  // ... (تمام منطق جاوااسکریپت، تعریف articleRoles و توضیحات کامل نقش‌ها مثل قبل) ...
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
  let selectedRole = 'default';

  let pageEstimate = '';
  let isLoading = false;
  let generatedPrompt = '';
  let showOutput = false;

  const WORDS_PER_A4_PAGE_FA = 300;

  const articleRoles = [
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

  $: if (wordCount) { /* ... */ }

  async function handleSubmit() { /* ... (کد کامل handleSubmit با roleInstruction های تکمیل شده از پاسخ قبلی) ... */
    isLoading = true;
    showOutput = false;
    const currentApiKey = selectedModel.startsWith('google/') ? G_API_KEY_STORE : openRouterApiKey;
    if (!currentApiKey && !selectedModel.startsWith('google/')) { /* ... */ isLoading = false; return; }
    if (selectedModel.startsWith('google/') && G_API_KEY_STORE !== "AIzaSyC7_BCnYFOtZm4lbNaP1HR5rilgYfwxMDI") { /* ... */ isLoading = false; return; }
    if (!topic || !objective) { /* ... */ isLoading = false; return; }

    let roleInstruction = '';
    const roleObject = articleRoles.find(r => r.value === selectedRole);
    if (selectedRole !== 'default' && roleObject) {
      switch (selectedRole) {
        case 'academician': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **استاد دانشگاه یا پژوهشگر آکادمیک برجسته** عمل خواهید کرد...`; break;
        case 'essay_writer': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **مقاله‌نویس ماهر و انشا نویس حرفه‌ای** عمل خواهید کرد...`; break;
        case 'journalist': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **روزنامه‌نگار تحقیقی یا گزارشگر ویژه** با تجربه و متعهد به اصول حرفه‌ای فعالیت می‌کنید...`; break;
        case 'storyteller': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **داستان‌گو یا روایت‌گر خلاق و ماهر** عمل می‌کنید...`; break;
        case 'tech_writer': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **نویسنده فنی (Technical Writer) متخصص و دقیق** عمل می‌کنید...`; break;
        case 'screenwriter': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **فیلم‌نامه‌نویس یا نمایشنامه‌نویس خلاق و حرفه‌ای** عمل می‌کنید...`; break;
        case 'poet': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **شاعر با ذوق و مسلط به فنون شعری** عمل می‌کنید...`; break;
        case 'content_creator': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **تولیدکننده محتوای دیجیتال خلاق و استراتژیک (Content Creator)** برای پلتفرم‌های آنلاین عمل می‌کنید...`; break;
        case 'gov_spokesperson': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان **سخنگوی رسمی یک نهاد دولتی یا مسئول ارشد روابط عمومی یک سازمان بزرگ دولتی** عمل خواهید کرد...`; break;
        case 'political_analyst': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **تحلیلگر برجسته و مستقل مسائل سیاسی داخلی یا روابط بین‌الملل** با دیدگاهی عمیق و چندوجهی فعالیت می‌کنید...`; break;
        case 'economic_analyst': roleInstruction = `\n**نقش شما (نویسنده):** شما در نقش یک **کارشناس ارشد اقتصادی یا تحلیلگر متخصص بازارهای مالی/کالا** با سابقه فعالیت در موسسات پژوهشی یا مالی معتبر هستید...`; break;
        case 'basic_scientist': roleInstruction = `\n**نقش شما (نویسنده):** شما یک **دانشمند و پژوهشگر برجسته در یکی از رشته‌های علوم پایه** با مقالات متعدد در ژورنال‌های معتبر هستید...`; break;
        case 'humanities_scholar': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **پژوهشگر، اندیشمند و استاد دانشگاه در یکی از حوزه‌های علوم انسانی و اجتماعی** با رویکردی انتقادی و تحلیلی عمل می‌کنید...`; break;
        case 'medical_specialist': roleInstruction = `\n**نقش شما (نویسنده):** شما یک **پزشک متخصص در یک رشته خاص یا یک پژوهشگر برجسته در علوم پزشکی و بالینی** هستید...`; break;
        case 'engineering_specialist': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **مهندس متخصص، طراح ارشد، یا پژوهشگر با تجربه و صاحب‌نظر در یکی از گرایش‌های اصلی مهندسی** عمل می‌کنید...`; break;
        case 'legal_expert': roleInstruction = `\n**نقش شما (نویسنده):** شما یک **حقوقدان متبحر، وکیل پایه یک دادگستری با سابقه، یا استاد دانشگاه در رشته حقوق** با تخصص در یک حوزه خاص هستید...`; break;
        case 'children_writer': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **نویسنده خلاق، با تجربه و متخصص در ادبیات کودک و نوجوان** عمل می‌کنید...`; break;
        case 'critic_arts': roleInstruction = `\n**نقش شما (نویسنده):** شما یک **منتقد صاحب‌نظر، با دانش و با سابقه در حوزه تخصصی خود** هستید...`; break;
        case 'business_consultant': roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **مشاور ارشد کسب و کار، استراتژیست، یا مربی کارآفرینی با تجربه عملی و موفقیت‌های قابل ارائه** عمل می‌کنید...`; break;
        case 'environmentalist': roleInstruction = `\n**نقش شما (نویسنده):** شما یک **متخصص برجسته علوم محیط زیست، پژوهشگر تغییرات اقلیمی، یا یک فعال شناخته‌شده و متعهد در زمینه حفاظت از محیط زیست و توسعه پایدار** هستید...`; break;
        default: if (roleObject && selectedRole !== 'default') { roleInstruction = `\n**نقش شما (نویسنده):** شما به عنوان یک **${roleObject.label}** عمل خواهید کرد...`; } else { roleInstruction = ''; }
      }
    }
    let userPromptForLLM = `... ${roleInstruction} ...`; // بقیه ساختار پرامپت مثل قبل
    // ... (بقیه کد fetch و error handling) ...
  }

  function copyPrompt() { /* ... */ }
  function savePrompt() { /* ... */ }

  const inputFieldClass = "input-field-space";
  const inputLabelClass = "input-label-space";
  const descriptionTextClass = "text-xs text-gray-500 mt-1";
  const fieldsetLegendClass = "font-semibold text-lg neon-text-primary px-2 filter drop-shadow-[0_0_3px_theme(colors.neon-primary/0.5)]";
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-8">
  <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white"> {/* پس زمینه سفید برای فیلدست */}
    <legend class="{fieldsetLegendClass}">۱. اطلاعات پایه مقاله</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4"> {/* کاهش gap-y */}
      <div><label for="topic" class="{inputLabelClass}">موضوع اصلی مقاله <span class="text-neon-accent">*</span>:</label><input type="text" id="topic" bind:value={topic} class="{inputFieldClass}" placeholder="مثلاً: تأثیر هوش مصنوعی بر آینده مشاغل" required/></div>
      <div><label for="objective" class="{inputLabelClass}">هدف اصلی مقاله <span class="text-neon-accent">*</span>:</label><input type="text" id="objective" bind:value={objective} class="{inputFieldClass}" placeholder="مثلاً: تحلیل چالش‌ها و فرصت‌ها" required/></div>
    </div>
    <div class="mt-5"> {/* کاهش mt */}
      <label for="article-role" class="{inputLabelClass}">نقش نویسنده:</label>
      <select id="article-role" bind:value={selectedRole} class="select-field-space">
        {#each articleRoles as role}
          <option value="{role.value}">{role.label}</option>
        {/each}
      </select>
      <p class="{descriptionTextClass}">انتخاب نقش به هوش مصنوعی کمک می‌کند تا با دیدگاه و سبک مناسب‌تری پرامپت را تولید کند.</p>
    </div>
  </fieldset>

  <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white">
    <legend class="{fieldsetLegendClass}">۲. جزئیات محتوا و ساختار</legend>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div>
        <label for="style" class="{inputLabelClass}">سبک نوشتار:</label>
        <select id="style" bind:value={style} class="select-field-space">
          <option>آکادمیک و پژوهشی</option> <option>ژورنالیستی و خبری</option> <option>تحلیلی و انتقادی</option> <option>آموزشی و راهنما</option> <option>داستانی و روایی</option> <option>ترغیبی و تبلیغاتی</option> <option>رسمی و اداری</option> <option>علمی-ترویجی (ساده‌سازی شده برای عموم)</option>
        </select>
      </div>
      <div>
        <label for="language" class="{inputLabelClass}">زبان مقاله:</label>
        <select id="language" bind:value={language} class="select-field-space">
          <option>فارسی معیار</option> <option>English (US)</option> <option>English (UK)</option> <option>فارسی با لحن محاوره‌ای (در صورت لزوم)</option>
        </select>
      </div>
      <div>
        <label for="wordCount" class="{inputLabelClass}">تعداد کلمات مورد نظر:</label>
        <input type="number" id="wordCount" bind:value={wordCount} class="{inputFieldClass}" placeholder="مثلاً 2000"/>
        <p class="{descriptionTextClass} min-h-[1rem]">{pageEstimate}</p>
      </div>
      <div>
        <label for="audience" class="{inputLabelClass}">مخاطب هدف:</label>
        <input type="text" id="audience" bind:value={audience} class="{inputFieldClass}" placeholder="مثلاً: دانشجویان، مدیران، متخصصین"/>
      </div>
    </div>
    <div class="mt-5">
      <label for="keywords" class="{inputLabelClass}">کلمات کلیدی اصلی (با کاما جدا کنید):</label>
      <input type="text" id="keywords" bind:value={keywords} class="{inputFieldClass}" placeholder="هوش مصنوعی، بازار کار، اتوماسیون"/>
    </div>
    <div class="mt-5">
      <label for="outline" class="{inputLabelClass}">ساختار یا سرفصل‌های پیشنهادی (اختیاری):</label>
      <textarea id="outline" bind:value={outline} class="{inputFieldClass} min-h-[100px]" rows="4" placeholder="مقدمه
بخش اول: تعریف
نتیجه‌گیری"></textarea>
    </div>
  </fieldset>

  <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white">
    <legend class="{fieldsetLegendClass}">۳. منابع و استنادات</legend>
     <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div>
        <label for="sources" class="{inputLabelClass}">منابع ترجیحی برای تحقیق:</label>
        <select id="sources" bind:value={sources} class="select-field-space">
          <option>مقالات علمی (Google Scholar, PubMed)</option> <option>کتاب‌های مرجع</option> <option>وب‌سایت‌های معتبر</option> <option>گزارش‌های سازمانی</option> <option>ترکیبی از موارد فوق</option>
        </select>
      </div>
      <div>
        <label for="referencingStyle" class="{inputLabelClass}">سبک رفرنس‌دهی (اختیاری):</label>
        <select id="referencingStyle" bind:value={referencingStyle} class="select-field-space">
          <option value="">مهم نیست</option> <option>APA</option> <option>MLA</option> <option>Chicago</option> <option>Harvard</option> <option>Vancouver</option> <option>IEEE</option>
        </select>
      </div>
    </div>
  </fieldset>

  <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white">
    <legend class="{fieldsetLegendClass}">۴. لحن و نکات تکمیلی</legend>
     <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div>
        <label for="tone" class="{inputLabelClass}">لحن کلی مقاله:</label>
        <select id="tone" bind:value={tone} class="select-field-space">
            <option>بی‌طرف و عینی</option> <option>ترغیبی</option> <option>انتقادی</option> <option>خوش‌بینانه</option> <option>محتاط</option> <option>آموزشی</option> <option>رسمی</option> <option>دوستانه</option>
        </select>
      </div>
      <div>
        <label for="perspective" class="{inputLabelClass}">زاویه دید:</label>
        <select id="perspective" bind:value={perspective} class="select-field-space">
          <option>سوم شخص</option> <option>اول شخص</option> <option>دوم شخص</option>
        </select>
      </div>
    </div>
    <div class="mt-5">
      <label for="negativeKeywords" class="{inputLabelClass}">اجتناب از کلمات/عبارات:</label>
      <input type="text" id="negativeKeywords" bind:value={negativeKeywords} class="{inputFieldClass}" placeholder="مثلاً: اصطلاحات خیلی پیچیده"/>
    </div>
    <div class="mt-5">
      <label for="specificInstructions" class="{inputLabelClass}">دستورالعمل‌های خاص (اختیاری):</label>
      <textarea id="specificInstructions" bind:value={specificInstructions} class="{inputFieldClass} min-h-[80px]" rows="3" placeholder="مثلاً: شامل یک مثال واقعی از ایران باشد."></textarea>
    </div>
    <div class="mt-5">
      <label for="notes" class="{inputLabelClass}">یادداشت برای سازنده پرامپت:</label>
      <textarea id="notes" bind:value={notes} class="{inputFieldClass} min-h-[80px]" rows="3" placeholder="هر نکته‌ای برای بهبود پرامپت."></textarea>
    </div>
  </fieldset>

  <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white">
    <legend class="{fieldsetLegendClass}">۵. تنظیمات فنی</legend>
    <div class="grid grid-cols-1 gap-4 mt-4"> {/* یک ستونه برای این بخش */}
      <div>
        <label for="modelSelect" class="{inputLabelClass}">مدل هوش مصنوعی برای تولید پرامپت:</label>
        <select id="modelSelect" bind:value={selectedModel} class="select-field-space">
          <option value="google/gemini-1.5-flash-latest">Gemini 1.5 Flash (Google)</option>
          <option value="openai/gpt-4o">GPT-4o (OpenAI via OpenRouter)</option>
          <option value="openai/gpt-4-turbo">GPT-4 Turbo (OpenAI via OpenRouter)</option>
          <option value="anthropic/claude-3.5-sonnet-20240620">Claude 3.5 Sonnet (Anthropic via OpenRouter)</option>
          <option value="anthropic/claude-3-opus-20240229">Claude 3 Opus (Anthropic via OpenRouter)</option>
          <option value="anthropic/claude-3-haiku-20240307">Claude 3 Haiku (Anthropic via OpenRouter)</option>
        </select>
      </div>
      {#if selectedModel.startsWith('google/')}
        <div class="mt-1">
          <label for="geminiApiKeyDisplay" class="{inputLabelClass}">🔑 کلید API (Google AI Studio):</label>
          <input type="text" id="geminiApiKeyDisplay" value="{G_API_KEY_STORE}" class="{inputFieldClass} bg-gray-100 text-gray-500 cursor-not-allowed" readonly disabled/>
          <p class="{descriptionTextClass}">کلید پیش‌فرض Gemini. مدیریت از <a href="https://aistudio.google.com/app/apikey" target="_blank" class="neon-text-primary hover:underline">Google AI Studio</a>.</p>
        </div>
      {:else}
       <div class="mt-1">
         <label for="openRouterApiKeyInfo" class="{inputLabelClass}">🔑 کلید API (OpenRouter):</label>
         {#if openRouterApiKey}
           <input type="text" id="openRouterApiKeyInfo" value="کلید OpenRouter در تنظیمات وارد شده." class="{inputFieldClass} bg-gray-100 text-green-600 cursor-not-allowed" readonly disabled/>
         {:else}
           <input type="text" id="openRouterApiKeyInfo" value="کلید OpenRouter وارد نشده!" class="{inputFieldClass} bg-gray-100 text-neon-accent cursor-not-allowed" readonly disabled/>
         {/if}
         <p class="{descriptionTextClass}">برای مدل‌های غیر Gemini، کلید OpenRouter را از <button type="button" on:click={() => activeTab.set('settings')} class="neon-text-primary hover:underline font-semibold">تنظیمات API</button> وارد کنید.</p>
       </div>
      {/if}
    </div>
  </fieldset>

  <button type="submit" disabled={isLoading} class="w-full flex items-center justify-center btn-neon-primary text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none !mt-10"> {/* افزایش mt و ! برای اولویت */}
    {#if isLoading}
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <span>در حال پردازش...</span>
    {:else}
      <span><i class="fas fa-rocket mr-2"></i> تولید پرامپت حرفه‌ای</span> {/* آیکون نمونه اگر FontAwesome دارید */}
    {/if}
  </button>
</form>

{#if showOutput}
<div id="generatedPromptOutput" class="bg-white p-6 rounded-lg border border-space-border space-y-4 mt-10 shadow-card-light">
  <h2 class="text-xl font-semibold neon-text-primary filter drop-shadow-[0_0_3px_theme(colors.neon-primary/0.5)]">📝 پرامپت تولید شده:</h2>
  <textarea bind:value={generatedPrompt} class="w-full h-96 p-3 rounded-md border-gray-300 bg-gray-50 text-space-text text-sm leading-relaxed focus:ring-neon-primary focus:border-neon-primary shadow-inner" readonly placeholder="پرامپت تولید شده در اینجا نمایش داده می‌شود..."></textarea>
  <div class="flex flex-wrap gap-3 mt-4">
    <button on:click={copyPrompt} class="btn-neon-secondary"><i class="far fa-copy mr-2"></i>کپی پرامپت</button>
    <button on:click={savePrompt} class="btn-neon-secondary"><i class="far fa-save mr-2"></i>ذخیره به‌عنوان فایل</button>
  </div>
</div>
{/if}

<style>
  textarea { resize: vertical; }
  /* برای آیکون‌ها، اگر از FontAwesome استفاده می‌کنید، باید آن را به پروژه اضافه کنید */
  /* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'); */
</style>