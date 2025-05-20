import { writable } from 'svelte/store';

// For OpenRouter API Key
const initialOpenRouterApiKey =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('openRouterApiKey') || ''
    : '';
export const openRouterApiKey = writable(initialOpenRouterApiKey);
openRouterApiKey.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('openRouterApiKey', value);
  }
});

// For active tab
export const activeTab = writable('article'); // 'article', 'development', 'creative', 'settings'

// Predefined Gemini API Key
export const geminiApiKey = 'AIzaSyC7_BCnYFOtZm4lbNaP1HR5rilgYfwxMDI'; // کلید شما
