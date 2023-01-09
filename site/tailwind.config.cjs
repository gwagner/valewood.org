/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "assets/**/*.{js,jsx}",
    "content/**/*.md",
    "{layouts,themes}/**/*.html",

  ],
  theme: {
    screens: {
      'mobile': '480px',
      'tablet': '768px',
      'desktop': '976px',
    },
    colors: {
      'blue': '#1d4ed8',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    container: {
      center: true,
      padding: '2rem',
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('autoprefixer')
  ],
};
