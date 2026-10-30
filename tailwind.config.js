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
        sans: ['"Plus Jakarta Sans"', '"Google Sans Flex"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        darker: ['"Cormorant Garamond"', '"Darker Grotesque"', 'serif'],
        'darker-grotesque': ['"Cormorant Garamond"', '"Darker Grotesque"', 'serif'],
        'google-sans': ['"Plus Jakarta Sans"', '"Google Sans Flex"', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 10px 30px -6px var(--theme-primary-glow)',
        'glow-gold': '0 10px 30px -6px var(--theme-gold-glow)',
        'card-glass': '0 20px 50px -12px rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}
