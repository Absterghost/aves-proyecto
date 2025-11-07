/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vainilla: '#F8F4E3',
        almond: '#F0EADD',
        chai: '#D1B59A',
        matcha: '#849C65',
        pistache: '#BBE2A2',
        carob: '#5B3A29',
      }
    },
  },
  plugins: [],
}
