/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vert: { 50: '#EEF6F1', 100: '#D4EADC', 600: '#1F7A4D', 700: '#17603C', 800: '#124B2F', 900: '#0C3320' },
        orange: { 50: '#FFF4EA', 100: '#FFE3C7', 500: '#F28C28', 600: '#D9721A', 700: '#B35A0F' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'] },
    },
  },
  plugins: [],
};
