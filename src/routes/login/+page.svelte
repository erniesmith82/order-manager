<script>
  import { loginUser } from '$lib/auth';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';

  let username = '';
  let password = '';
  let error = '';

  function handleLogin(e) {
    e.preventDefault();
    const user = loginUser(username, password);
    if (user) {
      if (user.role === 'admin') goto('/admin/dashboard');
      else if (user.role === 'customer') goto('/customer/dashboard');
      else error = 'Unknown user role.';
    } else {
      error = 'Invalid login credentials';
    }
  }
</script>

<!-- FULL SCREEN LAYOUT WITH FOOTER AT BOTTOM -->
<div class="flex flex-col min-h-screen bg-gray-50">

  <!-- Main content (login form) -->
  <main class="flex-grow">
    <form on:submit|preventDefault={handleLogin} class="max-w-md mx-auto mt-20 space-y-4 p-6 bg-white rounded shadow">
      <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>

      {#if error}
        <p class="text-red-600">{error}</p>
      {/if}

      <input
        type="text"
        placeholder="Username"
        bind:value={username}
        class="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Login
      </button>
    </form>
  </main>


</div>
