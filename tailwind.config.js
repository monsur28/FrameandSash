/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        425: "425px", // Custom breakpoint for 425px
        375: "375px", // Custom breakpoint for 375px
      },
    },
  },
  plugins: [],
};
