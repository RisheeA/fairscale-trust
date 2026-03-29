import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f5f0e8",
        gold: "#b8924a",
        "gold-light": "#d4a853",
        "near-black": "#0e0d0a",
        "surface-1": "#141210",
        "surface-2": "#1c1916",
        "surface-3": "#242018",
        "surface-4": "#2e2920",
        trust: {
          high: "#4ade80",
          medium: "#fbbf24",
          low: "#f87171",
          unknown: "#6b7280",
        },
      },
      fontFamily: {
        advercase: ["Advercase", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "score-ring": "scoreRing 1.2s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
