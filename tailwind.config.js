/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canopy: "#1F3529",
        moss: "#4C6B4F",
        sage: "#8FA687",
        mist: "#EEF1E7",
        parchment: "#F7F6F0",
        clay: "#9C5B3C",
        bark: "#3A3229",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        soft: "18px",
      },
    },
  },
  plugins: [],
};
