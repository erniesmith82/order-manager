<script>
  export let data;
  const order = data.order;
</script>


<h1 class="text-2xl font-bold mb-4">Order Details</h1>

{#if order?.order?.workorder}
  <div class="mt-6">
    <h2 class="text-xl font-semibold mb-2">Printable Order Form</h2>
    <iframe
      src={`/orders/${order.order.workorder.slice(0, 2)}/${order.order.workorder.slice(2, 4)}/${parseInt(order.order.workorder.slice(4), 10).toString().padStart(2, '0')}/printable.pdf`}
      width="100%"
      height="800"
      class="border rounded"
    ></iframe>
  </div>
{/if}
