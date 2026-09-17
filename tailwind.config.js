/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#141a1d',
          50: '#f4f6f6',
          100: '#e3e8e9',
          200: '#c3ced0',
          400: '#5b6c70',
          600: '#2c3538',
          800: '#1a2124',
          900: '#141a1d',
        },
        paper: {
          DEFAULT: '#fffdf9',
          dim: '#f2efe7',
        },
        gold: {
          DEFAULT: '#c9a227',
          50: '#faf5e4',
          100: '#f1e2ac',
          400: '#c9a227',
          600: '#977a1c',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        md: '5px',
      },
      boxShadow: {
        paper: '0 1px 2px rgba(20,26,29,0.06), 0 12px 32px -12px rgba(20,26,29,0.25)',
      },
    },
  },
  plugins: [],
}
