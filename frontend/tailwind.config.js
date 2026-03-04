/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#111827",
        textWhite: "#f0f4f8",
        border: "#ddd",
        solidWhite: "#ffffff",
        accentSolid: "rgb(221, 49, 49)",
      },
      fontFamily: {
        main: ["Georgia", "sans-serif"],
      },
      spacing: {
        sm: "0.5rem",
        md: "1rem",
        lg: "2rem",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        default: "0 2px 4px rgba(0, 0, 0, 0.4)",
        xl: "0 4px 12px rgba(24, 40, 72, 0.3)",
      },
      backdropBlur: {
        xs: "10px",
      },
      backgroundImage: {
        primary: "linear-gradient(90deg, #eceff4, #dee3ea, #d1d7df)",
        "primary-06":
          "linear-gradient(90deg, rgba(236,239,244,0.5), rgba(222,227,234,0.5), rgba(209,215,223,0.5))",
        accent:
          "linear-gradient(90deg, rgb(254,38,92), #e73e3e, rgb(221,49,49))",
        accentDark: "linear-gradient(90deg, #8825255d, #8825255d, #8825255d)",
        danger: "linear-gradient(90deg, #fe5d26ff, #e73e3e, rgb(221,112,49))",
        "danger-2":
          "linear-gradient(90deg, rgb(254,63,38), #e71d1d, rgb(243,69,26))",
        bg: "linear-gradient(90deg, #ffffff, #f9fafb, #f0f2f5)",
        "bg-06":
          "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(249,250,251,0.6), rgba(240,242,245,0.6))",
        bg3: "linear-gradient(to right, #ff5526, #e7422c)",
        bg2: "linear-gradient(90deg, #f0f2f5, #e7eaee, #dee2e7)",
        light: "linear-gradient(90deg, #f7f7f7, #f7f7f7, #f7f7f7)",
        "bg2-06":
          "linear-gradient(90deg, rgba(240,242,245,0.6), rgba(231,234,238,0.6), rgba(222,226,231,0.6))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
