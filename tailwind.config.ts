import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      crimson: {
        900: '#3D0409',
        700: '#7A0F1F',
        500: '#B31B2E',
        400: '#D42A3F',
      },
      carbon: {
        950: '#0A0A0B',
        800: '#161618',
        600: '#2A2A2E',
      },
      showroom: {
        100: '#F5F3EF',
        300: '#E4E1DA',
      },
      marble: {
        800: '#1C1C1E',
      },
      chrome: {
        400: '#C9CACC',
      },
      gold: {
        500: '#B08D57',
      },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      fontSize: {
        hero: 'clamp(3.5rem, 8vw, 9rem)',
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      transitionTimingFunction: {
        fall: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'fall-out': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
    },
  },
  plugins: [],
}

export default config
