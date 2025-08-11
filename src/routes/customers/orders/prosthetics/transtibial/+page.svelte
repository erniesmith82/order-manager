<script>
  import { onMount, tick } from 'svelte';
  import PrintOrderSummary from '$lib/components/PrintOrderSummary.svelte';

  export let data;

  // State
  let user = data?.user ?? { id: null, facilities: [] };
  let uploadedFile = null;
  let uploadedFileName = '';
  let submitting = false;

  const todayFormatted = (() => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
  })();

  // Do NOT prefill workorder (server assigns final)
  let order = {
    workorder: '',
    receivedDate: todayFormatted,
    shipping: '',
    neededDate: '',
    uploadedFileName: '',
    product: 'Transtibial Socket',
    comment: ''
  };

  let patient = {
    name: '', facility: '', facilityDetails: null, account: '',
    height: '', weight: '', age: '', practitioner: '',
    sex: '', activity: '', side: [], email: '', phone: ''
  };

  let liner = { type: '', size: '', thickness: '' };
  let foot  = { type: '', size: '' };

  let canSubmit = false;
  let errors = {
    name: false, practitioner: false, email: false, phone: false,
    activity: false, side: false, shipping: false, neededDate: false,
    receivedDate: false, file: false, age: false
  };

  // ---------- Facilities ----------
  const norm = (s) => (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

  // Accept either facility name (preferred) or id, return details object
  function resolveFacility(val) {
    if (!val) return null;
    const byName = user?.facilities?.find((f) => norm(f.name) === norm(val));
    if (byName) return byName;
    return user?.facilities?.find((f) => String(f.id) === String(val)) || null;
  }

  // Keep details in sync whenever the selected value or user list changes
  $: patient.facilityDetails = resolveFacility(patient.facility) ?? patient.facilityDetails ?? null;

  // STEP 3: Refresh user (and facilities) on the client after SSR, then set defaults safely
  onMount(async () => {
    // clear any browser-restored WO text
    order.workorder = '';

    try {
      if (user?.id) {
        const res = await fetch(`/api/users/${user.id}`);
        if (res.ok) {
          const fresh = await res.json();
          user = { ...fresh, facilities: Array.isArray(fresh.facilities) ? fresh.facilities : [] };
        }
      }
    } catch (e) {
      console.error('Failed to refresh user facilities:', e);
    }

    // If no facility chosen, or chosen facility no longer exists, default to first available
    if (user?.facilities?.length) {
      const exists = resolveFacility(patient.facility);
      if (!exists) {
        patient.facility = user.facilities[0].name ?? user.facilities[0].id;
        patient.facilityDetails = user.facilities[0];
      }
    } else {
      // no facilities available; ensure cleared
      patient.facility = '';
      patient.facilityDetails = null;
    }

    try { document.fonts?.ready?.then(() => {}); } catch {}
    checkFormValidity();
  });

  // ---------- Validation ----------
  function checkFormValidity() {
    const required = [
      patient.name, patient.practitioner, patient.email, patient.phone,
      patient.activity, patient.side, patient.age,
      order.shipping, order.neededDate, order.receivedDate
    ];
    canSubmit = required.every((f) =>
      (typeof f === 'string' && f.trim() !== '') || (Array.isArray(f) && f.length > 0)
    );
  }

  // ---------- Capture ----------
  const LETTER_W = 1632;
  const LETTER_H = 2112;

  async function waitForFontsAndImages(container) {
    try { await document.fonts?.ready; } catch {}
    const imgs = Array.from(container.querySelectorAll('img'));
    await Promise.all(imgs.map((img) => img.decode?.().catch(() => {})));
  }

  function toggleCaptureMode(node, on) {
    if (!node) return () => {};
    if (typeof on === 'boolean') on ? node.classList.add('capture-mode') : node.classList.remove('capture-mode');
    else node.classList.toggle('capture-mode');
    return () => node.classList.remove('capture-mode');
  }

  function hideFormControls(node) {
    const els = Array.from(node.querySelectorAll('.no-capture, input[type="file"], button, #submitButton'));
    const prevs = els.map(el => ({ el, vis: el.style.visibility }));
    els.forEach(el => (el.style.visibility = 'hidden'));
    return () => prevs.forEach(({ el, vis }) => (el.style.visibility = vis));
  }

  function overlaySelectsWithText(node) {
    const cleanups = [];
    const selects = node.querySelectorAll('select');
    selects.forEach((sel) => {
      const text = sel.options[sel.selectedIndex]?.text ?? '';
      const fake = document.createElement('span');
      const cs = getComputedStyle(sel);
      fake.textContent = text;
      fake.style.display = 'inline-block';
      fake.style.whiteSpace = 'nowrap';
      fake.style.font = cs.font;
      fake.style.lineHeight = cs.lineHeight;
      fake.style.color = cs.color || '#111';
      fake.style.padding = cs.padding;
      fake.style.margin = cs.margin;
      fake.style.background = 'transparent';
      fake.style.border = 'none';
      fake.style.width = sel.offsetWidth + 'px';
      fake.style.height = sel.offsetHeight + 'px';
      fake.className = 'select-fake';
      const prevVis = sel.style.visibility;
      sel.style.visibility = 'hidden';
      sel.parentNode.insertBefore(fake, sel);
      cleanups.push(() => { fake.remove(); sel.style.visibility = prevVis; });
    });
    return () => cleanups.forEach(fn => fn());
  }

  function materializeTextInputs(node) {
    const els = node.querySelectorAll('input, textarea');
    const restore = [];
    els.forEach((el) => {
      if (el.tagName === 'TEXTAREA') {
        const prev = el.textContent;
        el.textContent = el.value ?? '';
        restore.push(() => (el.textContent = prev));
      } else if (!['checkbox','radio','file'].includes(el.type)) {
        const prev = el.getAttribute('value');
        el.setAttribute('value', el.value ?? '');
        restore.push(() => { if (prev == null) el.removeAttribute('value'); else el.setAttribute('value', prev); });
      }
    });
    return () => restore.forEach(fn => fn());
  }

  async function captureLetterImage(node, { as = 'dataurl' } = {}) {
    if (!node) throw new Error('captureLetterImage: node not found');
    const { toJpeg, toBlob } = await import('dom-to-image-more');
    await waitForFontsAndImages(node);
    const offCapture = toggleCaptureMode(node, true);
    const offHide    = hideFormControls(node);
    const offInputs  = materializeTextInputs(node);
    const offSelects = overlaySelectsWithText(node);
    try {
      const opts = {
        bgcolor: '#ffffff',
        quality: 0.95,
        width: LETTER_W,
        height: LETTER_H,
        filter: (el) => !el.classList?.contains('no-capture'),
        style: { transform: 'none', filter: 'none', background: '#ffffff' }
      };
      return as === 'blob' ? await toBlob(node, opts) : await toJpeg(node, opts);
    } finally {
      offSelects(); offInputs(); offHide(); offCapture();
    }
  }

  /* ===== 2-Step submit helpers ===== */

  async function assignWorkorderOnly() {
    const fd = new FormData();
    fd.append('order',   JSON.stringify(order));
    fd.append('patient', JSON.stringify(patient));
    fd.append('liner',   JSON.stringify(liner));
    fd.append('foot',    JSON.stringify(foot));

    const res = await fetch('/api/submit-order', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok || !json?.ok) throw new Error(json?.error || 'Assign failed');
    return json.workorder; // e.g. "25330001"
  }

  async function attachFilesToWorkorder(workorder, jpgBlob, summaryJpgBlob) {
    uploadedFileName = uploadedFile?.name ?? '';
    order.uploadedFileName = uploadedFileName;

    const fd = new FormData();
    fd.append('forceWorkorder', workorder); // use pre-assigned folder

    // keep JSON in sync
    fd.append('order',   JSON.stringify(order));
    fd.append('patient', JSON.stringify(patient));
    fd.append('liner',   JSON.stringify(liner));
    fd.append('foot',    JSON.stringify(foot));

    if (uploadedFile)   fd.append('uploadedFile', uploadedFile, uploadedFile.name);
    if (jpgBlob)        fd.append('jpg', jpgBlob, 'workorder.jpg');
    if (summaryJpgBlob) fd.append('summaryJpg', summaryJpgBlob, 'order-summary.jpg');

    const res = await fetch('/api/submit-order', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok || !json?.ok) throw new Error(json?.error || 'Attach failed');
    return json;
  }

  // Submit handler (2-step)
  async function handleSubmit() {
    if (submitting) return;
    checkFormValidity();
    if (!canSubmit || !uploadedFile) {
      alert('Please fill out all required fields and upload a file.');
      return;
    }
    submitting = true;
    try {
      // 1) Assign official workorder on server
      const wo = await assignWorkorderOnly();
      order.workorder = wo;     // show it on the form
      await tick();             // ensure DOM updates before capture

      // 2) Capture with official number visible
      const workorderElement = document.getElementById('print-area');
      const summaryElement   = document.getElementById('print-summary');
      const jpgBlob        = await captureLetterImage(workorderElement, { as: 'blob' });
      const summaryJpgBlob = summaryElement ? await captureLetterImage(summaryElement, { as: 'blob' }) : null;

      // 3) Attach files to that same WO folder
      await attachFilesToWorkorder(wo, jpgBlob, summaryJpgBlob);

      alert(`✅ Order ${wo} submitted successfully!`);
      window.location.href = '/customers/orders';
    } catch (err) {
      console.error('❌ Submission error:', err);
      alert(err?.message || 'An error occurred during submission.');
    } finally {
      submitting = false;
    }
  }
</script>



<style global>
   /* Base border for all elements in capture-mode */
  :global(#print-area.capture-mode *) {
    border: 1px solid #d1d5e1 !important;
  }

  /* Remove borders from divs without explicit border classes */
  :global(#print-area.capture-mode div:not(.border):not([class*="border-"])) {
    border: none !important;
  }

  /* Remove borders from text/content elements */
  :global(#print-area.capture-mode :is(
    p, span, strong, em, small, b, i, u,
    h1, h2, h3, h4, h5, h6, label, a
  )) {
    border: none !important;
  }

  /* Remove borders from images */
  :global(#print-area.capture-mode img) {
    border: none !important;
  }

  /* Restyle checkboxes */
  :global(#print-area.capture-mode input[type="checkbox"]) {
    appearance: none !important;
    -webkit-appearance: none !important;
    width: 14px;
    height: 14px;
    border: 1px solid #cbd5e1 !important;
    background: #fff !important;
    position: relative;
    vertical-align: middle;
  }

  :global(#print-area.capture-mode input[type="checkbox"]:checked::after) {
    content: "✔";
    position: absolute;
    left: 2px;
    top: -1px;
    font-size: 12px;
    line-height: 14px;
    color: #111;
  }

  /* Make inputs/selects transparent and clean */
  :global(#print-area.capture-mode input),
  :global(#print-area.capture-mode select) {
    border: hidden !important;
    background: transparent !important;
    color: #111 !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Hide submit button */
  :global(#print-area.capture-mode #submitButton) {
    display: none !important;
  }

  /* Scale & center the form wrapper for capture */
  :global(#print-area.capture-mode #form-wrapper) {
    margin-left: 17%;
    margin-top: 18.5%;
    transform: scale(1.13);
    transform-origin: center;
  }

  /* =========================
     ORDER SUMMARY (Letter)
     ========================= */

  /* Force true Letter canvas for summary capture (on-screen off-canvas) */
  :global(#print-summary.capture-mode),
  :global(#print-summary-capture.capture-mode) {
    width: 8.5in;
    height: 11in;
    padding: 0.4in;
    box-sizing: border-box;
    background: #fff !important;
      display: flex;
  flex-direction: column;
  justify-content: center;
  transform: scale(2.5); /* Increase size — try 1.3 to 1.5 */
  transform-origin: top left;
  }

  /* Clean rendering inside summary during capture */
  :global(#print-summary.capture-mode *),
  :global(#print-summary-capture.capture-mode *) {
    box-shadow: none !important;
    outline: none !important;
  }

  /* Soften table borders in summary (optional but looks better) */
  :global(#print-summary.capture-mode table),
  :global(#print-summary.capture-mode td),
  :global(#print-summary.capture-mode th),
  :global(#print-summary-capture.capture-mode table),
  :global(#print-summary-capture.capture-mode td),
  :global(#print-summary-capture.capture-mode th) {
    border-color: #d1d5e1 !important;
  }

  /* Images in summary: no borders */
  :global(#print-summary.capture-mode img),
  :global(#print-summary-capture.capture-mode img) {
    border: none !important;
  }

  
   :global(#print-summary div) {
    border: none !important;
  }

    /* During capture, remove borders/boxes around text elements */
  :global(#print-summary.capture-mode :where(
    p, span, strong, em, small, label, li, a,
    h1, h2, h3, h4, h5, h6, blockquote
  )) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  /* If you also nuked div borders earlier, keep that too */
  :global(#print-summary.capture-mode div) {
    border: none !important;
  }

  /* Optional: ignore Tailwind rings that can look like borders */
  :global(#print-summary.capture-mode [class*="ring-"]) {
    box-shadow: none !important;
  }

  /* Keep horizontal rules if you use them for separators */
  :global(#print-summary.capture-mode hr) {
    border-color: #000 !important; /* or whatever you want to keep */
  }

#print-summary
{
    position: fixed;
  left: -10000px;
  top: 0;
  width: 1632px;   /* Letter width @ 192 DPI */
  height: 2112px;  /* Letter height @ 192 DPI */
  background: #fff;
  box-sizing: border-box;
  padding: 64px;   /* inner margins */
  transform-origin: top left;
}

</style>


<!-- File Upload Input -->
<div id="fullPage" class="h-550 bg-gradient-to-b from-[rgba(0,0,0,0.6)] via-[rgba(55,65,81,0.5)] to-[rgba(0,0,0,0.6)] p-8">
  <div class="mt-4 no-print flex justify-center border-2 border-[#f58220] w-[65%] bg-white p-4 mx-auto rounded">
    <div class="flex flex-col items-center w-full max-w-sm">
      <label
        for="fileUpload"
        class={`text-xl text-[#f58220] font-bold mb-2 text-center ${errors.file ? 'border-2 border-red-500' : ''}`}
      >
        Upload File:
      </label>

      {#if order.uploadedFileName}
        <p class="text-sm font-bold text-[rgba(21,128,61,1)] mb-2">
          {order.uploadedFileName}
        </p>
      {/if}

      <input
        id="fileUpload"
        type="file"
        required
        on:change={(e) => {
          uploadedFile = e.target.files?.[0] || null;
          uploadedFileName = uploadedFile?.name || '';
          order.uploadedFileName = uploadedFileName;
          checkFormValidity();
        }}
        class="block w-full text-sm text-[rgba(55,65,81,1)] border border-[rgba(209,213,219,1)] rounded py-2 px-3 file:opacity-0 file:absolute file:h-0"
      />
    </div>
  </div>

  <!-- start of form -->
  <div id="print-area">
    <div id="form-wrapper" class="scale-[1.2] origin-top w-[1100px] p-15 mx-auto mt-3 bg-white">

<div class="bg-white text-black text-[12px] leading-tight">

  <div  class="pt-2 border-b-2 border-black flex justify-between items-center">
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
<input
  id="workorderInput"
  type="text"
  bind:value={order.workorder}
  placeholder={data?.workorderHint || 'Assigned on submit'}
  readonly
  autocomplete="off"
  class="w-full h-full font-bold text-2xl"
/>



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
  {#if user.facilities?.length}
    <label class="block text-xs font-semibold -mt-2">Facility</label>
<select
  bind:value={patient.facility}
  class="w-full h-full border border-gray-300 rounded p-1 text-sm"
  required
>
  <option value="" disabled>Select a facility</option>
  {#each user.facilities as f}
    <!-- use name as the value, since there's no id in users.json -->
    <option value={f.name}>{f.name}</option>
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
  <!-- Wrapping container -->
<div id="materials" class="flex flex-row w-full mt-4 gap-4">

  <!-- Left: Materials & Components -->
  <div class="w-1/2 pr-2 text-sm space-y-4">
    <h3 class="text-xl font-bold text-[#f58220]">Materials & Components</h3>
    <div class="flex flex-col gap-1">
      {#each ['PP', 'PE', 'FLEXFORM', 'Pelite Cone', 'Acrylic / Duraflex / Dioclear'] as item}
        <label class="flex items-center gap-2">
          <input type="checkbox" class="w-4 h-4" /> {item}
        </label>
      {/each}
    </div>

    <div>
      <h4 class="text-lg font-semibold text-[#f58220]">Liner Type</h4>
      <div class="pl-2 space-y-1">
        <div class="flex items-center gap-1">
          <label class="w-20">Type:</label>
          <input bind:value={liner.type} class="border-b border-black w-1/2 bg-transparent outline-none text-sm py-0.5" />
        </div>
        <div class="flex items-center gap-1">
          <label class="w-20">Size:</label>
          <input bind:value={liner.size} class="border-b border-black w-1/2 bg-transparent outline-none text-sm py-0.5" />
        </div>
        <div class="flex items-center gap-1">
          <label class="w-20">Thickness:</label>
          <input bind:value={liner.thickness} class="border-b border-black w-1/2 bg-transparent outline-none text-sm py-0.5" />
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

    <div>
      <h4 class="text-lg font-semibold text-[#f58220]">Foot</h4>
      <div class="pl-2 space-y-1">
        <div class="flex items-center gap-1">
          <label class="w-12">Type:</label>
          <input bind:value={foot.type} class="border-b border-black w-1/2 bg-transparent outline-none text-sm py-0.5" />
        </div>
        <div class="flex items-center gap-1">
          <label class="w-12">Size:</label>
          <input bind:value={foot.size} class="border-b border-black w-1/2 bg-transparent outline-none text-sm py-0.5" />
        </div>
      </div>
    </div>
  </div>

  <!-- Right: Diagram -->
  <div id="diagram" class="w-1/2 relative flex flex-col items-center justify-start">
    <div class="relative w-full flex justify-center">
      <img src="/transtibialDiagram.png" alt="Socket Diagram" class="h-[650px] object-contain z-0" />
      <input id="measurementB" type="text" class="absolute top-[37%] left-[7%] w-16 h-8 border font-bold text-center text-sm" placeholder="" />
      <input id="measurementD" type="text" class="absolute top-[33.5%] left-[75.5%] w-16 h-8 border font-bold text-center text-sm" placeholder="" />
      <input id="measurementA" type="text" class="absolute top-[55%] left-[24%] w-16 h-8 border font-bold text-center text-sm" placeholder="" />
    </div>

    <div id="legend" class="text-center text-xs pt-2">
      a. SC ML<br />
      b. Femoral Condyle ML<br />
      c. Depth of Medial Flare<br />
      d. MPT to Distal<br />
      <strong>IF LINER IS TO BE USED, MEASUREMENTS ARE TAKEN OVER LINER.</strong>
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
        <div id="submitButton" class="text-center mt-6">
          <button
            type="button"
            on:click={handleSubmit}
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

<!-- Hidden print summary -->
<div id="print-summary">
  <PrintOrderSummary  uploadedFileName={uploadedFileName} />
</div>
</div>