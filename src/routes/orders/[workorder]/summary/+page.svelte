<script>
  import PrintOrderSummary from '$lib/components/PrintOrderSummary.svelte';
  export let data;

  // pass through to the component
  const { order, patient, liner, foot } = data;
</script>

<!-- This element is what the screenshotter will capture -->
<div id="print-summary" class="bg-white text-black px-10 py-8">
  <PrintOrderSummary
    {order}
    {patient}
    {liner}
    {foot}
    uploadedFileName={order?.uploadedFileName || ''}
  />
</div>

<style>
  /* Make it letter size at CSS pixels (96dpi); the screenshotter will use 2x scale */
  #print-summary {
    width: 816px;   /* 8.5in * 96 */
    min-height: 1056px; /* 11in * 96 */
    box-sizing: border-box;
  }
</style>
