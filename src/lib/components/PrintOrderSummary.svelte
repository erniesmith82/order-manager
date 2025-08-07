<script>
  export let showPrintClean = true;
  export let order;
  export let patient;
  export let uploadedFileName = ''; 
</script>

<style>
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0.5in;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    .print-container {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      page-break-after: always;
    }

    body * {
      visibility: hidden;
    }

    #print-summary, #print-summary * {
      visibility: visible;
    }

    #print-summary {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>

<div class="border p-10">

<div id="print-summary" class="print-container bg-white text-black text-sm leading-tight">


 <div class="header pb-10 text-2xl font-bold">
      Order Summary
 </div>
<div class="flex justify-between border-b-2 pb-10 pt-05 mb-4">
  <!-- Left Column -->
 <div class="grid text-left items-start gap-y-1">
  <div class="grid grid-cols-[auto_1fr] gap-x-2">
    <strong class="text-left">Customer PO:</strong><span>{patient.name}</span>
  </div>
  <div class="grid grid-cols-[auto_1fr] gap-x-2">  
     <strong class="text-left">Patient Name:</strong> {patient.name}
  </div>
  <div class="grid grid-cols-[auto_1fr] gap-x-2">   
     <strong class="text-left">Customer Account:</strong> {patient.account}
  </div>   
  <div class="grid grid-cols-[auto_1fr] gap-x-2">   
     <strong class="text-left">Practitioner:</strong> {patient.practitioner}
  </div>
   <div class="grid grid-cols-[auto_1fr] gap-x-2">   
     <strong class="text-left">Practitioner:</strong> {patient.practitioner}
  </div>
 </div>
<!-- Right Column as Grid -->
<div class="grid text-right items-start gap-y-1">
  <div class="grid grid-cols-[auto_1fr] gap-x-2">
    <strong class="text-right">Order:</strong><span class="font-bold">{order.workorder}</span>
  </div>
  <div class="grid grid-cols-[auto_1fr] gap-x-2">
    <strong class="text-right">Date Needed:</strong><span>{order.neededDate}</span>
  </div>
  <div class="grid grid-cols-[auto_1fr] gap-x-2">
    <strong class="text-right">Ship Date:</strong><span>{order.neededDate}</span>
  </div>
  <div class="grid grid-cols-[auto_1fr] gap-x-2">
    <strong class="text-right">Delivery Date:</strong><span>{order.neededDate}</span>
  </div>
   <div class="grid grid-cols-[auto_1fr] gap-x-2">   
     <strong class="text-left">Date Submitted:</strong><span>{order.receivedDate}</span>
  </div>
  
</div>

</div>

<!-- Shipping and Billing -->

  <div class="flex justify-between border-b-2 pb-10 mb-4">
 <div>
  <div class="grid grid-cols-[auto_1fr] gap-x-2"> 
      <strong>Order Type:</strong><span>Standard</span>
  </div>
      <div class="grid grid-cols-[auto_1fr] gap-x-2">  
        <strong>Ship Method:</strong><span>{order.shipping}</span>
      </div>
    </div>
  </div>
<div class="grid grid-cols-2 gap-6 border-b-2 pb-10 mb-4">
  <!-- Bill To -->
  <div>
    <div class="flex items-start gap-4">
      <strong class="min-w-[80px]">Bill to:</strong>
     {#if patient.facilityDetails}
      <div class="leading-tight">
        <p>{patient.facilityDetails.name}</p>
        <p>{patient.facilityDetails.address}</p>
        <p>{patient.facilityDetails.city}, {patient.facilityDetails.state} {patient.facilityDetails.zip}</p>
        <p>{patient.email}</p> 
      </div>
      {/if}
    </div>
  </div>

  <!-- Ship To -->
  <div>
    <div class="flex items-start gap-4">
  <strong class="min-w-[80px]">Ship to:</strong>
  {#if patient.facilityDetails}
    <div class="leading-tight">
      <p>{patient.facilityDetails.name}</p>
      <p>{patient.facilityDetails.address}</p>
      <p>{patient.facilityDetails.city}, {patient.facilityDetails.state} {patient.facilityDetails.zip}</p>
      <p>{patient.email}</p>
    </div>
  {/if}
</div>

  </div>
</div>

<!-- Product-->
 
    
    <div class="flex justify-between border-b-2 pb-10 mb-4">
      <div>
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
   <strong>Product:</strong><span>{order.product}</span>
     </div>
      <div class="grid grid-cols-[auto_1fr] gap-x-2">
    <p><strong>Quantity:</strong> 1</p>
      </div>
    </div>
    </div>
  

  <div class="border-b-2 pb-10 pt-5 mb-4 text-left">
    <p><strong>Order Form:</strong></p>
    <p><strong>Order File:</strong> {order.uploadedFileName}</p>
  </div>

<!-- Comment section with hex-safe color -->
<div class="border-b-2 pb-20 mb-4 text-left">
  <p><strong>Comment:</strong></p>
  <p class="italic" style="color: #4b5563;">{order.comment || 'None'}</p>

</div>

  <div class="text-center pt-15 text-xs mt-6">
    <p class="fon-bold text-lg"><strong>BioSculptor Fabrication</strong></p>
   <p class="mt-2 text-sm">
      2480 West 82nd Street | Hialeah, FL 33016 | 305.823.8300 | 877.246.2884 | www.biosculptor.com
    </p>
  </div>
</div>
</div>
