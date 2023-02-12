/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-orange": "#FFC145",
        "light-red": "#FF6B6C",
      },
      backgroundImage: {
        hero: "url('/src/images/hero.png')",
      },
    },
    gridTemplateColumns: {
      fluid: "repeat(auto-fit, minmax(17rem, 1fr))",
    },
  },
  plugins: [],
}
