/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        obsidian: {
          50: '#F8F7F4',
          100: '#EAE8E2',
          200: '#D4D0C6',
          300: '#B5B0A0',
          400: '#8C8676',
          500: '#6B6558',
          600: '#514D43',
          700: '#3A3731',
          800: '#252320',
          900: '#141310',
          950: '#0A0908',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'count-up': 'countUp 0.8s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
