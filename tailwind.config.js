/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 关键：启用 class 模式切换暗黑模式
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
