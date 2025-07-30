<script>
  import { onMount } from 'svelte';
  import { logoutUser, getCurrentUser } from '$lib/auth';
  import { goto } from '$app/navigation';

  let darkMode = false;
  let notifications = true;
  let user;

  onMount(() => {
    user = getCurrentUser();
    const storedTheme = localStorage.getItem('theme');
    darkMode = storedTheme === 'dark';
    updateTheme();
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    updateTheme();
  }

  function updateTheme() {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleNotifications() {
    notifications = !notifications;
    // Could store preference in localStorage or DB
  }

  function handleLogout() {
    logoutUser();
    goto('/login');
  }
</script>

<div class="max-w-3xl mx-auto py-10 px-4">
  <h1 class="text-2xl font-bold mb-6">Admin Settings</h1>

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <span class="font-medium">Dark Mode</span>
      <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer" bind:checked={darkMode} on:change={toggleDarkMode}>
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
    </div>

    <div class="flex items-center justify-between">
      <span class="font-medium">Enable Notifications</span>
      <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer" bind:checked={notifications} on:change={toggleNotifications}>
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
    </div>

    <div class="border-t pt-6">
      <button on:click={handleLogout} class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  </div>
</div>
