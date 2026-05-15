/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        ink: {
          50:  "#f5f4f0",
          100: "#e8e6de",
          200: "#d0cdc0",
          300: "#b0ac9c",
          400: "#8c8775",
          500: "#6e6a5a",
          600: "#575346",
          700: "#413e34",
          800: "#2b2923",
          900: "#1a1916",
          950: "#0f0e0c",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        jade: {
          400: "#34d399",
          500: "#10b981",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
      },
    },
  },
  plugins: [],
};
