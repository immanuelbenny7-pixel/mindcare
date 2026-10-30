/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#ced9ce',
          300: '#abc0ac',
          400: '#83a185',
          500: '#648566',
          600: '#4e6950',
          700: '#3f5441',
          800: '#354436',
          900: '#2c392d',
        },
        calm: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        lavender: {
          50: '#f7f6fc',
          100: '#eeebf9',
          200: '#ded7f4',
          300: '#c5b7ed',
          400: '#a790e2',
          500: '#8c6ad7',
          600: '#7950c9',
          700: '#673eb2',
        },
      },
      animation: {
        'breathe-box': 'breathe 16s ease-in-out infinite',
        'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.25)' },
          '50%': { transform: 'scale(1.25)' },
          '75%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}

