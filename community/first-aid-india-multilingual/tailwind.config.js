/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Trust Blue
          dark: '#0F172A',    // Dark Navy
        },
        secondary: {
          DEFAULT: '#F8FAFC', // Clean White
          light: '#F1F5F9',   // Light Gray
        },
        accent: {
          red: '#DC2626',   // Emergency Red
          green: '#10B981', // Success Green
          orange: '#F59E0B', // Warning Orange
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
