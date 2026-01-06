/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#5C7AEA',
        'accent-pink': '#FF8C94',
        'bg-light': '#F5F7FA',
        'success-green': '#4CAF50',
      },
    },
  },
  plugins: [],
};