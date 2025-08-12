<script>
  // (kept for compatibility; currently unused in this component)
  export let showPrintClean = true;

  // ---- Incoming props (same shape you posted) ----
  export let order = {
    workorder: '',
    neededDate: '',
    receivedDate: '',
    shipping: '',
    product: 'Transtibial Socket',
    uploadedFileName: '',
    customerPO: '',
    type: 'Standard',
    quantity: '1',
    // These might be added later; we handle missing gracefully
    shipDate: '',
    deliveryDate: ''
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

  // Provided separately by the page during upload; we’ll prefer order.uploadedFileName if set
  export let uploadedFileName = '';

  // ---------- Helpers ----------
  const clean = (v) => (typeof v === 'string' ? v.trim() : v);
  const has = (v) => {
    const x = clean(v);
    return !(x === undefined || x === null || x === '');
  };
  const fmt = (v) => (has(v) ? String(clean(v)) : '—');

  const joinAddress = (parts) =>
    parts
      .map((p) => (has(p) ? String(clean(p)) : ''))
      .filter(Boolean)
      .join(', ') || '—';

  // Prefer file name from order, else the separate prop
  $: fileName = has(order.uploadedFileName) ? order.uploadedFileName : uploadedFileName;

  // Build a robust facility object:
  //  - Start with patient’s own fields (bill-to baseline)
  //  - Overlay facilityDetails if present
  //  - Ensure ship-to fields fall back to bill-to when missing
  $: baseBill = {
    name: patient.facility || patient.name || '',
    address: patient.address || '',
    city: patient.city || '',
    state: patient.state || '',
    zip: patient.zip || '',
    contactEmail: patient.email || ''
  };

  $: rawFD = patient.facilityDetails ?? {};
  $: bill = {
    name: rawFD.name ?? baseBill.name,
    address: rawFD.address ?? baseBill.address,
    city: rawFD.city ?? baseBill.city,
    state: rawFD.state ?? baseBill.state,
    zip: rawFD.zip ?? baseBill.zip,
    contactEmail: rawFD.contactEmail ?? baseBill.contactEmail
  };

  $: ship = {
    name: has(rawFD.shipName) ? rawFD.shipName : bill.name,
    address: has(rawFD.shipAddress) ? rawFD.shipAddress : bill.address,
    city: has(rawFD.shipCity) ? rawFD.shipCity : bill.city,
    state: has(rawFD.shipState) ? rawFD.shipState : bill.state,
    zip: has(rawFD.shipZip) ? rawFD.shipZip : bill.zip,
    contactEmail: bill.contactEmail 
  };

  // Expose formatted strings the template already uses
  $: billCityLine = joinAddress([bill.city, bill.state, bill.zip]);
  $: shipCityLine = joinAddress([ship.city, ship.state, ship.zip]);


</script>


<style>

 #print-summary {
  width: 8.5in;         /* full width */
  height: 11in;         /* fixed height (not max-height) */
  padding: 0.5in;       /* page margins inside the sheet */
  box-sizing: border-box;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
}

</style>

<div class="flex items-center justify-center min-h-screen border">
  <div id="print-summary" class="print-container bg-white text-black text-[12pt] leading-normal left-0">

    <!-- Header -->
<div class="header pb-10 text-2xl font-bold text-center mx-auto">
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
           <p>{fmt(bill.name)}</p>
<p>{fmt(bill.address)}</p>
<p>{billCityLine}</p>
<p>{fmt(bill.contactEmail)}</p>

          </div>
        </div>
      </div>

      <!-- Ship To -->
      <div>
        <div class="flex items-start gap-4">
          <strong class="min-w-[80px]">Ship to:</strong>
          <div class="leading-tight">
           <p>{fmt(ship.name)}</p>
<p>{fmt(ship.address)}</p>
<p>{shipCityLine}</p>
<p>{fmt(ship.contactEmail)}</p>

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
      <p><strong>Order File:</strong> {fmt(fileName)}</p>

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
