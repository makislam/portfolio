/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Slate (Dark tones)
        slate: {
          900: '#191919',
          800: '#262625',
          700: '#40403E',
        },
        // Cloud (Gray/neutral tones)
        cloud: {
          dark: '#666663',
          DEFAULT: '#91918D',
          light: '#BFBFBA',
        },
        // Ivory (Light tones)
        ivory: {
          dark: '#E5E4DF',
          DEFAULT: '#F0F0EB',
          light: '#FAFAF7',
        },
        // Accent (Warm tones)
        accent: {
          DEFAULT: '#CC785C',
          muted: '#D4A27F',
          light: '#EBDBBC',
        },
      },
    },
  },
  plugins: [],
};
