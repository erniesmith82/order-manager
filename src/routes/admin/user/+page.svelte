<!-- src/routes/admin/user/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let userInfo = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator'
  };

  // You could fetch this info from an API onMount or load function
  onMount(() => {
    // fetchUserInfo();
  });
</script>

<div class="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
  <h1 class="text-2xl font-bold mb-4">Admin Profile</h1>

  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium">Full Name</label>
      <input
        type="text"
        class="mt-1 block w-full p-2 bg-gray-100 dark:bg-gray-800 rounded"
        bind:value={userInfo.name}
        disabled
      />
    </div>

    <div>
      <label class="block text-sm font-medium">Email</label>
      <input
        type="email"
        class="mt-1 block w-full p-2 bg-gray-100 dark:bg-gray-800 rounded"
        bind:value={userInfo.email}
        disabled
      />
    </div>

    <div>
      <label class="block text-sm font-medium">Role</label>
      <input
        type="text"
        class="mt-1 block w-full p-2 bg-gray-100 dark:bg-gray-800 rounded"
        bind:value={userInfo.role}
        disabled
      />
    </div>
  </div>

  <div class="mt-8">
    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit Profile</button>
    <button class="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reset Password</button>
  </div>
</div>
