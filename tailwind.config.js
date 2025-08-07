/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/**/*' // Just in case you use components without extensions
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f58220',
        'primary-dark': '#e4711a'
      }
    }
  },
  future: {
    useOkLCHColors: false // 🔥 Fixes html2canvas crash
  },
  plugins: []
}
