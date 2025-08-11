<script>
  import '../app.css';
  import { getCurrentUser } from '$lib/auth';
  import { page } from '$app/stores';
  import HomeNavbar from '$lib/nav/HomeNavbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let user;

  if (typeof window !== 'undefined') {
    user = getCurrentUser();
  }

  // Auto-subscription
  $: currentPath = $page.url.pathname;

// src/routes/+layout.server.js
export const load = async ({ locals }) => {
  // TODO: replace with real auth.
  locals.user = locals.user ?? { id: 'user-007' }; // <-- ensure we're the customer for now
  return { user: locals.user };
};


</script>

{#if !currentPath.startsWith('/admin') && !currentPath.startsWith('/customers')}
  <HomeNavbar />
{/if}

<main class="p-6">
  <slot />
</main>

{#if !currentPath.startsWith('/admin') && !currentPath.startsWith('/customers')}
  <Footer />
{/if}
