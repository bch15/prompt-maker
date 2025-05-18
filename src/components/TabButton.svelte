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
  class="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50"
  class:bg-indigo-600={currentTab === tabId}
  class:text-white={currentTab === tabId}
  class:hover:bg-indigo-500={currentTab === tabId}
  class:text-gray-400={currentTab !== tabId}
  class:hover:bg-gray-700={currentTab !== tabId}
  class:hover:text-gray-200={currentTab !== tabId}
  class:focus:ring-indigo-400={currentTab === tabId}
  class:focus:ring-gray-500={currentTab !== tabId}
>
  {label}
</button>