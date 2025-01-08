/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#009DAA", // Primary color
        white50: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
      },
      gradientColorStops: {
        custom: {
          light: "#FFFFFF", // Gradient light stop
          dark: "#009DAA7D", // Gradient dark stop
        },
      },
      backdropBlur: {
        16.5: "16.5px", // Custom blur value
      },
      screens: {
        932: "932px", // Custom breakpoint for 932px
        896: "896px", // Custom breakpoint for 896px
        882: "882px", // Custom breakpoint for 882px
        844: "844px", // Custom breakpoint for 844px
        820: "820px", // Custom breakpoint for 820px
        812: "812px", // Custom breakpoint for 812px
        740: "740px", // Custom breakpoint for 740px
        720: "720px", // Custom breakpoint for 720px
        667: "667px", // Custom breakpoint for 667px
        414: "414px", // Custom breakpoint for 414px
        425: "425px", // Custom breakpoint for 425px
        450: "450px", // Custom breakpoint for 450px
        375: "375px", // Custom breakpoint for 375px
        412: "412px", // Custom breakpoint for 412px
        424: "424px", // Custom breakpoint for 424px
        540: "540px", // Custom breakpoint for 540px
        360: "360px", // Custom breakpoint for 360px
      },
    },
  },
  plugins: [],
};
