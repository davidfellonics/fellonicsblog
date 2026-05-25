import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111111",
        primary: {
          DEFAULT: "#1a3a5c",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f0f4f8",
          foreground: "#1a3a5c",
        },
        muted: {
          DEFAULT: "#f0f4f8",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#1a3a5c",
          foreground: "#ffffff",
        },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#1a3a5c",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#111111",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#111111",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "var(--font-lora), Georgia, serif",
            color: "#111111",
            maxWidth: "none",
            a: { color: "#1a3a5c" },
            h1: { fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#111111" },
            h2: { fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#111111" },
            h3: { fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#111111" },
            h4: { fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#111111" },
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
