/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5865F2',
          dark: '#4752C4',
        },
        surface: {
          DEFAULT: '#1e2130',
          raised: '#252836',
          border: '#2e3347',
        },
      },
    },
  },
  plugins: [],
};
