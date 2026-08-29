/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Simple color names for the CompileX theme. Use them anywhere,
      // e.g. `bg-surface`, `text-muted`, `border-border`.
      colors: {
        bg: "#0b0d14",       // page background
        surface: "#12151f",  // navbar, cards, panels
        surface2: "#1b1f2c", // hover / input backgrounds
        border: "#242a3a",   // borders / dividers
        muted: "#8891a7",    // secondary text
        brand: {
          DEFAULT: "#6d5bfa",
          hover: "#5a48e0",
          light: "#8f7dff",
        },
        accent: "#22d3ee",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0, 0, 0, 0.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
}