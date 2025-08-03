<script>
  import { logoutUser, getCurrentUser } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let user = null;
  let sidebarOpen = false;

  onMount(() => {
    user = getCurrentUser();

    // Protect this layout: only allow customers
    if (!user || user.role !== 'customer') {
      logoutUser();
      goto('/login');
    }
  });

  function handleLogout() {
    logoutUser();
    goto('/login');
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>
<style global>
@media print {
  .no-print,
  aside,
  nav,
  .sidebar,
  .layout-nav,
  #admin-sidebar {
    display: none !important;
    visibility: hidden !important;
  }

    body {
      margin: 0;
      padding: 0;
    }

    body * {
      visibility: hidden;
    }

    .no-print,
    aside,
    nav,
    .sidebar,
    .layout-nav {
      display: none !important;
      visibility: hidden !important;
    }

    #print-area,
    #print-area * {
      visibility: visible;
    }

    #print-area {
      width: 8.5in;
      padding: 0.5in;
      box-sizing: border-box;
      background: white;
    }

    main {
      width: 100% !important;
      margin: 0 auto !important;
    }

    input, textarea, select {
      border: none !important;
      border-bottom: 1px solid black !important;
      background: transparent !important;
      font-weight: bold !important;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }
</style>



<div class="no-print">
<!-- Mobile Top Bar -->
<div class="sm:hidden flex justify-between items-center p-4 bg-white shadow fixed top-0 left-0 right-0 z-50">
  <button on:click={toggleSidebar} class="text-gray-700 focus:outline-none">
    {#if sidebarOpen}
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    {:else}
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    {/if}
  </button>
</div>

<!-- Sidebar -->
<aside
  id="admin-sidebar"
  class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-gray-900 text-white
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
  aria-label="Sidebar"
>
  <div class="h-full px-3 py-6 overflow-y-auto flex flex-col justify-between">
    <div>
      <!-- Logo -->
      <div class="flex justify-center mb-0">
        <a href="/" class="flex items-center space-x-2">
          <img src="/NopLogo.png" alt="NØPlaster Logo" class="h-30 w-auto" />
        </a>
      </div>

      <!-- User Info -->
     {#if user}
  <div class="text-center mb-20">
    <img src={user.avatar} alt="User Avatar" class="w-16 h-16 rounded-full mx-auto border-2 border-white shadow" />
    <p class="mt-2 font-medium">{user.name}</p>
  </div>
{/if}


      <!-- Navigation Links -->
      <ul class="space-y-4 mx-5 font-medium">
        <li><a href="/customers/dashboard" class="block p-2 rounded-lg hover:bg-gray-800">Dashboard</a></li>
        <li><a href="/customers/orders" class="block p-2 rounded-lg hover:bg-gray-800">Orders</a></li>
        <li><a href="/customers/products" class="block p-2 rounded-lg hover:bg-gray-800">Products</a></li>
        <li><a href="/customers/messages" class="block p-2 rounded-lg hover:bg-gray-800">Messages</a></li>
      </ul>
    </div>

    <!-- Settings + Logout -->
    <div class="mt-auto space-y-2 pt-6 border-t border-gray-700">
      <a href="/customers/settings" class="block p-2 rounded-lg hover:bg-gray-800 w-full text-left text-white">
        Settings
      </a>
      <button on:click={handleLogout} class="block p-2 rounded-lg hover:bg-red-600 w-full text-left">
        Logout
      </button>
    </div>
  </div>
</aside>
</div>

<!-- Page Content -->

<div class="pt-16 p-4 sm:ml-64">
  <main class="p-4min-h-screen rounded-lg">
    <slot />
  </main>
</div>
