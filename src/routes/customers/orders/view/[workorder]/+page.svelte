<script context="module">
  export async function load({ params, fetch }) {
    const res = await fetch(`/api/get-order/${params.workorder}`);
    const data = await res.json();

    return {
      order: data.order
    };
  }
</script>

<script>
  export let order;
</script>

<h1 class="text-2xl font-bold mb-4">Order Details</h1>

{#if order}
  <div class="space-y-2">
    <div><strong>Patient:</strong> {order.patient.name}</div>
    <div><strong>Practitioner:</strong> {order.patient.practitioner}</div>
    <div><strong>Workorder:</strong> {order.order.workorder}</div>
    <div><strong>Date Submitted:</strong> {new Date(order.submittedAt).toLocaleString()}</div>
    <div><strong>Shipping:</strong> {order.order.shipping}</div>
    <!-- Add more fields as needed -->
  </div>
{:else}
  <p>Order not found.</p>
{/if}
