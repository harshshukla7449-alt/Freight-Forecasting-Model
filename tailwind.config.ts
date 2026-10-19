import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#04060B",
          900: "#070A12",
          850: "#0A0F1A",
          800: "#0E1526",
          750: "#11192E",
          700: "#151F36",
          600: "#1A2642",
        },
        navy: {
          950: "#070A12",
          900: "#0B132B",
          850: "#0E1526",
          800: "#11192E",
          700: "#151F36",
          600: "#1C2541",
          500: "#3A506B",
        },
        cyan: {
          300: "#67E8F9",
          400: "#00D8F6",
          500: "#00F0FF",
          600: "#0284C7",
        },
        electricCyan: "#00D8F6",
        maritime: {
          deep: "#070A12",
          surface: "#0E1526",
          card: "#11192E",
          cardHover: "#151F36",
          border: "rgba(255, 255, 255, 0.08)",
          borderLight: "rgba(255, 255, 255, 0.15)",
          accent: "#00D8F6",
          gold: "#F59E0B",
          emerald: "#10B981",
          coral: "#F43F5E",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 216, 246, 0.45)",
        "glow-cyan-lg": "0 0 30px rgba(0, 216, 246, 0.70)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.30)",
        "glow-rose": "0 0 20px rgba(244, 63, 94, 0.35)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.30)",
        "neumorphic": "0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "neumorphic-card": "0 20px 40px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
        "neumorphic-inset": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
