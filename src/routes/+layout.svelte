<script lang="ts"> // یا <script> اگر از JS خالص استفاده می‌کنی
  import '../app.css'; // مسیر به فایل CSS گلوبال شما (از پوشه src)

  // اگر کامپوننت Navbar یا Footer جداگانه داری، اینجا import کن:
  // import Navbar from '$lib/components/Navbar.svelte';
  // import Footer from '$lib/components/Footer.svelte';
</script>

<!-- 
  اینجا می‌تونی ساختار کلی HTML که در تمام صفحات تکرار میشه رو قرار بدی.
  معمولاً شامل یک div اصلی برای استایل‌دهی کلی، Navbar و Footer هست.
-->
<div class="min-h-screen flex flex-col"> {/* مثال: برای اینکه فوتر همیشه پایین باشه */}
  
  <!-- <Navbar /> --> {/* اگر کامپوننت Navbar داری */}

  <main class="flex-grow container mx-auto px-4 py-8"> {/* مثال: محتوای اصلی با کمی پدینگ و در مرکز */}
    <slot /> <!-- این بخش خیلی مهمه! SvelteKit محتوای هر صفحه (+page.svelte) رو اینجا قرار میده -->
  </main>

  <!-- <Footer /> --> {/* اگر کامپوننت Footer داری */}

</div>

<style>
  /* 
    استایل‌های خاص همین layout رو می‌تونی اینجا بنویسی.
    این استایل‌ها فقط به المان‌های داخل همین فایل +layout.svelte اعمال میشن.
    استایل‌های گلوبال در app.css هستن.
  */
</style>