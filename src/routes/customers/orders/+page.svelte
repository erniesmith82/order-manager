<script>
  let activeTab = 'new';

  const sections = [
    { name: 'Prosthetics', img: '/prosthetic.png', link: '/customers/orders/prosthetics' },
    { name: 'Orthotics', img: '/spinal.png', link: '/customers/orders/orthotics' },
    { name: 'Cranial', img: '/images/cranial.jpg', link: '/customers/orders/cranial' }
  ];
</script>

<div class="p-6">
  <h1 class="text-2xl font-bold mb-6">Orders</h1>

  <div class="flex space-x-4 mb-4">
    <button
      class={`px-4 py-2 rounded ${activeTab === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      on:click={() => activeTab = 'new'}
    >
      New Order
    </button>
    <button
      class={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      on:click={() => activeTab = 'history'}
    >
      Order History
    </button>
  </div>

  {#if activeTab === 'new'}
    <div class="flex flex-col space-y-4 max-w-xs">
      {#each sections as section}
        <a href={section.link} class="flex items-center border rounded-lg p-3 shadow hover:shadow-md transition w-full">
          <img src={section.img} alt={section.name} class="w-16 h-16 object-cover mr-4" />
          <h2 class="text-base font-medium">{section.name}</h2>
        </a>
      {/each}
    </div>
  {:else}
    <div class="bg-white p-4 rounded shadow">
      <p class="text-gray-600">You have no order history yet.</p>
    </div>
  {/if}
</div>
