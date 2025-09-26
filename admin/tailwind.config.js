/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5E6FFF',
        'secondary': '#2433bcff'
      }
    },
  },
  plugins: [],
}
