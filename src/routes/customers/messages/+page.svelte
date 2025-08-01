<script>
  import { getCurrentUser } from '$lib/auth';

  let user = getCurrentUser();
</script>

<div class="p-6">
  <h2 class="text-xl font-bold mb-4">Messages</h2>
  <p>This is where you'd view messages or communicate with support, {user?.name}.</p>
</div>
