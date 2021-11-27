module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxHeight: {
      '3/4': '75vh'
    },
    extend: {
      spacing: {
        '10%': '10%',
        '25%': '25%',
        '70%': '70%',
        '80%': '80%',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
