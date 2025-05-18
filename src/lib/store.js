import { writable } from 'svelte/store';

// For OpenRouter API Key
const initialOpenRouterApiKey = localStorage.getItem('openRouterApiKey') || '';
export const openRouterApiKey = writable(initialOpenRouterApiKey);
openRouterApiKey.subscribe((value) => {
  localStorage.setItem('openRouterApiKey', value);
});

// For active tab
export const activeTab = writable('article'); // 'article', 'development', 'settings'

// Predefined Gemini API Key (not stored, just used)
export const geminiApiKey = '';
