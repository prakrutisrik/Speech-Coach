
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        sea: "#0f766e",
        coral: "#ef6f61",
        amberline: "#f59e0b"
      },
      boxShadow: {
        panel: "0 18px 55px rgba(23, 33, 43, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;