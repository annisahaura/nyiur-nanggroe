import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Palette — Nyiur Nanggroe
        forest: {
          DEFAULT: "#6B7C3D",
          50: "#F3F5EC",
          100: "#E4E9D3",
          200: "#C7D0A8",
          300: "#A5B479",
          400: "#849650",
          500: "#6B7C3D",
          600: "#566432",
          700: "#414B26",
          800: "#2B321A",
          900: "#16190D",
        },
        amber: {
          DEFAULT: "#C68642",
          50: "#FDF6EE",
          100: "#FAE9D0",
          200: "#F5D3A1",
          300: "#EFB96B",
          400: "#E09A3C",
          500: "#C68642",
          600: "#A86E32",
          700: "#8A5624",
          800: "#6B3F17",
          900: "#4D2A0A",
        },
        cream: {
          DEFAULT: "#FAF7F0",
          50: "#FFFFFE",
          100: "#FAF7F0",
          200: "#F5EFE0",
          300: "#EDE4CE",
          400: "#E2D5B5",
          500: "#D4C498",
        },
        moss: {
          DEFAULT: "#52B788",
          50: "#F0FAF5",
          100: "#D8F3E7",
          200: "#A8E4C7",
          300: "#74D4A7",
          400: "#52B788",
          500: "#3A9A6E",
          600: "#2A7A56",
        },
        charcoal: {
          DEFAULT: "#1C1C1E",
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#8A8A8F",
          300: "#6E6E73",
          400: "#515154",
          500: "#3E3E40",
          600: "#2C2C2E",
          700: "#1E1E20",
          800: "#151517",
          900: "#0A0A0A",
        },
        mist: "#F0EDE6",
        // Semantic
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glass": "0 4px 24px 0 rgba(26, 58, 42, 0.08)",
        "glass-lg": "0 8px 40px 0 rgba(26, 58, 42, 0.12)",
        "card": "0 1px 3px 0 rgba(26, 58, 42, 0.06), 0 4px 16px 0 rgba(26, 58, 42, 0.06)",
        "card-hover": "0 2px 8px 0 rgba(26, 58, 42, 0.08), 0 12px 40px 0 rgba(26, 58, 42, 0.12)",
        "amber": "0 4px 24px 0 rgba(198, 134, 66, 0.25)",
        "inner-sm": "inset 0 1px 2px 0 rgba(26, 58, 42, 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-forest": "linear-gradient(135deg, #566432 0%, #6B7C3D 100%)",
        "gradient-amber": "linear-gradient(135deg, #C68642 0%, #E09A3C 100%)",
        "gradient-cream": "linear-gradient(180deg, #FAF7F0 0%, #F5EFE0 100%)",
        "gradient-hero": "linear-gradient(135deg, #566432 0%, #6B7C3D 60%, #A5B479 100%)",
        "mesh-forest": "radial-gradient(at 20% 50%, hsla(84, 35%, 30%, 0.8) 0px, transparent 50%), radial-gradient(at 80% 20%, hsla(84, 30%, 40%, 0.6) 0px, transparent 50%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "counter": "counter 2s ease-out forwards",
        "leaf-sway": "leafSway 4s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        leafSway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "snappy": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
