import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["'Outfit'", "'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Outfit'", "'Plus Jakarta Sans'", "sans-serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        canvas: "#faf9f5",
        "surface-soft": "#f5f0e8",
        "surface-card": "#efe9de",
        "surface-cream-strong": "#e8e0d2",

        "surface-dark": "#181715",
        "surface-dark-elevated": "#252320",
        "surface-dark-soft": "#1f1e1b",

        // BJP Official Colors: Kesari #FF9933 | BJP Orange #FF6200 | India Green #138808 | Ashoka Navy #000080
        bjp: {
          kesari: "#FF9933",      // Indian flag exact saffron
          orange: "#FF6200",      // BJP logo/flag deep orange
          "orange-dark": "#D65000", // hover/active
          green: "#138808",       // Indian flag exact green
          "green-deep": "#0B6623", // darker green
          navy: "#000080",        // Ashoka Chakra navy
          white: "#FFFFFF",
        },

        coral: {
          DEFAULT: "#FF6200",  // BJP official orange (primary)
          active: "#D65000",   // Deep BJP orange active state
          disabled: "#f5d7be",
        },

        ink: "#141413",
        "body-strong": "#252523",
        body: "#3d3d3a",
        muted: "#6c6a64",
        "muted-soft": "#8e8b82",

        hairline: "#e6dfd8",
        "hairline-soft": "#ebe6df",

        "on-primary": "#ffffff",
        "on-dark": "#faf9f5",
        "on-dark-soft": "#a09d96",

        "accent-teal": "#138808",  // India Flag Green (official)
        "accent-amber": "#FF9933", // India Flag Kesari (official)

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6200",  // BJP official deep orange
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#138808",  // India flag green
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "#FF9933",  // India flag Kesari
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#efe9de",
          foreground: "#141413",
        },
        card: {
          DEFAULT: "#efe9de",
          foreground: "#141413",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
