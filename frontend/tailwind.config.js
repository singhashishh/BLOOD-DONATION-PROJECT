/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#020202',
          900: '#050505',
          800: '#0f0f0f',
          700: '#1a0505',
          600: '#2a1a1a',
        },
        crimson: {
          700: '#b91c1c',
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
          300: '#fca5a5',
        },
        emerald: {
          600: '#059669',
          500: '#10b981',
          400: '#6ee7b7',
          300: '#a7f3d0',
        },
      },
      borderRadius: {
        '3xl': '24px',
      },
      backdropFilter: {
        blur: 'blur(10px)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        pulse_ring: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 0 20px rgba(239, 68, 68, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
          },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        pulse_ring: 'pulse_ring 2s infinite',
      },
    },
  },
  plugins: [],
}
