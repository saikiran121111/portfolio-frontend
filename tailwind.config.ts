import type { Config } from 'tailwindcss';

// Tailwind custom config: adds a "desktop" alias while keeping defaults.
// Use classes like md:text-4xl or desktop:text-5xl for responsive styles.
// Mobile (no prefix) applies to all; prefixed overrides at min-width breakpoint.
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      desktop: '1024px', // alias for lg
    },
    extend: {
      animation: {
        'glitch-1': 'glitch-1 0.8s infinite linear alternate-reverse',
        'glitch-2': 'glitch-2 1.2s infinite linear alternate',
      },
      keyframes: {
        'glitch-1': {
          '0%, 90%, 100%': { 
            transform: 'translate(0)', 
            opacity: '0.6',
          },
          '10%': { 
            transform: 'translate(-2px, -1px)', 
            opacity: '0.8',
          },
          '20%': { 
            transform: 'translate(2px, 1px)', 
            opacity: '0.4',
          },
          '30%': { 
            transform: 'translate(-1px, 2px)', 
            opacity: '0.7',
          },
          '40%': { 
            transform: 'translate(1px, -2px)', 
            opacity: '0.5',
          },
          '50%': { 
            transform: 'translate(-2px, 1px)', 
            opacity: '0.6',
          },
          '60%': { 
            transform: 'translate(2px, -1px)', 
            opacity: '0.8',
          },
          '70%': { 
            transform: 'translate(-1px, -2px)', 
            opacity: '0.3',
          },
          '80%': { 
            transform: 'translate(1px, 2px)', 
            opacity: '0.7',
          },
        },
        'glitch-2': {
          '0%, 90%, 100%': { 
            transform: 'translate(0)', 
            opacity: '0.4',
          },
          '15%': { 
            transform: 'translate(1px, 2px)', 
            opacity: '0.6',
          },
          '25%': { 
            transform: 'translate(-2px, -1px)', 
            opacity: '0.3',
          },
          '35%': { 
            transform: 'translate(2px, -2px)', 
            opacity: '0.5',
          },
          '45%': { 
            transform: 'translate(-1px, 1px)', 
            opacity: '0.7',
          },
          '55%': { 
            transform: 'translate(1px, -1px)', 
            opacity: '0.4',
          },
          '65%': { 
            transform: 'translate(-2px, 2px)', 
            opacity: '0.6',
          },
          '75%': { 
            transform: 'translate(2px, 1px)', 
            opacity: '0.3',
          },
          '85%': { 
            transform: 'translate(-1px, -1px)', 
            opacity: '0.5',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
