<script>
  import { page } from '$app/stores';
  $: orderId = $page.params.id;
</script>

<h1 class="text-3xl text-center font-bold text-indigo-500 mt-10">
  Viewing Order #{orderId}
</h1>
