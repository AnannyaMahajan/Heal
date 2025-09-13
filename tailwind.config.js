/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#9333ea",
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#f59e0b"
      }
    }
  },
  plugins: []
}
