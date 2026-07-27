export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: "#fbf2f3",
          100: "#f6e1e3",
          200: "#eec2c7",
          300: "#e19aa2",
          400: "#d06977",
          500: "#b8404f",
          600: "#9c2c3b",
          700: "#7b1e2b",
          800: "#6e1423",
          900: "#5a1420",
          950: "#33070d",
        },
        amber2: {
          50: "#fdf5ef",
          100: "#fae7d7",
          200: "#f3cbab",
          300: "#eba875",
          400: "#e1823f",
          500: "#d97a34",
          600: "#c05a2a",
          700: "#9f4324",
          800: "#813724",
          900: "#6a301f",
        },
        cream: "#fbf7f2",
        ink: "#2a1a1c",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
