<script>
  export let data;
  const order = data.order;
  
  const yy = order?.order?.workorder?.slice(0, 2);
  const ww = order?.order?.workorder?.slice(2, 4);
  const nn = parseInt(order?.order?.workorder?.slice(4), 10).toString().padStart(2, '0');
</script>

{#if order?.order?.workorder}
  <div class="mt-4 flex flex-col items-center justify-center text-center h-120%">
    <h2 class="text-xl font-semibold mb-4">Printable Order Form</h2>
    <img
      src={`/orders/${yy}/${ww}/${nn}/printable.jpg`}
      alt="Printable Order"
      class="border rounded w-full max-w-4xl"
    />
  </div>
{/if}
