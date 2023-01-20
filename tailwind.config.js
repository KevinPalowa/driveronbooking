/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#efdd41",
        secondary: "#c9b02d",
        accent: "#f6e5b6",
        light: "#fff",
        dark: "#000",
      },
    },
  },
  plugins: [],
}; /** @type {import('tailwindcss').Config} */
