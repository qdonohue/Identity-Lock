module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '10%': '10%',
        '25%': '25%',
        '80%': '80%',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
