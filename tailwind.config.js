/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C6D2FF',
          300: '#A3B3FF',
          400: '#7C86FF',
          500: '#615FFF',
          600: '#4F39F6',
          700: '#432DD7',
          800: '#372AAC',
          900: '#312C85',
          950: '#1E1A4D'
        },
        'secondary': {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FF',
          300: '#C4B4FF',
          400: '#A684FF',
          500: '#8E51FF',
          600: '#7F22FE',
          700: '#7008E7',
          800: '#5D0EC0',
          900: '#4D179A',
          950: '#2F0D68'
        }
      }
    },
  },
  plugins: [],
}

