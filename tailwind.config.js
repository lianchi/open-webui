import containerQuries from '@tailwindcss/container-queries'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0065ff',
          50: '#edf8ff',
          100: '#d6eeff',
          200: '#b5e4ff',
          300: '#83d5ff',
          400: '#48bcff',
          500: '#1e99ff',
          600: '#0679ff',
          700: '#0065ff',
          800: '#084dc5',
          900: '#0d459b',
          950: '#0e2b5d',
        },
        gray: {
          50: 'var(--color-gray-50, #f9f9f9)',
          100: 'var(--color-gray-100, #ececec)',
          200: 'var(--color-gray-200, #e3e3e3)',
          300: 'var(--color-gray-300, #cdcdcd)',
          400: 'var(--color-gray-400, #b4b4b4)',
          500: 'var(--color-gray-500, #9b9b9b)',
          600: 'var(--color-gray-600, #676767)',
          700: 'var(--color-gray-700, #4e4e4e)',
          800: 'var(--color-gray-800, #333)',
          850: 'var(--color-gray-850, #262626)',
          900: 'var(--color-gray-900, #171717)',
          950: 'var(--color-gray-950, #0d0d0d)',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            'pre': false,
            'code': false,
            'pre code': false,
            'code::before': false,
            'code::after': false,
          },
        },
      },
      padding: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [typography, containerQuries],
}
