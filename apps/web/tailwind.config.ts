import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#4F74A3',
        'brand-blue-light': '#6B8FB6',
        'brand-navy': '#0E2F57',
        'brand-teal': '#6FB7B3',
        'gray-light': '#E5E5E5',
        'gray-mid': '#C9C9C9',
        'gray-text': '#AFAFAF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(14, 47, 87, 0.08)',
        glow: '0 0 60px rgba(111, 183, 179, 0.25)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #0E2F57 0%, #4F74A3 50%, #6FB7B3 100%)',
        'mesh':
          'radial-gradient(at 40% 20%, rgba(111,183,179,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(79,116,163,0.35) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(14,47,87,0.4) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
