/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#090A0D',
          900: '#0E1015',
          850: '#14161F',
          800: '#1A1D29',
          700: '#262A3B',
          600: '#343A4F',
          500: '#4E5673',
          400: '#757F9F',
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          accent: '#E5A93C',
          glow: '#FFA726',
        },
        parchment: {
          50: '#FCFAF7',
          100: '#F7F3EB',
          200: '#EFE8DA',
          300: '#E3D7C1',
          800: '#3D352E',
          900: '#231E19',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        indic: ['"Noto Sans Oriya"', '"Noto Sans Tamil"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'glow-saffron': '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'glow-saffron-lg': '0 0 45px -2px rgba(245, 158, 11, 0.6)',
        'card-dark': '0 4px 24px -2px rgba(0, 0, 0, 0.55)',
        'card-light': '0 4px 20px -2px rgba(180, 140, 100, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.8s ease-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1.45)', opacity: '0' },
        },
        wave: {
          '0%': { height: '12%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
