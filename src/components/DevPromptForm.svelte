<script>
  // Logic for development prompt form will go here
  export let openRouterApiKey; // Will be needed if it uses OpenRouter

  // Example state
  let taskDescription = '';
  let targetLanguage = 'Python';
  let constraints = '';
  let outputFormat = 'کد کامل با توضیحات';

  let isLoading = false;
  let generatedDevPrompt = '';
  let showOutput = false;

  const inputFieldClass = "w-full bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const inputLabelClass = "block text-sm font-medium text-gray-300 mb-1";
  const fieldsetLegendClass = "font-semibold text-lg text-indigo-400 px-2";


  async function handleSubmitDevPrompt() {
    if (!openRouterApiKey) {
        alert("لطفاً کلید API OpenRouter را در بخش تنظیمات وارد کنید.");
        return;
    }
    // TODO: Implement API call logic similar to ArticlePromptForm
    // For now, just a placeholder
    isLoading = true;
    showOutput = false;
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    generatedDevPrompt = `
پرامپت برای توسعه نرم‌افزار:
- وظیفه: ${taskDescription}
- زبان برنامه‌نویسی: ${targetLanguage}
- محدودیت‌ها: ${constraints || 'ندارد'}
- فرمت خروجی: ${outputFormat}

(این یک پرامپت نمونه است. منطق کامل در آینده پیاده‌سازی خواهد شد.)
    `;
    showOutput = true;
    isLoading = false;
  }
</script>

<div class="bg-gray-750 p-6 rounded-lg shadow-inner">
  <h2 class="text-2xl font-semibold text-indigo-300 mb-6 border-b border-gray-600 pb-3">
    ایجاد پرامپت برای توسعه نرم‌افزار
  </h2>
  <form on:submit|preventDefault={handleSubmitDevPrompt} class="space-y-6">
    <fieldset class="border border-gray-600 p-4 rounded-md">
      <legend class="{fieldsetLegendClass}">۱. مشخصات وظیفه</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label for="dev-task" class="{inputLabelClass}">شرح وظیفه یا قابلیت مورد نظر:</label>
          <textarea id="dev-task" bind:value={taskDescription} rows="3" class="{inputFieldClass}" placeholder="مثلاً: تابعی بنویس که یک لیست از اعداد را گرفته و میانگین آن‌ها را برگرداند."></textarea>
        </div>
        <div>
          <label for="dev-language" class="{inputLabelClass}">زبان برنامه‌نویسی یا تکنولوژی هدف:</label>
          <select id="dev-language" bind:value={targetLanguage} class="{inputFieldClass}">
            <option>Python</option>
            <option>JavaScript</option>
            <option>Java</option>
            <option>C#</option>
            <option>Go</option>
            <option>Rust</option>
            <option>SQL</option>
            <option>Bash Script</option>
            <option>Dockerfile</option>
            <option>سایر (در توضیحات ذکر شود)</option>
          </select>
        </div>
      </div>
    </fieldset>

     <fieldset class="border border-gray-600 p-4 rounded-md">
      <legend class="{fieldsetLegendClass}">۲. جزئیات و محدودیت‌ها</legend>
      <div class="mt-4">
        <label for="dev-constraints" class="{inputLabelClass}">محدودیت‌ها یا نکات خاص (اختیاری):</label>
        <textarea id="dev-constraints" bind:value={constraints} rows="3" class="{inputFieldClass}" placeholder="مثلاً: از کتابخانه خاصی استفاده نشود، کد باید بهینه باشد، شامل تست‌های واحد باشد."></textarea>
      </div>
      <div class="mt-4">
        <label for="dev-output" class="{inputLabelClass}">فرمت خروجی مورد انتظار:</label>
        <select id="dev-output" bind:value={outputFormat} class="{inputFieldClass}">
          <option>کد کامل با توضیحات</option>
          <option>فقط قطعه کد اصلی</option>
          <option>توضیح مراحل پیاده‌سازی</option>
          <option>دیاگرام یا فلوچارت (در صورت امکان)</option>
        </select>
      </div>
    </fieldset>

    <button type="submit" disabled={isLoading} class="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-lg font-semibold transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed">
      {#if isLoading}
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>در حال ایجاد پرامپت توسعه...</span>
      {:else}
        <span>🚀 ایجاد پرامپت توسعه</span>
      {/if}
    </button>
  </form>

  {#if showOutput}
  <div class="bg-gray-700 p-6 rounded-lg border border-gray-600 space-y-4 mt-10 shadow-lg">
    <h2 class="text-xl font-semibold text-cyan-300">💻 پرامپت توسعه تولید شده:</h2>
    <textarea bind:value={generatedDevPrompt} class="w-full h-60 p-3 rounded-md border border-gray-500 bg-gray-800 text-gray-200 text-sm leading-relaxed focus:ring-cyan-500 focus:border-cyan-500" readonly></textarea>
    <!-- Add copy/save buttons if needed -->
  </div>
  {/if}
</div>