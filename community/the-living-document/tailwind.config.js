/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#ffd1dc',
          purple: '#e0c3fc',
          blue: '#caf0f8',
          green: '#d8f3dc',
          yellow: '#fcf6bd',
          peach: '#ffd8be',
          mint: '#e0faf1',
          lavender: '#f1e4f3',
        }
      },
      animation: {
        highlight: 'highlight 1.5s ease-out forwards',
      },
      keyframes: {
        highlight: {
          '0%': { backgroundColor: 'rgba(253, 253, 150, 0.2)' },
          '100%': { backgroundColor: 'transparent' },
        }
      }
    },
  },
  plugins: [],
}
