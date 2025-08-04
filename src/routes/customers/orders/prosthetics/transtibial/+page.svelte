<script>
  let patient = {
    name: '', facility: '', account: '',
    height: '', weight: '', age: '', practitioner: '',
    sex: '', activity: '', side: '', email: '', phone: ''
  };

let now = new Date();
let todayFormatted = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
let today = now.toISOString().split('T')[0]; 

let order = {
  shipping: '',
  neededDate: '',
  receivedDate: todayFormatted, // US MM/DD/YYYY display format
  workorder: ''
};

let errors = {
  name: false,
  practitioner: false,
  email: false,
  phone: false,
  activity: false,
  side: false,
  shipping: false,
  neededDate: false,
  receivedDate: false,
  file: false
};

  let uploadedFile = null;


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
    ];

function checkFormValidity() {
  errors.name = !patient.name.trim();
  errors.practitioner = !patient.practitioner.trim();
  errors.email = !patient.email.trim();
  errors.phone = !patient.phone.trim();
  errors.activity = !patient.activity.trim();
  errors.side = !patient.side.trim();
  errors.age = !patient.age.trim();
  errors.shipping = !order.shipping.trim();
  errors.neededDate = !order.neededDate.trim();
  errors.file = !uploadedFile;

  canSubmit = Object.values(errors).every(val => !val);
}



  async function handleSubmit() {
  console.log("Submit button clicked");

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
// Get current year and ISO week number
function getCurrentWorkorderPrefix() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);

  // Calculate ISO week number
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);

  const paddedWeek = String(week).padStart(2, '0');
  return `${year}${paddedWeek}`;
}

// For now, we start with order #1 (buffered as 0001)
function generateWorkorderNumber(sequence = 1) {
  const prefix = getCurrentWorkorderPrefix();
  const paddedSeq = String(sequence).padStart(4, '0');
  return `${prefix}${paddedSeq}`;
}

// Initialize the value
order.workorder = generateWorkorderNumber();


</script>


<style global>
  @media print {
    @page {
      size: 8.5in 11in;
      margin: 0;
    }
      select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: none;
      padding-right: 0;
      font-size: 10pt !important;
      text-overflow: clip;
    }

    option {
      font-size: 10pt;
    }
  
  /* Remove calendar icon (Chrome, Edge, Safari) */
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }

  /* Optional: remove background icon space */
  input[type="date"] {
    background: none;
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
  top: 45px;
  left: 0;
  width: 8.5in;
  padding: 0.4in;
  box-sizing: border-box;
  transform: scale(0.85);
  margin-left: 40px;
  margin-right: 40px;
  
}
 #measurementB{
   left: 51.5%;
   top: 51%;
 }

  #measurementA{
   left: 85.5%;
   top: 49%;
 }

  #measurementD{
   left: 59%;
   top: 59.5%;
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
      margin-top: -1rem !important;
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

<!-- File Upload Input -->
 <div id=" fullPage" class="h-490 bg-gradient-to-b from-black/60 via-gray-900/50 to-black/60  p-8">
<div class="mt-4 no-print flex justify-center border-2 border-[#f58220] w-[65%] bg-white p-4 mx-auto rounded">
  <div class="flex flex-col items-center w-full max-w-sm">
    <label for="fileUpload" class={`text-xl text-[#f58220] font-bold mb-2 text-center  ${errors.file ? 'border-2 border-red-500' : ''}`}>
      Upload File:
    </label>
    <input
      id="fileUpload"
      type="file"
      required
      on:change={(e) => uploadedFile = e.target.files[0]}
      class="block w-full text-sm text-gray-700 border border-gray-300 rounded py-2 px-3"
    />
  </div>
</div>

<!-- start of form -->

<div id="form-wrapper" class="scale-[1.2] origin-top w-[1100px] p-8 mx-auto mt-5 print:mt-[-90px] bg-white">

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
    <div class="border border-gray-400 p-2 w-[25%] h-16">
  <label class="block text-xs font-bold -mt-2 text-[#f58220]">Workorder Number</label>
  <input bind:value={order.workorder} class="w-full h-full font-bold text-2xl" />
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
      <label class="block text-xs font-semibold -mt-2">Facility</label>
      <input bind:value={patient.facility} class="w-full h-full" />
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
      class="w-full h-full resize-none outline-none bg-transparent"
    ></textarea>
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
