<script>
  import UserProfileForm from '../user/+page.svelte'; // or make it a reusable component if needed

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

<div class="bg-white text-gray-900 p-4 space-y-3 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold">Settings</h1>

  <!-- Update Info -->
  <div>
    <h2 class="text-lg font-semibold cursor-pointer" on:click={() => showUpdateInfo = !showUpdateInfo}>
      🧑‍💼 Update Info {showUpdateInfo ? '▲' : '▼'}
    </h2>

    {#if showUpdateInfo}
      <div class="mt-4 border p-4 rounded bg-gray-50">
        <UserProfileForm />
        <button
          on:click={saveUserSettings}
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save & Collapse
        </button>
      </div>
    {/if}
  </div>



  <!-- Login History -->
  <div>
    <h2 class="text-lg font-semibold">📜 Login History or Active Sessions</h2>
    <p class="text-sm text-gray-600">Coming soon: See your recent logins and devices.</p>
  </div>

  <!-- UI Scale -->
  <div>
    <h2 class="text-lg font-semibold">⏹ Font Size or UI Scale</h2>
    <select class="mt-2 p-2 border rounded">
      <option>Normal</option>
      <option>Large</option>
      <option>Extra Large</option>
    </select>
  </div>

  <!-- Auto-Refresh Orders -->
  <div>
    <h2 class="text-lg font-semibold">🔄 Auto-refresh Orders</h2>
    <label class="flex items-center space-x-2">
      <input type="checkbox" bind:checked={autoRefresh} />
      <span>Enable Auto-refresh</span>
    </label>
    {#if autoRefresh}
      <input type="number" min="1" bind:value={refreshInterval} class="mt-2 p-2 border rounded w-24" />
      <span class="ml-2 text-sm text-gray-600">minutes</span>
    {/if}
  </div>

  <!-- Default Order Status Filter -->
  <div>
    <h2 class="text-lg font-semibold">✅ Default Order Status Filter</h2>
    <select bind:value={defaultStatus} class="mt-2 p-2 border rounded">
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="complete">Complete</option>
    </select>
  </div>

  <!-- Order Type Visibility -->
  <div>
    <h2 class="text-lg font-semibold">📦 Order Type Preferences</h2>
    <label class="block">
      <input type="checkbox" bind:checked={showCustomOrders} /> Show Custom Orders
    </label>
    <label class="block">
      <input type="checkbox" bind:checked={showPrefabOrders} /> Show Prefab Orders
    </label>
  </div>

  <!-- Export Format -->
  <div>
    <h2 class="text-lg font-semibold">📋 Default Export Format</h2>
    <select bind:value={exportFormat} class="mt-2 p-2 border rounded">
      <option value="csv">CSV</option>
      <option value="pdf">PDF</option>
    </select>
  </div>

  <!-- Browser Notifications -->
  <div>
    <h2 class="text-lg font-semibold">🔔 Browser Notifications</h2>
    <label class="block">
      <input type="checkbox" bind:checked={browserNotifications.newOrders} /> New Orders
    </label>
    <label class="block">
      <input type="checkbox" bind:checked={browserNotifications.messages} /> Customer Messages
    </label>
    <label class="block">
      <input type="checkbox" bind:checked={browserNotifications.errors} /> Errors or Alerts
    </label>
  </div>

  <!-- Email Notifications -->
  <div>
    <h2 class="text-lg font-semibold">📩 Email Notification Preferences</h2>
    <p class="text-sm text-gray-600">Coming soon: Customize what emails you'd like to receive.</p>
  </div>
</div>
