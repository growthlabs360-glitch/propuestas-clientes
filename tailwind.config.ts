import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6B1A",
          orangeDark: "#E85A0C",
          black: "#0A0A0A",
          gray: "#1A1A1A",
          mid: "#2A2A2A",
          line: "#333333",
          soft: "#9A9A9A",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255, 107, 26, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
