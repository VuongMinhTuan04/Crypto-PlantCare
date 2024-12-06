/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'full': '0 0 15px rgba(0, 0, 0, 1.2)', // Shadow đều xung quanh
      },
      colors: {
        space: {
          100: "#042959",
          200: "#0A4DA6",
          300: "#2c7ce6",
          400: "#79C4F2",
          500: "#c7e3f0",
          600: "#000080",
          700: "#1E90FF",
          800: "#2d3e96",
          900: "#f2f2f5",
        },
      },
      scrollbarWidth: {
        thin: 'thin',
      },
      fontFamily: {
        dmsan: ["DM Sans", "san-serif"],
        montserrat: ["Montserrat", "san-serif"],
      },
      keyframes: {
        treeWind: {
          "0%, 100%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "25%": { transform: "translate(-50%, -50%) rotate(-2deg)" },
          "50%": { transform: "translate(-50%, -50%) rotate(2deg)" },
          "75%": { transform: "translate(-50%, -50%) rotate(-1deg)" },
        },
      },
      animation: {
        "tree-wind": "treeWind 0.5s ease-in-out infinite",
      },
    },
    screens: {
      xs: "480px",
      sm: "768px",
      md: "1060px",
    },
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "background-game": "url('/assets/images/background-game-mobile.png')",
      "background-shop": "url('/assets/images/background-shop.png')",
      "background-green": "url('/assets/images/background-green.png')",
      "background-congrats": "url('/assets/images/Rectangle 70.png')",
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
