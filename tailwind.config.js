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
        // Material 3 Tokens from Stitch Design System
        "primary": "#006194",
        "on-primary": "#ffffff",
        "primary-container": "#007bb9",
        "on-primary-container": "#fdfcff",
        "primary-fixed": "#cce5ff",
        "primary-fixed-dim": "#93ccff",
        "on-primary-fixed": "#001d31",
        "on-primary-fixed-variant": "#004b73",
        "inverse-primary": "#93ccff",

        "secondary": "#006a61",
        "on-secondary": "#ffffff",
        "secondary-container": "#86f2e4",
        "on-secondary-container": "#006f66",
        "secondary-fixed": "#89f5e7",
        "secondary-fixed-dim": "#6bd8cb",
        "on-secondary-fixed": "#00201d",
        "on-secondary-fixed-variant": "#005049",

        "tertiary": "#006947",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#00855b",
        "on-tertiary-container": "#f5fff6",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        "background": "#faf8ff",
        "on-background": "#131b2e",
        
        "surface": "#faf8ff",
        "on-surface": "#131b2e",
        "surface-variant": "#dae2fd",
        "on-surface-variant": "#3f4850",
        "surface-dim": "#d2d9f4",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "surface-tint": "#006398",

        "outline": "#707881",
        "outline-variant": "#bfc7d2",
        "inverse-surface": "#283044",
        "inverse-on-surface": "#eef0ff",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.25rem",
        "gutter": "1rem",
        "margin": "1.25rem",
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 97, 148, 0.08)',
        'elevated': '0 20px 32px -8px rgba(15, 23, 42, 0.12)',
        'glow-primary': '0 8px 24px -4px rgba(0, 97, 148, 0.25)',
        'glow-tertiary': '0 8px 24px -4px rgba(0, 133, 91, 0.25)',
      },
      animation: {
        'scan': 'scanner 2.4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'waveBar 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanner: {
          '0%, 100%': { top: '6%', opacity: '0.8' },
          '50%': { top: '92%', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
        waveBar: {
          '0%': { height: '6px' },
          '100%': { height: '24px' },
        }
      }
    },
  },
  plugins: [],
}
