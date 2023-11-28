/* eslint-env node */

/** @type {import('tailwindcss').Config} *//* eslint-env node, mocha */
module.exports = {
  content: [
    "./index.html",
    "./docs/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}

