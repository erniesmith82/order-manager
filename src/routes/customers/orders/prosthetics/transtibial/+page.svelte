<script>
  import { onMount } from 'svelte';
  import PrintOrderSummary from '$lib/components/PrintOrderSummary.svelte';

  export let data;

  // User info
  let user = data?.user ?? { facilities: [] };
  let workorder = data.workorder;

  // File state
  let uploadedFile = null;
  let uploadedFileName = '';

  // Date setup
  const now = new Date();
  const todayFormatted = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
  const today = now.toISOString().split('T')[0];

  // Order object
  let order = {
    workorder: data.workorder,
    receivedDate: todayFormatted,
    shipping: '',
    neededDate: '',
    uploadedFileName: '',
    product: 'Transtibial Socket',
    comment: ''
  };

  // Patient details
  let patient = {
    name: '', facility: '', account: '',
    height: '', weight: '', age: '', practitioner: '',
    sex: '', activity: '', side: [], email: '', phone: ''
  };

  // Misc
  let liner = { type: '', size: '', thickness: '' };
  let foot = { type: '', size: '' };
  let canSubmit = false;

  // Validation tracking
  let errors = {
    name: false, practitioner: false, email: false, phone: false,
    activity: false, side: false, shipping: false,
    neededDate: false, receivedDate: false, file: false
  };

  // ✅ Step 1: Validate required fields
  function checkFormValidity() {
    const required = [
      patient.name, patient.practitioner, patient.email,
      patient.phone, patient.activity, patient.side, patient.age,
      order.shipping, order.neededDate, order.receivedDate
    ];

    canSubmit = required.every(f =>
      (typeof f === 'string' && f.trim() !== '') ||
      (Array.isArray(f) && f.length > 0)
    );
  }

  // 📤 Step 2: Submit form with JPG + PDF capture
  async function handleSubmit() {
    checkFormValidity();

    if (!canSubmit || !uploadedFile) {
      alert("Please fill out all required fields and upload a file.");
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        const { default: html2canvas } = await import('html2canvas');
        const html2pdf = (await import('html2pdf.js')).default;

        // 🔍 Select clean order summary element (JPG)
        const cleanElement = document.getElementById('print-clean');
        cleanElement.classList.remove('hidden');

        const canvas = await html2canvas(cleanElement, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#fff'
        });

        const jpgBlob = await new Promise(resolve =>
          canvas.toBlob(resolve, 'image/jpeg', 0.95)
        );

        cleanElement.classList.add('hidden');

        // 🔍 Select printable summary element (PDF)
        const summaryElement = document.getElementById('print-summary');
        const pdfBlob = await html2pdf().from(summaryElement).set({
          margin: 0.5,
          filename: 'Transtibial_Socket_Summary.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).outputPdf('blob');

        // ✅ Store filename and product info
        uploadedFileName = uploadedFile.name;
        order.uploadedFileName = uploadedFileName;
        order.product = 'Transtibial Socket';

        // 📨 Build submission payload
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('printFile', jpgBlob, 'printable.jpg');
        formData.append('printSummary', pdfBlob, 'print-summary.pdf');
        formData.append('order', JSON.stringify(order));
        formData.append('patient', JSON.stringify(patient));
        formData.append('liner', JSON.stringify(liner));
        formData.append('foot', JSON.stringify(foot));

        const res = await fetch('/api/submit-order', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();

        if (res.ok && result.success) {
          alert(`✅ Order ${result.workorder} submitted successfully!`);
          window.location.href = '/customers/orders';
        } else {
          alert("❌ Submission failed.");
        }
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
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
  #print-clean {
  position: absolute;
  top: 0;
  left: 0;
  width: 8.5in;
  height: 11in;
  padding: 0.4in;
  box-sizing: border-box;
  transform: scale(1);
  overflow: hidden;
}

    input,
    textarea,
    select {
      border: none !important;
      background: transparent !important;
      font-weight: bold !important;
      font-size: inherit !important;
      color: #000 !important;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }

    input[type="date"] {
      background: none;
    }



    input[type="checkbox"]:checked::before {
      content: "✔";
      position: absolute;
      font-size: 10px;
      top: -2px;
      left: 1px;
    }

    #logo {
      height: 250px !important;
      max-width: 100% !important;
    }

    img[alt="Socket Diagram"] {
      height: 600px !important;
      width: auto;
      margin-top: -125px !important;
    }



    #notes {
      margin-top: -1rem !important;
    }

    #measurementB { left: 51.5%; top: 51%; }
    #measurementA { left: 85.5%; top: 49%; }
    #measurementD { left: 59%; top: 59.5%; }

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

  }
</style>

<!-- File Upload Input -->
<div id="fullPage" class="h-490 bg-gradient-to-b from-[rgba(0,0,0,0.6)] via-[rgba(55,65,81,0.5)] to-[rgba(0,0,0,0.6)] p-8">
  <div class="mt-4 no-print flex justify-center border-2 border-[#f58220] w-[65%] bg-white p-4 mx-auto rounded">
    <div class="flex flex-col items-center w-full max-w-sm">
      <label
        for="fileUpload"
        class={`text-xl text-[#f58220] font-bold mb-2 text-center ${errors.file ? 'border-2 border-red-500' : ''}`}
      >
        Upload File:
      </label>

      <!-- ✅ Custom label area -->
  {#if order.uploadedFileName}
  <p class="text-sm font-bold text-[rgba(21,128,61,1)] mb-2">{order.uploadedFileName}</p>
{/if}
      <input
        id="fileUpload"
        type="file"
        required
        on:change={(e) => {
          uploadedFile = e.target.files[0];
          uploadedFileName = uploadedFile?.name || '';
        }}
        class="block w-full text-sm text-[rgba(55,65,81,1)] border border-[rgba(209,213,219,1)] rounded py-2 px-3 file:opacity-0 file:absolute file:h-0"
      />
    </div>
  </div>

<!-- start of form -->
<div  id="print-area" >
<div id="form-wrapper" class="scale-[1.2] origin-top w-[1100px] p-15 mx-auto mt-3 print:mt-[-90px] bg-white">

<div class="bg-white text-black text-[12px] leading-tight">

  <div  class="print:scale-[0.85] print:origin-top-left px-4 print:px-2 pt-2 border-b-2 border-black flex justify-between items-center">
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
    <div class="border border-gray-400 p-2 w-[25%] h-16">
  <label class="block text-xs font-bold -mt-2 text-[#f58220]">Workorder Number</label>
  <input type="text" bind:value={order.workorder} readonly class="w-full h-full font-bold text-2xl" />

</div>
      <div class="border border-gray-400 p-2 w-[14%] h-16 text-center font-bold text-[#f58220]">CUSTOMER<br />INFORMATION</div>
     <div class="border border-gray-400 p-2 w-[16.5%] h-16">
  <label class="block text-xs font-semibold  -mt-2">Shipping Method</label>
  <select
    bind:value={order.shipping}
    required
    on:input={checkFormValidity}
    class={`w-full h-full bg-white text-xs ${errors.shipping ? 'border-2 border-red-500' : ''}`} 
  >
    <option value="" disabled selected>Select method</option>
    <optgroup label="UPS">
      <option value="UPS Ground">UPS Ground</option>
      <option value="UPS 2nd Day Air">UPS 2nd Day Air</option>
      <option value="UPS Next Day Air">UPS Next Day Air</option>
    </optgroup>
    <optgroup label="FedEx">
      <option value="FedEx Ground">FedEx Ground</option>
      <option value="FedEx Express Saver">FedEx Express Saver</option>
      <option value="FedEx 2Day">FedEx 2Day</option>
      <option value="FedEx Standard Overnight">FedEx Standard Overnight</option>
    </optgroup>
    <option value="In-Site Pickup">In-Site Pickup</option>
  </select>
</div>

<div class="border border-gray-400 p-2 w-[16.5%] h-16">
  <label class="block text-xs font-semibold -mt-2">Needed Date</label>
  <input
    type="date"
    bind:value={order.neededDate}
    required
    on:input={checkFormValidity}
    class={`w-full h-full ${errors.neededDate ? 'border-2 border-red-500' : ''}`}
  />
</div>
<div class="border border-gray-400 p-2 w-[14%] h-16">
  <label class="block text-xs font-semibold -mt-2">Received Date</label>
<input type="text" class="w-[107%]" bind:value={order.receivedDate} />

</div>


    </div>

    <!-- Patient Info -->
   <div class="space-y-1">
  <div class="flex">
    <div class="border border-gray-400 p-2 w-[39%] h-12">
      <label class="block text-xs font-semibold -mt-2">Patient Name</label>
      <input bind:value={patient.name} required on:input={checkFormValidity} class={`w-full h-full ${errors.name ? 'border-2 border-red-500' : ''}`}  />
    </div>
    <div class="border border-gray-400 p-2 w-[33%] h-12">
{#if user?.facilities?.length}
  <label class="block text-xs font-semibold -mt-2">Facility</label>
  <select
    bind:value={patient.facility}
    class="w-full h-full border border-gray-300 rounded p-1 text-sm"
  >
    <option value="" disabled selected>Select a facility</option>

    {#each user.facilities as facility}
      <option value={facility.name}>{facility.name}</option>
    {/each}
  </select>
{:else}
  <p class="text-sm italic text-gray-500">No facilities found</p>
{/if}


    </div>
    <div class="border border-gray-400 p-2 w-[28%] h-12">
      <label class="block text-xs font-semibold -mt-2">Account Number</label>
      <input bind:value={patient.account} class="w-full h-full" />
    </div>
  </div>
  <div class="flex">
    <div class="border border-gray-400 p-2 w-[13%] h-12">
      <label class="block text-xs font-semibold -mt-2">Height</label>
      <input bind:value={patient.height} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[13%] h-12">
      <label class="block text-xs font-semibold -mt-2">Weight</label>
      <input bind:value={patient.weight} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[13%] h-12">
      <label class="block text-xs font-semibold -mt-2">Age</label>
      <input bind:value={patient.age} required on:input={checkFormValidity} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[61%] h-12">
      <label class="block text-xs font-semibold -mt-2">Practitioner</label>
      <input bind:value={patient.practitioner} required on:input={checkFormValidity} class={`w-full h-full ${errors.practitioner ? 'border-2 border-red-500' : ''}`} />
    </div>
  </div>
  <div class="flex">
    <div class="border border-gray-400 p-2 w-[13%] h-12">
      <label class="block text-xs font-semibold -mt-2">Sex</label>
      <input bind:value={patient.sex} class="w-full h-full" />
    </div>
    <div class="border border-gray-400 p-2 w-[13%] h-12">
      <label class="block text-xs font-semibold -mt-2">Activity Level</label>
      <input bind:value={patient.activity} required on:input={checkFormValidity} class={`w-full h-full ${errors.activity ? 'border-2 border-red-500' : ''}`} />
    </div>
    <div class="border border-gray-400 p-2 w-[13%] h-12">
      <label class="block text-xs font-semibold -mt-2 text-center">Side</label>
      <div class="flex gap-2 items-center justify-center">
        <label class="flex items-center gap-0.5">
          <input type="checkbox" bind:group={patient.side} value="left" required on:input={checkFormValidity} class={`${errors.side ? 'border-2 border-red-500' : ''}`} />
          Left
        </label>
        <label class="flex items-center gap-0.5">
          <input type="checkbox" bind:group={patient.side} value="right" required on:input={checkFormValidity} class={` ${errors.side ? 'border-2 border-red-500' : ''}`} />
          Right
        </label>
      </div>
    </div>
    <div class="border border-gray-400 p-2 w-[33%] h-12">
      <label class="block text-xs -mt-2 font-semibold">Email</label>
      <input bind:value={patient.email} required on:input={checkFormValidity} class={`w-full h-full ${errors.name ? 'border-2 border-red-500' : ''}`}/>
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
  <h4 class="text-lg font-semibold text-[#f58220]">Liner Type</h4>
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
        <h4 class="text-lg font-semibold text-[#f58220]">Suspension</h4>
        {#each ['Section', 'Pin Lock Type', 'Silicone Valve Sleeve'] as s}
          <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4" /> {s}</label>
        {/each}
      </div>

      <div>
        <h4 class="text-lg font-semibold text-[#f58220]">Distal End</h4>
        {#each ['Fitted', 'Injection Void', 'Injection Kit'] as s}
          <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4" /> {s}</label>
        {/each}
      </div>

      <div class="text-sm">
  <h4 class="text-lg font-semibold text-[#f58220]">Foot</h4>
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
      <input id="measurementB"
    type="text"
    class="absolute top-[54%] left-[55%] w-16 h-8 border font-bold text-center text-sm"
    placeholder=""
  />
     <input id="measurementD"
    type="text"
    class="absolute top-[52.5%] left-[85.5%] w-16 h-8 border font-bold text-center text-sm"
    placeholder=""
  />
   <input id="measurementA"
    type="text"
    class="absolute top-[62.5%] left-[62%] w-16 h-8 border font-bold text-center text-sm"
    placeholder=""
  />
      <div id="legend" class="text-center text-xs pt-1 -mt-30">
        a. SC ML<br />b. Femoral Condyle ML<br />c. Depth of Medial Flare<br />d. MPT to Distal
        <br> <strong>IF LINER IS UTO BE USED, MEASUREMENTS ARE TAKEN OVER LINER. </strong>
      </div>
    </div>
  </div>

  <!-- Notes Section -->
  <div class="mt-4" id="notes">
    <h3 class="text-2xl font-bold text-[#f58220] border-b pb-1">Notes and Modification Instructions</h3>
    <div class="border border-dashed border-gray-400 h-24 p-2 mt-1 text-sm">
      <textarea
  rows="4"
  placeholder="Enter notes or modification instructions here..."
  bind:value={order.comment}
  class="w-full h-full resize-none outline-none bg-transparent"
/>
    </div>
  </div>
</div>
  <!-- Footer -->
  <div class="text-center text-lg mt-4">
   <div class="text-center mt-6 no-print">
<button
  on:click={() => {
    console.log("Submit button clicked");
    handleSubmit();
  }}
  class="bg-[#f58220] text-white font-bold py-2 px-6 rounded hover:bg-[#e4711a] transition"
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
</div>
</div>
<!-- ✅ Hidden clean layout for JPG generation -->

<!-- Always rendered -->

<div
  id="print-clean"
  class="hidden print-clean bg-white text-black px-10 py-8 text-sm leading-tight"
>

  <PrintOrderSummary
    {order}
    {patient}
    {liner}
    {foot}
    uploadedFileName={uploadedFileName}
  />
</div>
