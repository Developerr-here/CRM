/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Dark Slate for Sidebar
        secondary: "#3b82f6", // CRM Blue for Buttons
        accent: "#f8fafc", // Light Grey for Backgrounds
      }
    },
  },
  plugins: [],
}