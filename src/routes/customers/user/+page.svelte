<script>
  import { getCurrentUser } from '$lib/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user = null;

  onMount(() => {
    user = getCurrentUser();
    if (!user) goto('/login');
  });

  async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    if (result.avatar) {
      user.avatar = result.avatar;
    } else {
      alert('Failed to upload avatar');
    }
  }

  async function saveChanges() {
  const res = await fetch('/api/users/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  const result = await res.json();

  if (result.success) {
    localStorage.setItem('user', JSON.stringify(result.user));
    alert('Profile updated!');
  } else {
    alert('Failed to update profile: ' + (result.error || 'Unknown error'));
  }
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
  <label class="block text-sm font-medium text-gray-700">Avatar</label>

  <!-- Show preview if available -->
  {#if user.avatar}
    <img src={user.avatar} alt="Avatar Preview" class="w-16 h-16 rounded-full mt-2" />
  {/if}

  <input type="file" accept="image/*" on:change={handleAvatarUpload} class="mt-2" />
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
