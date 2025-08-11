<script>
  import PrintOrderSummary from '$lib/components/PrintOrderSummary.svelte';

  export let data;
  const order = data.order;

  const yy = order?.order?.workorder?.slice(0, 2);
  const ww = order?.order?.workorder?.slice(2, 4);
  const nn = parseInt(order?.order?.workorder?.slice(4), 10).toString().padStart(2, '0');
</script>

{#if order?.order?.workorder}
  <div class="mt-4 flex flex-col items-center justify-center text-center space-y-8">
    <h2 class="text-xl font-semibold mb-4">Printable Order Form</h2>

<OrderSummary
  order={order.order}
  patient={order.patient}
  facility={order.patient?.facilityDetails}
/>

  
  </div>
{/if}
