<script>
  export let openRouterApiKey; // Will be needed if it uses OpenRouter

  let taskDescription = '';
  let targetLanguage = 'Python';
  let constraints = '';
  let outputFormat = 'کد کامل با توضیحات';
  let selectedDevRole = 'default';

  let isLoading = false;
  let generatedDevPrompt = '';
  let showOutput = false;

  const devRoles = [ /* ... (لیست نقش‌های توسعه مثل قبل) ... */
    { value: 'default', label: 'بدون نقش خاص / توسعه‌دهنده عمومی' },
    { value: 'senior_frontend', label: 'توسعه‌دهنده ارشد فرانت‌اند' },
    { value: 'fullstack_dev', label: 'توسعه‌دهنده نرم‌افزار فول‌استک' },
    { value: 'python_interpreter', label: 'مفسر پایتون (برای تست کد)' },
    { value: 'qa_tester', label: 'تستر تضمین کیفیت نرم‌افزار' },
    { value: 'linux_terminal', label: 'ترمینال لینوکس (برای دستورات شل)' },
    { value: 'regex_generator', label: 'تولیدکننده عبارت منظم (Regex)' },
    { value: 'tech_reviewer', label: 'منتقد فنی / بررسی‌کننده فناوری' },
    { value: 'ux_ui_developer', label: 'توسعه‌دهنده تجربه و رابط کاربری (UX/UI)' },
    { value: 'tech_writer_dev', label: 'نویسنده فنی (برای مستندات کد/API)' },
  ];


  const inputFieldClass = "input-field-space";
  const inputLabelClass = "input-label-space";
  const selectFieldClass = "select-field-space";
  const fieldsetLegendClass = "font-semibold text-lg neon-text-primary px-2 filter drop-shadow-[0_0_3px_theme(colors.neon-primary/0.5)]";


  async function handleSubmitDevPrompt() { /* ... (منطق handleSubmitDevPrompt مثل قبل با roleInstructionDev) ... */
    if (!taskDescription) { /* ... */ isLoading = false; return; }
    isLoading = true;
    showOutput = false;
    let roleInstructionDev = '';
    // ... (ساخت roleInstructionDev بر اساس selectedDevRole) ...
    const userPromptForDevLLM = `... ${roleInstructionDev} ...`;
    // Placeholder:
    await new Promise(resolve => setTimeout(resolve, 500));
    generatedDevPrompt = `پرامپت پیشنهادی (توسعه):\n${userPromptForDevLLM}`;
    showOutput = true;
    isLoading = false;
  }
</script>

<div class="bg-white p-6 rounded-lg shadow-card-light border border-space-border">
  <h2 class="text-2xl font-semibold neon-text-primary mb-6 border-b border-space-border pb-3 filter drop-shadow-[0_0_3px_theme(colors.neon-primary/0.5)]">
    ایجاد پرامپت برای توسعه نرم‌افزار
  </h2>
  <form on:submit|preventDefault={handleSubmitDevPrompt} class="space-y-6">
    <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white">
      <legend class="{fieldsetLegendClass}">۱. مشخصات وظیفه</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
        <div>
          <label for="dev-task" class="{inputLabelClass}">شرح وظیفه یا قابلیت <span class="text-neon-accent">*</span>:</label>
          <textarea id="dev-task" bind:value={taskDescription} rows="3" class="{inputFieldClass}" placeholder="مثلاً: تابعی برای محاسبه میانگین لیست اعداد" required></textarea>
        </div>
        <div>
          <label for="dev-language" class="{inputLabelClass}">زبان/تکنولوژی هدف:</label>
          <select id="dev-language" bind:value={targetLanguage} class="{selectFieldClass}">
            <option>Python</option> <option>JavaScript</option> <option>Java</option> <option>C#</option> <option>Go</option> <option>Rust</option> <option>SQL</option> <option>Bash Script</option> <option>Dockerfile</option> <option>Svelte</option> <option>React</option> <option>Vue</option> <option>سایر</option>
          </select>
        </div>
      </div>
      <div class="mt-5">
        <label for="dev-role" class="{inputLabelClass}">نقش توسعه‌دهنده:</label>
        <select id="dev-role" bind:value={selectedDevRole} class="{selectFieldClass}">
          {#each devRoles as role}
            <option value="{role.value}">{role.label}</option>
          {/each}
        </select>
      </div>
    </fieldset>

     <fieldset class="border border-space-border p-4 rounded-lg shadow-sm bg-white">
      <legend class="{fieldsetLegendClass}">۲. جزئیات و محدودیت‌ها</legend>
      <div class="mt-4">
        <label for="dev-constraints" class="{inputLabelClass}">محدودیت‌ها یا نکات خاص (اختیاری):</label>
        <textarea id="dev-constraints" bind:value={constraints} rows="3" class="{inputFieldClass}" placeholder="مثلاً: عدم استفاده از کتابخانه X، بهینه‌سازی برای سرعت"></textarea>
      </div>
      <div class="mt-4">
        <label for="dev-output" class="{inputLabelClass}">فرمت خروجی مورد انتظار:</label>
        <select id="dev-output" bind:value={outputFormat} class="{selectFieldClass}">
          <option>کد کامل با توضیحات</option> <option>فقط قطعه کد اصلی</option> <option>توضیح مراحل پیاده‌سازی</option> <option>دیاگرام یا فلوچارت</option> <option>اسکریپت کامل</option> <option>راهنمای استفاده (README)</option>
        </select>
      </div>
    </fieldset>

    <button type="submit" disabled={isLoading} class="w-full flex items-center justify-center btn-neon-primary text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none !mt-8">
      {#if isLoading}
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" <!-- ... --></svg>
        <span>در حال ایجاد پرامپت توسعه...</span>
      {:else}
        <span><i class="fas fa-cogs mr-2"></i> ایجاد پرامپت توسعه</span>
      {/if}
    </button>
  </form>

  {#if showOutput}
  <div class="bg-white p-6 rounded-lg border border-space-border space-y-4 mt-10 shadow-card-light">
    <h2 class="text-xl font-semibold neon-text-primary filter drop-shadow-[0_0_3px_theme(colors.neon-primary/0.5)]">💻 پرامپت توسعه تولید شده:</h2>
    <textarea bind:value={generatedDevPrompt} class="w-full h-60 p-3 rounded-md border-gray-300 bg-gray-50 text-space-text text-sm leading-relaxed focus:ring-neon-primary focus:border-neon-primary shadow-inner" readonly></textarea>
    <!-- Add copy/save buttons if needed, similar to ArticlePromptForm -->
  </div>
  {/if}
</div>