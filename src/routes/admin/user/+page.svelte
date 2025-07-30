<script>
  import { getCurrentUser } from '$lib/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user = null;

  onMount(async () => {
    user = getCurrentUser();
    if (!user) goto('/login');
  });

  function saveChanges() {
    localStorage.setItem('user', JSON.stringify(user));
    alert('Profile updated!');
  }
</script>

{#if user}
  <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Profile Settings</h1>

    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input
        class="w-full mt-1 p-2 border rounded"
        type="text"
        bind:value={user.name}
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        class="w-full mt-1 p-2 border rounded"
        type="email"
        bind:value={user.email}
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Avatar URL</label>
      <input type="file" accept="image/*" on:change={handleAvatarUpload} />

    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Default Export</label>
      <select bind:value={user.preferences.defaultExport} class="w-full mt-1 p-2 border rounded">
        <option value="PDF">PDF</option>
        <option value="CSV">CSV</option>
      </select>
    </div>

    <div class="flex items-center">
      <input id="notifications" type="checkbox" bind:checked={user.preferences.notifications} class="mr-2" />
      <label for="notifications" class="text-sm text-gray-700">Enable Notifications</label>
    </div>

    <button
      class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      on:click={saveChanges}
    >
      Save Changes
    </button>
  </div>
{/if}
