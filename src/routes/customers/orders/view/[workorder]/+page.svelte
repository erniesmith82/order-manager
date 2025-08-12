<script>
  import PrintOrderSummary from '$lib/components/PrintOrderSummary.svelte';

  export let data; // passed from +page.server.js or load function

  // Props from load function
  const { order, patient, uploadedFileName } = data;
</script>

<PrintOrderSummary {order} {patient} {uploadedFileName} />
