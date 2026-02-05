/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ed7591',
          500: '#e0486d',
          600: '#c9315a',
          700: '#a8244b',
          800: '#8b2144',
          900: '#761f3e',
        },
      },
    },
  },
  plugins: [],
}