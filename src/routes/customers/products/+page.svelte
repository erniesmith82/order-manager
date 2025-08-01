<script>
  // In the future, you'd fetch shared product data
  const products = [
    { id: 'P-001', name: 'Custom Knee Brace' },
    { id: 'P-002', name: 'Ankle Orthotic' }
  ];
</script>

<div class="p-6">
  <h2 class="text-xl font-bold mb-4">Available Products</h2>
  <ul>
    {#each products as p}
      <li class="border p-2 rounded mb-2">{p.name}</li>
    {/each}
  </ul>
</div>
