/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Green Theme
        'gt-primary': '#1b5e20',
        'gt-secondary': '#2e7d32',
        'gt-accent': '#43a047',
        'gt-light': '#81c784',
        'gt-soft': '#c8e6c9',
        
        // Backgrounds
        'gt-bg-main': '#ffffff',
        'gt-bg-light': '#f4fdf6',
        'gt-bg-section': '#e8f5e9',
        'gt-bg-dark': '#102a13',
        
        // Text
        'gt-text-primary': '#1b1b1b',
        'gt-text-secondary': '#4f4f4f',
        'gt-text-muted': '#7a7a7a',
      },
      boxShadow: {
        'gt-soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'gt-card': '0 6px 20px rgba(27, 94, 32, 0.1)',
      },
      borderRadius: {
        'gt-xl': '1rem',
        'gt-lg': '0.75rem',
      }
    },
  },
  plugins: [],
}