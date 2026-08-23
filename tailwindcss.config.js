/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#030712",
          card: "rgba(15, 23, 42, 0.65)",
          border: "rgba(51, 65, 85, 0.5)",
          accent: "#06b6d4",
          glow: "#6366f1"
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.3)',
      }
    },
  },
  plugins: [],
};