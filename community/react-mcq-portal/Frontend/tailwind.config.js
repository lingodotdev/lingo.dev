/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#dc004e',
        custom_blue: '#6495ED',
      },
    },
  },
  // --- ADD THIS PLUGINS ARRAY ---
  plugins: [
    require('@tailwindcss/forms'),
  ],
  // -----------------------------
}