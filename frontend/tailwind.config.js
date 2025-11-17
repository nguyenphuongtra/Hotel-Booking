// tailwind.config.js
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
          DEFAULT: '#ff6b35',  // ← DÙNG CHO bg-primary
          50: '#fff5f0',
          100: '#ffe6e0',
          200: '#ffc7b8',
          300: '#ffa68f',
          400: '#ff8566',
          500: '#ff6b35',
          600: '#e55a2b',
          700: '#cc4a23',
          800: '#b33a1b',
          900: '#992a13',
          foreground: '#ffffff',
        },
        secondary: '#004e89',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}