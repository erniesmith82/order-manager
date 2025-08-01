<script>
  import { loginUser } from '$lib/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let name = '';
  let error = '';
  let isSignup = false;

  async function handleLogin(e) {
    e.preventDefault();
    error = '';

    if (isSignup) {
      // Signup mode
      if (!name || !email || !password) {
        error = 'All fields are required';
        return;
      }

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            role: 'customer'
          })
        });

        const data = await res.json();
        if (!res.ok) {
          error = data.error || 'Signup failed';
          return;
        }

        alert('Account created! You can now log in.');
        isSignup = false;
        email = '';
        password = '';
        name = '';

      } catch (err) {
        error = 'Signup error. Please try again.';
      }
    } else {
      // Login mode
      try {
        const user = await loginUser(email, password);
        if (user) {
          switch (user.role) {
            case 'admin':
              goto('/admin/dashboard');
              break;
            case 'employee':
              goto('/employee/dashboard');
              break;
            case 'customer':
              goto('/customers/dashboard');
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
  }
</script>


<div class="flex flex-col min-h-screen bg-gray-50">
  <main class="flex-grow">
    <form
      on:submit={handleLogin}
      class="max-w-md mx-auto mt-20 space-y-4 p-6 bg-white rounded shadow"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800">
        {isSignup ? 'Create Account' : 'Login'}
      </h2>

      {#if error}
        <p class="text-red-600 text-center">{error}</p>
      {/if}

      {#if isSignup}
        <input
          type="text"
          placeholder="Name"
          bind:value={name}
          class="w-full p-2 border border-gray-300 rounded"
          required
        />
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

      {#if !isSignup}
        <div class="flex justify-between text-sm">
          <a href="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</a>
        </div>
      {/if}

      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isSignup ? 'Sign Up' : 'Login'}
      </button>

      <div class="text-center text-sm mt-2">
        {#if isSignup}
          Already have an account?
          <a href="#" class="text-blue-600 hover:underline" on:click={() => (isSignup = false)}>Log in</a>
        {:else}
          Don’t have an account?
          <a href="#" class="text-blue-600 hover:underline" on:click={() => (isSignup = true)}>Sign up</a>
        {/if}
      </div>
    </form>
  </main>
</div>
