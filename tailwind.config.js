/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,ts,tsx,css}'];
export const theme = {
  extend: {
    colors: {
      "primary": "#355C7D",
      "secondary": "#F67280"
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],  // Establecer Roboto como fuente predeterminada
    },
  },
};
