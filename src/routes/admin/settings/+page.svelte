<script>
  import UserProfileForm from '../user/+page.svelte';

  let showUpdateInfo = false;
  let autoRefresh = false;
  let refreshInterval = 5;
  let defaultStatus = 'pending';
  let showCustomOrders = true;
  let showPrefabOrders = true;
  let exportFormat = 'csv';
  let browserNotifications = {
    newOrders: false,
    messages: false,
    errors: false
  };

  function saveUserSettings() {
    showUpdateInfo = false;
  }
</script>

<div class="bg-white text-gray-900 p-6 space-y-10 max-w-4xl mx-auto rounded-md shadow-sm">
  <h1 class="text-3xl font-bold border-b pb-2">User Settings</h1>

  <!-- Update Info -->
  <section class="space-y-4">
    <div class="flex justify-between items-center cursor-pointer" on:click={() => showUpdateInfo = !showUpdateInfo}>
      <h2 class="text-xl font-semibold">Update Profile Information</h2>
      <span class="text-sm text-gray-600">{showUpdateInfo ? 'Collapse ▲' : 'Expand ▼'}</span>
    </div>
    {#if showUpdateInfo}
      <div class="p-4 bg-gray-50 border rounded-md space-y-4">
        <UserProfileForm />
        <div class="text-right">
          <button
            on:click={saveUserSettings}
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save & Collapse
          </button>
        </div>
      </div>
    {/if}
  </section>

  <!-- Login History -->
  <section>
    <h2 class="text-xl font-semibold">Login History & Active Sessions</h2>
    <p class="text-sm text-gray-500 mt-1">Coming soon: View your recent logins and connected devices.</p>
  </section>

  <!-- Auto-Refresh -->
  <section>
    <h2 class="text-xl font-semibold">Order Auto-Refresh</h2>
    <div class="flex items-center gap-2 mt-2">
      <input type="checkbox" bind:checked={autoRefresh} />
      <label class="text-sm">Enable auto-refresh</label>
    </div>
    {#if autoRefresh}
      <div class="flex items-center gap-2 mt-2">
        <input
          type="number"
          min="1"
          bind:value={refreshInterval}
          class="p-2 border rounded w-20"
        />
        <span class="text-sm text-gray-500">Minutes</span>
      </div>
    {/if}
  </section>

  <!-- Default Order Status -->
  <section>
    <h2 class="text-xl font-semibold">Default Order Status</h2>
    <select bind:value={defaultStatus} class="mt-2 p-2 border rounded w-full max-w-sm">
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="complete">Complete</option>
    </select>
  </section>

  <!-- Order Type Preferences -->
  <section>
    <h2 class="text-xl font-semibold">Visible Order Types</h2>
    <div class="space-y-2 mt-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={showCustomOrders} />
        <span>Show Custom Orders</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={showPrefabOrders} />
        <span>Show Prefab Orders</span>
      </label>
    </div>
  </section>

  <!-- Export Format -->
  <section>
    <h2 class="text-xl font-semibold">Default Export Format</h2>
    <select bind:value={exportFormat} class="mt-2 p-2 border rounded w-full max-w-sm">
      <option value="csv">CSV</option>
      <option value="pdf">PDF</option>
    </select>
  </section>

  <!-- Browser Notifications -->
  <section>
    <h2 class="text-xl font-semibold">Browser Notifications</h2>
    <div class="space-y-2 mt-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={browserNotifications.newOrders} />
        <span>New Orders</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={browserNotifications.messages} />
        <span>Customer Messages</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={browserNotifications.errors} />
        <span>Errors & Alerts</span>
      </label>
    </div>
  </section>

  <!-- Email Notifications -->
  <section>
    <h2 class="text-xl font-semibold">Email Preferences</h2>
    <p class="text-sm text-gray-500 mt-1">Coming soon: Choose which email alerts you receive.</p>
  </section>
</div>
