/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#eef7eb',
        },
        primaryBG: '#272724',
        secondary: {
          DEFAULT: '#d99e1a',
          100: '#ecc976',
          200: '#da9c07',
        },
        black: {
          DEFAULT: '#000',
          100: '#1e1e2d',
          200: '#232533',
        },
        gray: {
          50: 'rgba(205,205,224,0.6)',
          100: '#cdcde0',
          200: '#8a8a8a',
        },
        red: '#ea1b25',
        green: '#2a8c16',
      },
      fontFamily: {
        mtthin: ['Montserrat-Thin', 'sans-serif'],
        mtextralight: ['Montserrat-ExtraLight', 'sans-serif'],
        mtlight: ['Montserrat-Light', 'sans-serif'],
        mtregular: ['Montserrat-Regular', 'sans-serif'],
        mtmedium: ['Montserrat-Medium', 'sans-serif'],
        mtsemibold: ['Montserrat-SemiBold', 'sans-serif'],
        mtbold: ['Montserrat-Bold', 'sans-serif'],
        mtextrabold: ['Montserrat-ExtraBold', 'sans-serif'],
        mtblack: ['Montserrat-Black', 'sans-serif'],
        obregular: ['Oooh Baby', 'system-ui'],
      },
    },
  },
  plugins: [],
};
