/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#eef7eb"
        },
        primaryBG: "#272724",
        secondary: {
          DEFAULT: "#d99e1a",
          100: "#ecc976",
          200: "#da9c07",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        red: "#ea1b25",
        green: "#2a8c16"
      },
    },
  },
  plugins: [],
}

