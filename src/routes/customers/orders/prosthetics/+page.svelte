<script>
  const sections = [
    { name: 'Transtibial', link: '/customers/orders/prosthetics/transtibial', img: '/transtibial.png' },
    { name: 'Transfemoral', link: '/customers/orders/prosthetics/transfemoral', img: '/prosthetic.png' },
    { name: 'Upper Extremity', link: '/customers/orders/prosthetics/upper-extremity', img: '/images/upper-extremity.jpg' }
  ];
</script>

<div class="p-6 max-w-5xl mx-auto">
  <h1 class="text-3xl font-bold mb-8 text-center">Select Prosthetic Type</h1>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {#each sections as section}
      <a href={section.link} class="group border rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300">
        <img src={section.img} alt={section.name} class="w-30 h-48 object-cover mx-auto group-hover:scale-105 transition-transform duration-200" />
        <div class="p-4 text-center font-semibold text-lg">{section.name}</div>
      </a>
    {/each}
  </div>
</div>
