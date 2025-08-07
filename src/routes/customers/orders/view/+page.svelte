<script>
  export let data;
  const order = data.order;
</script>


<h1 class="text-2xl font-bold mb-4">Order Details</h1>

{#if order?.order?.workorder}
  <div class="mt-4 flex justify-center">
    <h2 class="text-xl font-semibold mb-2 text-center w-full">Printable Order Form</h2>
    <img
      src={`/orders/${order.order.workorder.slice(0, 2)}/${order.order.workorder.slice(2, 4)}/${parseInt(order.order.workorder.slice(4), 10).toString().padStart(2, '0')}/printable.jpg`}
      alt="Printable Order"
      class="border rounded w-full max-w-4xl"
    />
  </div>
{/if}
