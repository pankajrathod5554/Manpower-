/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00', // Action Orange
          hover: '#E65C00',
          light: '#FFDBCC',
        },
        slate: {
          950: '#0B0F19', // Deep navy slate
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          200: '#E2E8F0',
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 8px -1px rgba(15, 23, 42, 0.04)',
        glow: '0 0 30px rgba(255, 107, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
