<script>
  import { onMount } from 'svelte';
  import Papa from 'papaparse';
  import { activeTab, selectedRoleForForm } from '../lib/stores.js'; // استورها

  let allPrompts = []; // تمام پرامپت‌های لود شده
  let displayedPrompts = []; // پرامپت‌هایی که نمایش داده می‌شوند (بعد از فیلتر و جستجو)
  let loading = true;
  let error = null;
  let searchTerm = '';
  let selectedCategory = 'all'; // برای فیلتر بر اساس دسته بندی (اگر بخواهیم اضافه کنیم)

  // URL مستقیم به فایل CSV
  const DATASET_URL = 'https://huggingface.co/datasets/fka/awesome-chatgpt-prompts/raw/main/prompts.csv';
  // لینک URL که Gemini داده بود ('https://www.google.com/url?sa=E&source=gmail&q=https://huggingface.co/datasets/fka/awesome-chatgpt-prompts/raw/main/prompts.csv')
  // یک لینک ریدایرکت گوگل است. بهتر است از لینک مستقیم huggingface استفاده کنیم.

  onMount(async () => {
    try {
      const response = await fetch(DATASET_URL);
      if (!response.ok) {
        throw new Error(`خطا در دریافت دیتاست: ${response.status} ${response.statusText}`);
      }
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,       // سطر اول نام ستون‌هاست
        skipEmptyLines: true, // رد کردن سطرهای خالی
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("خطاهای Papaparse:", results.errors);
            error = "خطا در تجزیه بخشی از دیتاست. برخی ردیف‌ها ممکن است مشکل داشته باشند.";
            // حتی با خطا، ممکن است بخشی از داده‌ها قابل استفاده باشند
          }
          // فیلتر کردن ردیف‌هایی که act یا prompt ندارند
          allPrompts = results.data.filter(p => p.act && p.act.trim() !== '' && p.prompt && p.prompt.trim() !== '');
          displayedPrompts = allPrompts; // در ابتدا همه را نمایش بده
          loading = false;
        },
        error: (err) => {
          console.error("خطای کلی Papaparse:", err);
          error = `خطا در تجزیه CSV: ${err.message}`;
          loading = false;
        }
      });
    } catch (e) {
      console.error("خطا در fetch دیتاست:", e);
      error = `خطا در بارگذاری دیتاست: ${e.message}`;
      loading = false;
    }
  });

  // تابع برای جستجو
  $: if (searchTerm || selectedCategory) {
    let filtered = allPrompts;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.act && p.act.toLowerCase().includes(lowerSearchTerm)) ||
        (p.prompt && p.prompt.toLowerCase().includes(lowerSearchTerm))
      );
    }
    // اینجا می‌توانید منطق فیلتر بر اساس selectedCategory را اضافه کنید
    // اگر یک ستون 'category' به دیتاست اضافه کنید یا بر اساس کلمات کلیدی در 'act' یا 'prompt' دسته‌بندی کنید.
    // برای مثال:
    // if (selectedCategory !== 'all') {
    //   filtered = filtered.filter(p => p.category === selectedCategory); // فرض وجود فیلد category
    // }
    displayedPrompts = filtered;
  } else {
    displayedPrompts = allPrompts;
  }

  function useThisRole(promptData) {
    // اینجا باید تصمیم بگیریم که این نقش برای کدام فرم مناسب است
    // فعلا یک دسته‌بندی ساده بر اساس کلمات کلیدی در 'act' انجام می‌دهیم
    // این بخش نیاز به بهبود و هوشمندی بیشتر دارد
    let categoryTarget = 'article'; // پیش‌فرض
    const actLower = promptData.act.toLowerCase();

    if (actLower.includes('developer') || actLower.includes('code') || actLower.includes('program') || actLower.includes('linux') || actLower.includes('interpreter') || actLower.includes('solidity') || actLower.includes('python') || actLower.includes('javascript')) {
      categoryTarget = 'development';
    } else if (actLower.includes('storyteller') || actLower.includes('poet') || actLower.includes('screenwriter')) {
      categoryTarget = 'creative';
    }
    // ... سایر دسته‌بندی‌ها

    selectedRoleForForm.set({
      id: promptData.act.replace(/\s+/g, '_').toLowerCase(), // یک ID ساده از act
      act: promptData.act,
      prompt: promptData.prompt,
      category: categoryTarget // برای هدایت به تب درست
    });
    activeTab.set(categoryTarget); // تغییر به تب مربوطه
  }
</script>

<div class="w-full space-y-6 p-1">
  <h2 class="h2-neon text-center mb-8">کاوشگر نقش‌ها و پرامپت‌ها</h2>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-primary"></div>
      <p class="ml-3 text-space-text-secondary">در حال بارگذاری پرامپت‌ها...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline"> متاسفانه در بارگذاری دیتاست مشکلی پیش آمد: {error}</span>
    </div>
  {:else}
    <div class="mb-6">
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="جستجو در عنوان یا متن پرامپت..."
        class="input-field-space w-full !py-3" <!-- کمی بزرگتر -->
      />
      <!-- اینجا می‌توانید فیلتر دسته بندی را اضافه کنید -->
    </div>

    {#if displayedPrompts.length === 0}
      <p class="text-center text-space-text-secondary py-10">هیچ پرامپتی با این مشخصات یافت نشد.</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {#each displayedPrompts as p (p.act)} <!-- استفاده از p.act به عنوان کلید منحصر به فرد -->
          <div class="bg-white border border-space-border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div class="p-5 flex-grow">
              <h3 class="text-lg font-semibold text-neon-primary mb-2">{p.act}</h3>
              <p class="text-sm text-space-text-secondary leading-relaxed line-clamp-5"> <!-- نمایش چند خط از پرامپت -->
                {p.prompt}
              </p>
            </div>
            <div class="p-4 bg-gray-50 border-t border-space-border rounded-b-lg">
              <button
                on:click={() => useThisRole(p)}
                class="btn-neon-secondary w-full text-sm !py-2"
              >
                استفاده از این نقش
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .line-clamp-5 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5; /* تعداد خطوطی که نمایش داده می‌شود */
  }
</style>