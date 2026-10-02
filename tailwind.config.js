/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dustyPink: {
          50: '#FDF7F9',
          100: '#FCEBF0',
          200: '#F8D6E1',
          300: '#F2B3C7',
          400: '#E58AA6',
          500: '#B55B73',
          600: '#9C465E',
          700: '#83344B',
          800: '#6C2A3D',
          900: '#431322',
        },
        charcoal: {
          50: '#F7F6F7',
          100: '#E6E4E5',
          200: '#CCC9CB',
          300: '#AFA9AD',
          400: '#8E858B',
          500: '#6B5F65',
          600: '#53494E',
          700: '#3D353A',
          800: '#262023',
          900: '#1A1517',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
