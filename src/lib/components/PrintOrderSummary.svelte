<script>
  export let showPrintClean = true;
  export let order;
  export let patient;
  export let liner;
  export let foot;
  export let uploadedFileName = ''; // 👈 This is safe now
</script>

<div
  id="print-clean"
  class:hidden={!showPrintClean}
  class="print-clean bg-white text-black border px-10 py-8 text-sm leading-tight"
>
  <div class="flex justify-between items-center border-b pb-2 mb-4">
    <div>
      <p><strong>Customer PO:</strong> {patient.name}</p>
      <p><strong>Patient Name:</strong> {patient.name}</p>
      <p><strong>Patient ID:</strong> {patient.account}</p>
      <p><strong>Practitioner:</strong> {patient.practitioner}</p>
    </div>
    <div class="text-right">
      <p class="text-xl font-bold">Order Cover Page</p>
      <p><strong>Order:</strong> {order.workorder}</p>
      <p><strong>Date Needed:</strong> {order.neededDate}</p>
      <p><strong>Ship Date:</strong> {order.neededDate}</p>
      <p><strong>Delivery Date:</strong> {order.neededDate}</p>
    </div>
  </div>

  <div class="flex justify-between items-center border-b pb-2 mb-4">
    <p><strong>Created By:</strong> Auto-Generated</p>
    <p><strong>Date Submitted:</strong> {order.receivedDate}</p>
  </div>

  <div class="grid grid-cols-2 gap-6 border-b pb-4 mb-4">
    <div>
      <p><strong>Order Type:</strong> Standard</p>
      <p><strong>Ship Method:</strong> Site Pickup</p>
    </div>
    <div>
      <p><strong>Bill To:</strong></p>
      <p>SPS National Labs Orlando</p>
      <p>9561 SATELLITE BLVD.<br />SUITE 350<br />Orlando, FL 32837-8425</p>
      <p>407-852-6170</p>
    </div>
    <div>
      <p><strong>Ship To:</strong></p>
      <p>SPS National Labs Orlando</p>
      <p>9561 SATELLITE BLVD.<br />SUITE 350<br />Orlando, FL 32837-8425</p>
      <p>407-852-6170</p>
    </div>
  </div>

  <div class="border-b pb-2 mb-4">
    <p><strong>Product:</strong> Send File to Mill</p>
    <p><strong>Quantity:</strong> 1</p>
    <p><strong>Order Form:</strong> {uploadedFileName}</p>
  </div>

  <div class="border-b pb-2 mb-4">
    <p><strong>Order File:</strong></p>
    <p>GREEN BERNARD CONVERTED RKAFO 250730 mfmod carve(20250806_1238).op3</p>
    <p>GREEN BERNARD CONVERTED LKAFO 250730 mfmod carve(20250806_1238).op3</p>
  </div>

  <div class="border-b pb-2 mb-4">
    <p><strong>Comment:</strong></p>
    <p class="text-gray-600 italic">None</p>
  </div>

  <div class="text-center text-xs mt-6">
    <p><strong>BioSculptor Fabrication</strong></p>
    <p>2480 West 82nd Street, Hialeah FL 33016</p>
    <p>305-823-8300 | 305-823-8304 | cfab@biosculptor.com</p>
    <p class="mt-2">Page 01</p>
  </div>
</div>
