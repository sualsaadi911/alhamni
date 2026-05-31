import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#F4F7FB",
          100: "#DCE6F5",
          200: "#B8CBEA",
          300: "#94AFDF",
          400: "#7093D4",
          500: "#5072C0",
          600: "#3B5BA0",
          700: "#2E4B88",
          800: "#21396E",
          900: "#152451",
        },
        amber: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        slate: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
      },
      boxShadow: {
        "sm":    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "md":    "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        "lg":    "0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)",
        "xl":    "0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
        "teal":  "0 8px 24px rgba(13,148,136,0.22)",
        "amber": "0 8px 24px rgba(217,119,6,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

// trigger rebuild 1775929793915