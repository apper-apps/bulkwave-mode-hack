/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          50: '#e8f5e8',
          100: '#c3e6c3',
          200: '#9dd69d',
          300: '#77c677',
          400: '#51b851',
          500: '#25D366',
          600: '#1da851',
          700: '#15803d',
          800: '#0d5828',
          900: '#052e14',
        },
        teal: {
          500: '#128C7E',
          600: '#0f7a6e',
          700: '#0c685d',
          800: '#09564d',
          900: '#06443c',
        },
        lightblue: {
          500: '#34B7F1',
          600: '#2aa5e6',
          700: '#2093db',
          800: '#1681d0',
          900: '#0c6fc5',
        },
      },
      boxShadow: {
        'whatsapp': '0 4px 12px rgba(37, 211, 102, 0.15)',
        'teal': '0 4px 12px rgba(18, 140, 126, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}