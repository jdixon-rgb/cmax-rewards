import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cmax: {
          black: '#000000',
          dark: '#1c1c1c',
          darker: '#0d0d0d',
          gray: '#2a2a2a',
          'gray-light': '#3a3a3a',
          olive: '#b8b455',
          'olive-light': '#d4d080',
          'olive-dark': '#8a8740',
          'olive-muted': 'rgba(184, 180, 85, 0.15)',
          white: '#ffffff',
          muted: '#777777',
        },
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-open-sans)', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
