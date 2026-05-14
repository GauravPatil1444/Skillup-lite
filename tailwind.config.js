/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this covers your Courses.tsx location
  ],
  theme: {
    extend: {
      fontFamily: {
        // This makes 'font-sans' the default Inter font
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}