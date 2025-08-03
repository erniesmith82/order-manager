<script>
  let patient = {
    name: '', facility: '', account: '',
    height: '', weight: '', age: '', practitioner: '',
    sex: '', activity: '', side: '', email: '', phone: ''
  };

  let order = {
    shipping: '', neededDate: '', receivedDate: '', workorder: ''
  };

  let liner = { type: '', size: '', thickness: '' };
  let foot = { type: '', size: '' };

  let canSubmit = false;

  let requiredFields = [
    () => patient.name.trim(),
    () => patient.practitioner.trim(),
    () => patient.email.trim(),
    () => patient.phone.trim(),
    () => patient.activity.trim(),
    () => patient.side.trim(),
    () => patient.age.trim(),
    () => order.shipping.trim(),
    () => order.neededDate.trim(),
    () => order.receivedDate.trim()
  ];

  function checkFormValidity() {
    canSubmit = requiredFields.every(fn => fn());
  }


  async function handleSubmit() {
    checkFormValidity();
    if (!canSubmit) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient, order, liner, foot })
      });

      if (response.ok) {
        alert("Order submitted successfully!");
      } else {
        alert("Failed to submit order.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred during submission.");
    }
  }
</script>


<style global>
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0;
    }

    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border: 1px solid black;
      position: relative;
    }

    input[type="checkbox"]:checked::before {
      content: "✔";
      position: absolute;
      font-size: 10px;
      top: -2px;
      left: 1px;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-size: 10px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body * {
      visibility: hidden;
    }

    .no-print,
    aside,
    nav,
    .sidebar,
    .layout-nav {
      display: none !important;
      visibility: hidden !important;
    }

    #form-wrapper,
    #form-wrapper * {
      visibility: visible;
    }

    #form-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 8.5in;
      padding: 0.4in;
      box-sizing: border-box;
      transform: scale(0.96);
      transform-origin: top left;
    }

    #logo {
      height: 250px !important;
      max-width: 100% !important;
    }

    img[alt="Socket Diagram"] {
      height: 600px !important;
      margin-top: -120px !important;
    }

    #print-header {
      width: 118% !important;
      height: 80px !important;
      margin-top: 70px !important;
      padding: 6px 8px 4px 8px !important;
      align-items: center !important;
    }

    #print-header-title {
      font-size: 24px !important;
      text-align: right !important;
    }

    #print-header-subtitle {
      font-size: 18px !important;
      text-align: right !important;
    }

    #print-shrink,
    #print-shrink * {
      font-size: 94% !important;
    }

    #notes {
      margin-top: -3rem !important;
    }

    input, textarea, select {
      border: none !important;
      background: transparent !important;
      font-weight: bold !important;
    }
  }

  @media screen and (max-width: 640px) {
    #form-wrapper {
      transform: scale(0.95);
    }
    #print-header {
      flex-direction: column;
      text-align: center;
    }
    #print-shrink input,
    #print-shrink textarea {
      font-size: 0.875rem;
    }
    .flex {
      flex-direction: column;
    }
    .w-1\/2, .w-1\/3, .w-1\/4, .w-1\/5, .w-1\/6 {
      width: 100% !important;
    }
  }
</style>



<div id="form-wrapper" class="scale-[1.2] origin-top w-[850px] mx-auto print:mt-[-90px]">

<div id="print-area">
  <div id="print-header" class="print:scale-[0.85] print:origin-top-left px-4 print:px-2 pt-2 border-b-2 border-black flex justify-between items-center">
  <img
  id="logo"
    src="/BiosculptorFabrications.png"
    class="h-48 w-auto print:h-[60px] print:pl-0"
    alt="BioSculptor Logo"
/>
<div class="text-right space-y-1 pr-2">
  <div class="text-[#f58220] font-bold leading-tight text-2xl" id="print-header-title">
    Custom Transtibial Socket
  </div>
  <div class="text-black font-bold leading-tight text-lg" id= "print-header-subtitle">
    FABRICATION ORDER
  </div>
</div>


</div>

