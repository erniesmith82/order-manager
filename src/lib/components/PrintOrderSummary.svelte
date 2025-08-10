<script>
  export let showPrintClean = true;

  export let order = {
    workorder: '',
    neededDate: '',
    receivedDate: '',
    shipping: '',
    product: 'Transtibial Socket',
    uploadedFileName: '',
    customerPO: '',
    type: 'Standard',
    quantity: '1'
  };

  export let patient = {
    name: '',
    account: '',
    practitioner: '',
    email: '',
    facility: '',
    facilityDetails: null, // { name, address, city, state, zip, contactEmail, shipName, shipAddress, shipCity, shipState, shipZip }
    address: '',
    city: '',
    state: '',
    zip: ''
  };

  export let uploadedFileName = '';

  const fmt = (v) => (v ?? '') || '—';

  // Safe derived facility object: uses facilityDetails when present, else patient fields
  $: fd = patient.facilityDetails ?? {
    name: patient.facility || '',
    address: patient.address || '',
    city: patient.city || '',
    state: patient.state || '',
    zip: patient.zip || '',
    contactEmail: patient.email || '',
    shipName: '',
    shipAddress: '',
    shipCity: '',
    shipState: '',
    shipZip: ''
  };
</script>

<style>
  /* dom-to-image reads live DOM; lock summary to Letter size here */
  #print-summary {
    width: 8.5in;
    min-height: 11in;
    padding: 0.5in;
    box-sizing: border-box;
    margin: 0 auto;
    overflow: hidden;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
      "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
  }

  /* Your original print rules kept in case you actually print via browser */
  @media print {
    @page { size: 8.5in 11in; margin: 0.5in; }
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    .print-container { width: 100%; height: 100%; box-sizing: border-box; padding: 0; margin: 0; page-break-after: always; }
    body * { visibility: hidden; }
    #print-summary, #print-summary * { visibility: visible; }
    #print-summary { position: absolute; top: 0; left: 0; }
  }
</style>

<div class="border p-10">
  <div id="print-summary" class="print-container bg-white text-black text-sm leading-tight">

    <!-- Header -->
    <div class="header pb-10 text-2xl font-bold">
      Order Summary
    </div>

    <!-- Top row -->
    <div class="flex justify-between border-b-2 pb-10 pt-1 mb-4">
      <!-- Left column -->
      <div class="grid text-left items-start gap-y-1">
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-left">Customer PO:</strong><span>{fmt(order.customerPO)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-left">Patient Name:</strong> <span>{fmt(patient.name)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-left">Customer Account:</strong> <span>{fmt(patient.account)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-left">Practitioner:</strong> <span>{fmt(patient.practitioner)}</span>
        </div>
      </div>

      <!-- Right column -->
      <div class="grid text-right items-start gap-y-1">
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-right">Order:</strong><span class="font-bold">{fmt(order.workorder)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-right">Date Needed:</strong><span>{fmt(order.neededDate)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-right">Ship Date:</strong><span>{fmt(order.shipDate) || fmt(order.neededDate)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-right">Delivery Date:</strong><span>{fmt(order.deliveryDate) || '—'}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong class="text-left">Date Submitted:</strong><span>{fmt(order.receivedDate)}</span>
        </div>
      </div>
    </div>

    <!-- Order type / ship method -->
    <div class="flex justify-between border-b-2 pb-10 mb-4">
      <div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong>Order Type:</strong><span>{fmt(order.type) || 'Standard'}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong>Ship Method:</strong><span>{fmt(order.shipping)}</span>
        </div>
      </div>
    </div>

    <!-- Bill To & Ship To -->
    <div class="grid grid-cols-2 gap-6 border-b-2 pb-10 mb-4">
      <!-- Bill To -->
      <div>
        <div class="flex items-start gap-4">
          <strong class="min-w-[80px]">Bill to:</strong>
          <div class="leading-tight">
            <p>{fmt(fd.name)}</p>
            <p>{fmt(fd.address)}</p>
            <p>{[fmt(fd.city), fmt(fd.state), fmt(fd.zip)]
              .filter(s => s && s !== '—')
              .join(', ') || '—'}</p>
            <p>{fmt(fd.contactEmail || patient.email)}</p>
          </div>
        </div>
      </div>

      <!-- Ship To -->
      <div>
        <div class="flex items-start gap-4">
          <strong class="min-w-[80px]">Ship to:</strong>
          <div class="leading-tight">
            <p>{fmt(fd.shipName || fd.name)}</p>
            <p>{fmt(fd.shipAddress || fd.address)}</p>
            <p>{[fmt(fd.shipCity || fd.city), fmt(fd.shipState || fd.state), fmt(fd.shipZip || fd.zip)]
              .filter(s => s && s !== '—')
              .join(', ') || '—'}</p>
            <p>{fmt(fd.contactEmail || patient.email)}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product -->
    <div class="flex justify-between border-b-2 pb-10 mb-4">
      <div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <strong>Product:</strong><span>{fmt(order.product)}</span>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-x-2">
          <p><strong>Quantity:</strong> {fmt(order.quantity) || '1'}</p>
        </div>
      </div>
    </div>

    <!-- Files -->
    <div class="border-b-2 pb-10 pt-5 mb-4 text-left">
      <p><strong>Order Form:</strong></p>
      <p><strong>Order File:</strong> {fmt(order.uploadedFileName || uploadedFileName)}</p>
    </div>

    <!-- Comment -->
    <div class="border-b-2 pb-15 mb-0 text-left">
      <p><strong>Comment:</strong></p>
      <p class="italic" style="color:#4b5563">{order.comment || 'None'}</p>
    </div>

    <!-- Footer -->
    <div class="text-center pt-10 text-xs mt-4">
      <p class="font-bold text-lg"><strong>BioSculptor Fabrication</strong></p>
      <p class="mt-2 text-sm">
        2480 West 82nd Street | Hialeah, FL 33016 | 305.823.8300 | 877.246.2884 | www.biosculptor.com
      </p>
    </div>
  </div>
</div>
