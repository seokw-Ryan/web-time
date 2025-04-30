/** @type {import('tailwindcss').Config} */
export default {
  // Enable dark mode using the 'dark' class on the root element
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,      // Enable automatic centering
      padding: {
        DEFAULT: '0rem',  // No default padding
      },
      screens: {
        '2xl': '1400px'  // Max width for ultra-wide monitors
      },
    },
    extend: {
      colors: {
        border: { DEFAULT: '#e5e7eb', muted: '#2d2d2d' },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: { DEFAULT: '#ffffff', muted: '#1e1e1e' },
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        'foreground-secondary': '#4b5563',
        'foreground-tertiary': '#9ca3af',
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
} 