<div id="print-shrink">
  <div class="flex justify-end gap-6 text-xl font-bold pt-4">
    <label class="inline-flex items-center gap-1">
      <input type="checkbox" class="w-4 h-4" /> Measurements
    </label>
    <label class="inline-flex items-center gap-1">
      <input type="checkbox" class="w-4 h-4" /> Scan
    </label>
    <label class="inline-flex items-center gap-1">
      <input type="checkbox" class="w-4 h-4" /> Cast
    </label>
  </div>

  <div class="mt-4 space-y-2 text-sm">
    <!-- Order Info Row -->
    <div class="flex justify-end">
      <div class="border border-gray-400 p-2 w-[14%] h-16 text-center font-bold text-[#f58220]">PATIENT<br />INFORMATION</div>
      <div class="border border-gray-400 p-2 w-[30%] h-16">
        <label class="block text-xs font-semibold -mt-2">Workorder Number</label>
        <input bind:value={order.workorder} class="w-full h-full text-[#f58220]" />
      </div>
      <div class="border border-gray-400 p-2 w-[14%] h-16 text-center font-bold text-[#f58220]">CUSTOMER<br />INFORMATION</div>
     <div class="border border-gray-400 p-2 w-[14%] h-16">
  <label class="block text-xs font-semibold -mt-2">Shipping Method</label>
  <input bind:value={order.shipping} required on:input={checkFormValidity} class="w-full h-full" />
</div>
<div class="border border-gray-400 p-2 w-[14%] h-16">
  <label class="block text-xs font-semibold -mt-2">Needed Date</label>
  <input type="date" bind:value={order.neededDate} required on:input={checkFormValidity} class="w-full h-full" />
</div>
<div class="border border-gray-400 p-2 w-[14%] h-16">
  <label class="block text-xs font-semibold -mt-2">Received Date</label>
  <input type="date" bind:value={order.receivedDate} required on:input={checkFormValidity} class="w-full h-full" />
</div>

    </div>

    <!-- Patient Info -->
   <div class="space-y-1">
  <div class="flex">
    <div class="border border-gray-400 p-2 w-[44%] h-12">
      <label class="block text-xs font-semibold -mt-2">Patient Name</label>
      <input bind:value={patient.name} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[28%] h-12">
      <label class="block text-xs font-semibold -mt-2">Facility</label>
      <input bind:value={patient.facility} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[28%] h-12">
      <label class="block text-xs font-semibold -mt-2">Account Number</label>
      <input bind:value={patient.account} class="w-full h-full" />
    </div>
  </div>
  <div class="flex">
    <div class="border border-gray-400 p-2 w-[14.67%] h-12">
      <label class="block text-xs font-semibold -mt-2">Height</label>
      <input bind:value={patient.height} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[14.67%] h-12">
      <label class="block text-xs font-semibold -mt-2">Weight</label>
      <input bind:value={patient.weight} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[14.67%] h-12">
      <label class="block text-xs font-semibold -mt-2">Age</label>
      <input bind:value={patient.age} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[56%] h-12">
      <label class="block text-xs font-semibold -mt-2">Practitioner</label>
      <input bind:value={patient.practitioner} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
  </div>
  <div class="flex">
    <div class="border border-gray-400 p-2 w-[14.67%] h-12">
      <label class="block text-xs font-semibold -mt-2">Sex</label>
      <input bind:value={patient.sex} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[14.67%] h-12">
      <label class="block text-xs font-semibold -mt-2">Activity Level</label>
      <input bind:value={patient.activity} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[14.67%] h-12">
      <label class="block text-xs font-semibold -mt-2 text-center">Side</label>
      <div class="flex gap-2 items-center justify-center">
        <label>
          <input type="radio" bind:group={patient.side} value="left" required on:input={checkFormValidity} />
          Left
        </label>
        <label>
          <input type="radio" bind:group={patient.side} value="right" required on:input={checkFormValidity} />
          Right
        </label>
      </div>
    </div>
    <div class="border border-gray-400 p-2 w-[28%] h-12">
      <label class="block text-xs -mt-2 font-semibold">Email</label>
      <input bind:value={patient.email} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[28%] h-12">
      <label class="block text-xs -mt-2 font-semibold">Phone Number</label>
      <input bind:value={patient.phone} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
  </div>
