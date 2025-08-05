<script>
  export let data;
</script>

<h1 class="text-xl font-bold">Outstanding Orders</h1>
{#each data.orders as order}
  <div class="border p-4 mb-2 rounded shadow bg-white">
    <div><strong>Workorder:</strong> {order.order.workorder}</div>
    <div><strong>Patient:</strong> {order.patient.name}</div>
    <div><strong>Practitioner:</strong> {order.patient.practitioner}</div>
    <div><strong>Received:</strong> {order.order.receivedDate}</div>
    <div><strong>Needed:</strong> {order.order.neededDate}</div>
  </div>
{/each}
