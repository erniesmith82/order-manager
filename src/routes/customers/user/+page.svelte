<script>
  import { getCurrentUser } from '$lib/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user = null;

  // helper to generate a safe id from name
  function nameToId(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  onMount(() => {
    user = getCurrentUser();
    if (!user) goto('/login');

    if (!user.facilities || !Array.isArray(user.facilities)) {
      user = {
        ...user,
        facilities: [
          { id: '', name: '', address: '', city: '', state: '', zip: '' }
        ]
      };
    }
  });

  async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/upload/avatar', { method: 'POST', body: formData });
    const result = await res.json();

    if (result.avatar) {
      user.avatar = result.avatar;
    } else {
      alert('Failed to upload avatar');
    }
  }

  function addFacility() {
    user.facilities = [
      ...user.facilities,
      { id: '', name: '', address: '', city: '', state: '', zip: '' }
    ];
  }

  function removeFacility(index) {
    user.facilities.splice(index, 1);
    user.facilities = [...user.facilities];
  }

  async function saveChanges() {
    // ensure all facilities have IDs before saving
    user.facilities = user.facilities.map(fac => ({
      ...fac,
      id: fac.id || nameToId(fac.name)
    }));

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

    <!-- Facility Address Section -->
    <div class="space-y-4">
      <label class="block text-sm font-bold text-gray-800">Facility Addresses</label>

      {#each user.facilities as facility, index}
        <div class="border p-4 rounded space-y-2 relative bg-gray-50">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Facility Name</label>
              <input
                type="text"
                class="w-full p-2 border rounded"
                bind:value={facility.name}
                placeholder="e.g., West Medical Center"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                class="w-full p-2 border rounded"
                bind:value={facility.address}
                placeholder="1234 Main St"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                class="w-full p-2 border rounded"
                bind:value={facility.city}
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                class="w-full p-2 border rounded"
                bind:value={facility.state}
                placeholder="FL"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                type="text"
                class="w-full p-2 border rounded"
                bind:value={facility.zip}
              />
            </div>
          </div>

          {#if user.facilities.length > 1}
            <button
              on:click={() => removeFacility(index)}
              class="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
              title="Remove this facility"
            >
              &times;
            </button>
          {/if}
        </div>
      {/each}

      <button
        class="text-blue-600 hover:underline text-sm"
        on:click={addFacility}
      >
        + Add Another Facility
      </button>
    </div>

    <button
      class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
      on:click={saveChanges}
    >
      Save Changes
    </button>
  </div>
{/if}
