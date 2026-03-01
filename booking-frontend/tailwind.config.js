/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4AF37',
          600: '#B8960C',
          700: '#92700A',
          800: '#78550A',
          900: '#5C3D0A',
        },
        obsidian: {
          50:  '#f6f6f7',
          100: '#e2e2e5',
          200: '#c4c4cc',
          300: '#9a9aab',
          400: '#72728a',
          500: '#555570',
          600: '#3f3f5a',
          700: '#2a2a40',
          800: '#18182c',
          900: '#0d0d1a',
          950: '#07070f',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E17A 50%, #B8960C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #07070f 0%, #0d0d1a 50%, #18182c 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212,175,55,0.3)',
        'gold-lg': '0 0 60px rgba(212,175,55,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'inner-gold': 'inset 0 1px 0 rgba(212,175,55,0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(212,175,55,0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
