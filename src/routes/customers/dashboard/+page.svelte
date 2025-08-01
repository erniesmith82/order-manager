<script>
  import { getCurrentUser } from '$lib/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user = null;

  onMount(() => {
    user = getCurrentUser();
    if (!user || user.role !== 'customer') {
      goto('/login');
    }
  });
</script>

{#if user}
<div class="p-4 bg-gray-200">
  <h1 class="text-2xl font-bold text-gray-800 mb-4">Customer Dashboard</h1>
  <p class="text-black">Welcome back! Here's a quick overview of your orders and activity.</p>

  <!-- Placeholder widgets or data -->
  <div class="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <div class="p-4 bg-white text-white dark:bg-gray-800 rounded shadow">Orders Overview</div>
    <div class="p-4 bg-white text-white dark:bg-gray-800 rounded shadow">Recent Activity</div>
    <div class="p-4 bg-white text-white dark:bg-gray-800 rounded shadow">System Stats</div>
  </div>
</div>
{/if}