<script>
  let isOpen = false;
</script>
<div class="no-print">
<nav class="bg-gray-900 text-white border-b border-gray-800 shadow-sm">
  <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-20 items-center">
      
      <!-- Logo -->
      <a href="/" class="flex items-center space-x-2">
        <img src="/NopLogo.png" alt="NØPlaster Logo" class="h-40 w-auto" />
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center space-x-6">
        <a href="/login" class="hover:text-blue-400 transition-colors">Login</a>
        <a href="/about" class="hover:text-blue-400 transition-colors">About</a>
        <a href="/contact" class="hover:text-blue-400 transition-colors">Contact</a>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-white" on:click={() => isOpen = !isOpen}>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="{isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Nav Links -->
  {#if isOpen}
    <div class="md:hidden px-4 pb-4 space-y-2 bg-gray-900">
      <a href="/login" class="block hover:text-blue-400 transition-colors">Login</a>
      <a href="/about" class="block hover:text-blue-400 transition-colors">About</a>
      <a href="/contact" class="block hover:text-blue-400 transition-colors">Contact</a>
    </div>
  {/if}
</nav>
</div>