/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#071827",
        alpine: "#0e3a5b",
        lake: "#0ea5c6",
        frost: "#f4fbff",
        gold: "#d8a94f",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        premium: "0 8px 20px rgba(7, 24, 39, .08)",
        lift: "0 4px 12px rgba(7, 24, 39, .06)",
      },
    },
  },
  plugins: [],
};