</div>
  </div>


  <!-- Materials + Diagram -->
  <div class="flex w-full mt-4 gap-2">
    <div class="w-1/2 pr-2 text-sm space-y-2">
      <div>
        <h3 class="text-xl font-bold text-[#f58220]">Materials & Components</h3>
        <div class="flex flex-col gap-1 pt-1">
          {#each ['PP', 'PE', 'FLEXFORM', 'Pelite Cone', 'Acrylic / Duraflex / Dioclear'] as item}
            <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4" /> {item}</label>
          {/each}
        </div>
      </div>

      <div class="text-sm">
  <h4 class="text-sm font-semibold text-[#f58220]">Liner Type</h4>
  <div class="pl-2 space-y-1">
    <div class="flex items-center gap-1">
      <label class="w-20">Type:</label>
      <input
        bind:value={liner.type}
        placeholder="Type"
        class="border-b border-black w-[50%] bg-transparent outline-none text-sm py-0.5"
      />
    </div>
    <div class="flex items-center gap-1">
      <label class="w-20">Size:</label>
      <input
        bind:value={liner.size}
        placeholder="Size"
        class="border-b border-black w-[50%] bg-transparent outline-none text-sm py-0.5"
      />
    </div>
    <div class="flex items-center gap-1">
      <label class="w-20">Thickness:</label>
      <input
        bind:value={liner.thickness}
        placeholder="Thickness"
        class="border-b border-black w-[50%] bg-transparent outline-none text-sm py-0.5"
      />
    </div>
  </div>
</div>


      <div>
        <h4 class="text-base font-semibold text-[#f58220]">Suspension</h4>
        {#each ['Section', 'Pin Lock Type', 'Silicone Valve Sleeve'] as s}
          <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4" /> {s}</label>
        {/each}
      </div>

      <div>
        <h4 class="text-base font-semibold text-[#f58220]">Distal End</h4>
        {#each ['Fitted', 'Injection Void', 'Injection Kit'] as s}
          <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4" /> {s}</label>
        {/each}
      </div>

      <div class="text-sm">
  <h4 class="text-sm font-semibold text-[#f58220]">Foot</h4>
  <div class="pl-2 space-y-1">
    <div class="flex items-center gap-1">
      <label class="w-12">Type:</label>
      <input
        bind:value={foot.type}
        placeholder="Type"
        class="border-b border-black w-[50%] bg-transparent outline-none text-sm py-0.5"
      />
    </div>
    <div class="flex items-center gap-1">
      <label class="w-12">Size:</label>
      <input
        bind:value={foot.size}
        placeholder="Size"
        class="border-b border-black w-[50%] bg-transparent outline-none text-sm py-0.5"
      />
    </div>
  </div>
</div>
    </div>

    <div class="w-1/2 flex flex-col items-center">
      <img src="/transtibialDiagram.png" alt="Socket Diagram" class="h-[650px] object-contain -mt-0 relative z-0" />
      <div id="legend" class="text-center text-xs pt-1 -mt-30">
        a. SC ML<br />b. Femoral Condyle ML<br />c. Depth of Medial Flare<br />d. MPT to Distal
      </div>
    </div>
  </div>

  <!-- Notes Section -->
  <div class="mt-4" id="notes">
    <h3 class="text-xl font-bold text-[#f58220] border-b pb-1">Notes and Modification Instructions</h3>
    <div class="border border-dashed border-gray-400 h-24 p-2 mt-1 text-sm">
      <textarea
      rows="4"
      placeholder="Enter notes or modification instructions here..."
      class="w-full h-full resize-none outline-none bg-transparent"
    ></textarea>
    </div>
  </div>
</div>
  <!-- Footer -->
  <div class="text-center text-lg mt-4">
   <div class="text-center mt-6 no-print">
 <button
  on:click={handleSubmit}
  class="bg-[#f58220] text-white font-bold py-2 px-6 rounded hover:bg-[#e4711a] transition"
  disabled={!canSubmit}
>
  Submit Order
</button>
</div>

    <p class="mt-2 text-sm">
      2480 West 82nd Street | Hialeah, FL 33016 | 305.823.8300 | 877.246.2884 | www.biosculptor.com
    </p>
  </div>
</div>
</div>

