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
    extend: {},
  },
  plugins: [],
};

export default config;
