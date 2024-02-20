/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          100: '#FFF3E5',
          200: "#FFF0DF",
          300: "#FFEDD7"
        },
        text: {
          100: "#646464",
          200: "#2E2E2E",
          300: "#000000"
        }
      }
    },
  },
  plugins: [],
}