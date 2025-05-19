<script>
  export let tabId;
  export let currentTab;
  export let label;
  import { activeTab } from '../lib/stores.js';

  function selectTab() {
    activeTab.set(tabId);
  }
</script>

<button
  on:click={selectTab}
  class="px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-70 transform hover:scale-105 active:scale-95"
  class:bg-neon-primary={currentTab === tabId}
  class:text-white={currentTab === tabId}
  class:shadow-neon-glow-primary={currentTab === tabId} /* درخشش برای تب فعال */
  class:hover:bg-opacity-90={currentTab === tabId}

  class:text-space-text-secondary={currentTab !== tabId}
  class:bg-white={currentTab !== tabId} /* پس زمینه برای تب غیرفعال */
  class:border={currentTab !== tabId} /* بوردر برای تب غیرفعال */
  class:border-space-border={currentTab !== tabId}
  class:hover:bg-gray-50={currentTab !== tabId}
  class:hover:text-neon-primary={currentTab !== tabId}
  class:hover:border-neon-primary={currentTab !== tabId} /* هاور بوردر برای تب غیرفعال */
  class:focus:ring-neon-primary={currentTab === tabId}
  class:focus:ring-gray-300={currentTab !== tabId}
>
  {label}
</button>