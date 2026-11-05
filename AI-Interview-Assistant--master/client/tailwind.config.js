/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "on-primary-fixed": "#0f0069",
        "on-primary-fixed-variant": "#3323cc",

        "secondary": "#831ada",
        "secondary-container": "#9e41f5",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#fffbff",
        "secondary-fixed": "#f0dbff",
        "secondary-fixed-dim": "#ddb8ff",
        "on-secondary-fixed": "#2c0051",
        "on-secondary-fixed-variant": "#6800b4",

        "tertiary": "#005338",
        "tertiary-container": "#006e4b",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#67f4b7",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",

        "surface": "#f9f9ff",
        "surface-dim": "#d3daef",
        "surface-bright": "#f9f9ff",
        "surface-variant": "#dce2f7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f3ff",
        "surface-container": "#e9edff",
        "surface-container-high": "#e1e8fd",
        "surface-container-highest": "#dce2f7",

        "background": "#f9f9ff",
        "on-background": "#141b2b",
        "on-surface": "#141b2b",
        "on-surface-variant": "#464555",

        "outline": "#777587",
        "outline-variant": "#c7c4d8",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "inverse-surface": "#293040",
        "inverse-on-surface": "#edf0ff",
        "inverse-primary": "#c3c0ff",
        "surface-tint": "#4d44e3",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "base": "4px",
        "xs": "0.25rem",
        "sm": "0.5rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "gutter": "1.5rem",
        "margin-mobile": "1rem",
        "margin-desktop": "2.5rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "soft": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        "ambient": "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.04)",
      }
    },
  },
  plugins: [],
}
