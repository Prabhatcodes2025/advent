/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#12304a",
        alpine: "#075985",
        lake: "#06b6d4",
        frost: "#ecfeff",
        gold: "#f59e0b",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        premium: "0 18px 45px rgba(8, 145, 178, .18)",
        lift: "0 10px 28px rgba(14, 116, 144, .14)",
      },
    },
  },
  plugins: [],
};
