<script>
  let order = {
    name: '',
    workOrderNo: '',
    facility: '',
    account: '',
    practitioner: '',
    email: '',
    phone: '',
    height: '',
    weight: '',
    age: '',
    sex: '',
    activity: '',
    side: '',
    material: '',
    linerType: '',
    suspension: '',
    distalEnd: '',
    footType: '',
    notes: '',
    shipMethod: 'Site Pickup',
    dateNeeded: '',
    measurementTypes: {
      scan: false,
      cast: false,
      measurements: false
    }
  };

  function submitOrder() {
    console.log('Order submitted:', order);
    alert('Order submitted!');
  }
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6 bg-white shadow rounded">
  <h1 class="text-2xl font-bold">🦿 Custom Transtibial Socket Order</h1>

  <!-- Section: Patient Info -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input placeholder="Patient Name" bind:value={order.name} class="p-2 border rounded" />
    <input placeholder="Work Order No." bind:value={order.workOrderNo} class="p-2 border rounded" />
    <input placeholder="Height" bind:value={order.height} class="p-2 border rounded" />
    <input placeholder="Weight" bind:value={order.weight} class="p-2 border rounded" />
    <input placeholder="Age" bind:value={order.age} class="p-2 border rounded" />
    <select bind:value={order.sex} class="p-2 border rounded">
      <option value="">Select Sex</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
    <input placeholder="Activity Level" bind:value={order.activity} class="p-2 border rounded" />
    <div>
      <label class="block text-sm">Affected Side</label>
      <label><input type="radio" bind:group={order.side} value="Left" /> Left</label>
      <label><input type="radio" bind:group={order.side} value="Right" /> Right</label>
    </div>
  </div>

  <!-- Section: Customer Info -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input placeholder="Facility" bind:value={order.facility} class="p-2 border rounded" />
    <input placeholder="Account #" bind:value={order.account} class="p-2 border rounded" />
    <input placeholder="Practitioner" bind:value={order.practitioner} class="p-2 border rounded" />
    <input placeholder="Email" bind:value={order.email} class="p-2 border rounded" />
    <input placeholder="Phone Number" bind:value={order.phone} class="p-2 border rounded" />
    <input type="date" bind:value={order.dateNeeded} class="p-2 border rounded" />
  </div>

  <!-- Section: Material & Options -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <select bind:value={order.material} class="p-2 border rounded">
      <option value="">Select Material</option>
      <option>PP</option>
      <option>PE</option>
      <option>FlexForm</option>
      <option>Pelite Cone</option>
      <option>Acrylic/DurrFlex/Biocllear</option>
    </select>
    <input placeholder="Liner Type" bind:value={order.linerType} class="p-2 border rounded" />
    <input placeholder="Suspension" bind:value={order.suspension} class="p-2 border rounded" />
    <input placeholder="Distal End Option" bind:value={order.distalEnd} class="p-2 border rounded" />
    <input placeholder="Foot Type" bind:value={order.footType} class="p-2 border rounded" />
  </div>

  <!-- Section: Checkboxes -->
  <div class="space-x-4">
    <label><input type="checkbox" bind:checked={order.measurementTypes.measurements} /> Measurements</label>
    <label><input type="checkbox" bind:checked={order.measurementTypes.scan} /> Scan</label>
    <label><input type="checkbox" bind:checked={order.measurementTypes.cast} /> Cast</label>
  </div>

  <!-- Section: Notes -->
  <textarea rows="4" bind:value={order.notes} placeholder="Notes or modification instructions..." class="w-full p-2 border rounded"></textarea>

  <button on:click={submitOrder} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Submit Order
  </button>
</div>
