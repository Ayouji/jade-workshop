/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        terracotta: {
          DEFAULT: '#C86D51',
          hover: '#B55D42',
          light: '#F8ECE8',
          50: '#FAF2EE',
          100: '#F5E4DC',
          500: '#C86D51',
          600: '#B55D42',
          700: '#944730',
        },
        sage: {
          DEFAULT: '#8A9A86',
          hover: '#778873',
          light: '#F0F3EF',
          50: '#F4F7F3',
          100: '#E7ECE6',
          500: '#8A9A86',
          600: '#778873',
          700: '#5F6F5B',
        },
        'slate-dark': '#2D3748',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};
