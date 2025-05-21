  <script>
    import { onMount } from 'svelte';
    import Papa from 'papaparse';
    import { activeTab, selectedRoleForForm } from '../lib/stores.js';

    let allPrompts = [];
    let displayedPrompts = [];
    let loading = true;
    let error = null;
    let searchTerm = '';
    let selectedCategory = 'all'; // برای فیلتر آینده

    const DATASET_URL = 'https://huggingface.co/datasets/fka/awesome-chatgpt-prompts/raw/main/prompts.csv';

    onMount(async () => {
      try {
        const response = await fetch(DATASET_URL);
        if (!response.ok) {
          throw new Error(`خطا در دریافت دیتاست: ${response.status} ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("خطاهای Papaparse:", results.errors);
              error = "خطا در تجزیه بخشی از دیتاست.";
            }
            allPrompts = results.data.filter(p => p.act && p.act.trim() !== '' && p.prompt && p.prompt.trim() !== '');
            displayedPrompts = allPrompts;
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

    $: if (searchTerm || selectedCategory) {
      let filtered = allPrompts;
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
          (p.act && p.act.toLowerCase().includes(lowerSearchTerm)) ||
          (p.prompt && p.prompt.toLowerCase().includes(lowerSearchTerm))
        );
      }
      // TODO: منطق فیلتر بر اساس selectedCategory
      displayedPrompts = filtered;
    } else {
      displayedPrompts = allPrompts;
    }

    function useThisRole(promptData) {
      let categoryTarget = 'article';
      const actLower = promptData.act.toLowerCase();

      if (actLower.includes('developer') || actLower.includes('code') || actLower.includes('program') || actLower.includes('linux') || actLower.includes('interpreter') || actLower.includes('solidity') || actLower.includes('python') || actLower.includes('javascript')) {
        categoryTarget = 'development';
      } else if (actLower.includes('storyteller') || actLower.includes('poet') || actLower.includes('screenwriter') || actLower.includes('creative')) {
        categoryTarget = 'creative';
      }
      // ... می‌توانید دسته‌بندی‌های بیشتری اضافه کنید

      selectedRoleForForm.set({
        id: promptData.act.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/gi, ''), // ID تمیزتر
        act: promptData.act,
        prompt: promptData.prompt,
        category: categoryTarget
      });
      activeTab.set(categoryTarget);
    }

    // کلاس‌های استایل برای تم تیره
    const inputFieldClass = "input-field-dark"; // یا input-field-space برای تم روشن
    const cardBgClass = "bg-custom-gray-800"; // یا bg-white
    const cardBorderClass = "border-custom-gray-700"; // یا border-space-border
    const textColorPrimary = "text-custom-indigo-400"; // یا neon-text-primary
    const textColorSecondary = "text-custom-gray-400"; // یا text-space-text-secondary
    const btnSecondaryClass = "btn-secondary-dark"; // یا btn-neon-secondary
  </script>

  <div class="w-full space-y-6 p-1">
    <h2 class="text-2xl sm:text-3xl font-semibold {textColorPrimary} text-center mb-8">کاوشگر نقش‌ها و پرامپت‌ها</h2>

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <!-- آیکون لودینگ با رنگ تم تیره -->
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-indigo-400"></div>
        <p class="ml-3 {textColorSecondary}">در حال بارگذاری پرامپت‌ها...</p>
      </div>
    {:else if error}
      <div class="bg-red-700/30 border border-red-500 text-red-300 px-4 py-3 rounded-md relative" role="alert"> <!-- استایل خطا برای تم تیره -->
        <strong class="font-bold">خطا!</strong>
        <span class="block sm:inline"> متاسفانه در بارگذاری دیتاست مشکلی پیش آمد: {error}</span>
      </div>
    {:else}
      <div class="mb-6">
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="جستجو در عنوان یا متن پرامپت..."
          class="{inputFieldClass} w-full !py-3"
        />
      </div>

      {#if displayedPrompts.length === 0}
        <p class="text-center {textColorSecondary} py-10">هیچ پرامپتی با این مشخصات یافت نشد.</p>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {#each displayedPrompts as p (p.act + p.prompt)} <!-- کلید منحصر به فرد بهتر -->
            <div class="{cardBgClass} border {cardBorderClass} rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <div class="p-5 flex-grow">
                <h3 class="text-lg font-semibold {textColorPrimary} mb-2">{p.act}</h3>
                <p class="text-sm {textColorSecondary} leading-relaxed line-clamp-5">
                  {p.prompt}
                </p>
              </div>
              <div class="p-4 {cardBgClass} border-t {cardBorderClass} rounded-b-lg"> <!-- اطمینان از هم‌رنگی فوتر کارت -->
                <button
                  on:click={() => useThisRole(p)}
                  class="{btnSecondaryClass} w-full text-sm !py-2"
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
      -webkit-line-clamp: 5;
    }
  </style>