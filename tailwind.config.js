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
        premium: "0 28px 80px rgba(7, 24, 39, .24)",
        lift: "0 18px 42px rgba(7, 24, 39, .14)",
      },
    },
  },
  plugins: [],
};
