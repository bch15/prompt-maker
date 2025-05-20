<script>
  import '../app.css'; // ایمپورت کردن استایل‌های گلوبال
  // اگر کامپوننت‌های گلوبال دیگری دارید (Navbar, Footer) اینجا ایمپورت کنید
</script>

<div class="app-wrapper w-full">
  <!-- <Navbar /> -->
  <slot /> <!-- محتوای اصلی صفحات اینجا قرار می‌گیرد -->
  <!-- <Footer /> -->
</div>

<style>
  /* استایل‌های خاص این layout اگر نیاز باشد */
  .app-wrapper {
    /* display: flex; flex-direction: column; min-height: 100vh; */
  }
</style>