/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'coin-drop': {
          '0%': { transform: 'translateY(-60px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        'coin-drop': 'coin-drop 1s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
  
}