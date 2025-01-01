/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        425: "425px", // Custom breakpoint for 425px
        375: "375px", // Custom breakpoint for 375px
        412: "412px", // Custom breakpoint for 412px
        540: "540px", // Custom breakpoint for 540px
      },
    },
  },
  plugins: [],
};
