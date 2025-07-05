/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}", // This line includes all your React components
  ],
  darkMode: 'class', // This enables the dark/light theme toggle
  theme: {
    extend: {},
  },
  plugins: [],
}