module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
