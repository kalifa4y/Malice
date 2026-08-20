/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--theme-bg)',
          'bg-translucent': 'var(--theme-bg-translucent)',
          surface: 'var(--theme-surface)',
          'surface-hover': 'var(--theme-surface-hover)',
          border: 'var(--theme-border)',
          primary: 'var(--theme-primary)',
          'primary-hover': 'var(--theme-primary-hover)',
          'primary-glow': 'var(--theme-primary-glow)',
          accent: 'var(--theme-accent)',
          gold: 'var(--theme-gold)',
          'gold-glow': 'var(--theme-gold-glow)',
          text: 'var(--theme-text)',
          'text-muted': 'var(--theme-text-muted)',
          card: 'var(--theme-card)',
        }
      },
      fontFamily: {
        sans: ['"Google Sans Flex"', '"Google Sans"', 'sans-serif'],
        serif: ['"Darker Grotesque"', 'sans-serif'],
        mono: ['"Google Sans Flex"', 'sans-serif'],
        display: ['"Darker Grotesque"', 'sans-serif'],
        heading: ['"Darker Grotesque"', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px var(--theme-primary-glow)',
        'glow-gold': '0 0 25px var(--theme-gold-glow)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
