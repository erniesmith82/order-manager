<script>
  import { loginUser } from '$lib/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);

      if (user) {
        switch (user.role) {
          case 'admin':
            goto('/admin/dashboard');
            break;
          case 'employee':
            goto('/employee/dashboard'); // optional future route
            break;
          case 'customer':
            goto('/customer/dashboard');
            break;
          default:
            error = 'Unknown user role.';
        }
      } else {
        error = 'Invalid login credentials';
      }
    } catch (err) {
      error = 'Login failed. Please try again.';
    }
  }
</script>

<!-- Fullscreen layout -->
<div class="flex flex-col min-h-screen bg-gray-50">
  <main class="flex-grow">
    <form
      on:submit={handleLogin}
      class="max-w-md mx-auto mt-20 space-y-4 p-6 bg-white rounded shadow"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>

      {#if error}
        <p class="text-red-600 text-center">{error}</p>
      {/if}

      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        class="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        class="w-full p-2 border border-gray-300 rounded"
        required
      />

      <div class="flex justify-between text-sm">
        <a href="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</a>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  </main>
</div>
