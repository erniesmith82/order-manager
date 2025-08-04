<script>
  let activeTab = 'outstanding';

  const tabs = [
    { label: 'Outstanding', key: 'outstanding' },
    { label: 'Order History', key: 'history' },
    { label: '+ New Order', key: 'new' }
  ];

  const orderSections = [
    { name: 'Prosthetics', img: '/prosthetic.png', link: '/customers/orders/prosthetics' },
    { name: 'Orthotics', img: '/orthotics.png', link: '/customers/orders/orthotics' },
    { name: 'Cranial', img: '/cranial.png', link: '/customers/orders/cranial' },
    { name: 'Custom Fabrication', img: '/customfabrication.png', link: '/customers/orders/fabrication' },
    { name: 'MARAMED™', img: '/maramed-logo.png', link: '/customers/orders/maramed' },
    { name: 'Foam Blanks', img: '/foam-blanks.png', link: '/customers/orders/foam-blanks' }
  ];
</script>

<div class="p-6">
  <h1 class="text-3xl font-bold mb-6">Orders</h1>

  <!-- Tabs -->
  <div class="flex space-x-6 border-b mb-6">
    {#each tabs as tab}
      <button
        class={`pb-2 text-m font-medium ${
          activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
        }`}
        on:click={() => (activeTab = tab.key)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Outstanding Tab -->
  {#if activeTab === 'outstanding'}
    <div class="bg-white border rounded-lg shadow overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-700">
        <thead class="bg-gray-100 border-b text-xs uppercase">
          <tr>
            <th class="px-6 py-3">Order</th>
            <th class="px-6 py-3">Patient</th>
            <th class="px-6 py-3">Type</th>
            <th class="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- Placeholder: Empty for now -->
          <tr>
            <td colspan="4" class="text-center px-6 py-6 text-gray-400">No outstanding orders.</td>
          </tr>
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Order History Tab -->
  {#if activeTab === 'history'}
    <div class="text-gray-500 text-center mt-10">
      <p>No past orders found.</p>
    </div>
  {/if}

  <!-- New Order Tab -->
  {#if activeTab === 'new'}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {#each orderSections as section}
        <a href={section.link} class="group block border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition bg-white overflow-hidden">
          <div class="relative">
            <img src={section.img} alt={section.name} class="w-full h-60 object-contain " />

          </div>
          <div class="p-4 text-center">
            <h3 class="text-2xl font-semibold text-gray-800">{section.name}</h3>
            <button class="mt-2 px-4 py-1 text-s text-white bg-blue-600 rounded hover:bg-blue-700 transition">
              Start Order
            </button>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
