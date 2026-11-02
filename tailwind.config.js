/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── GSAC brand palette ─────────────────────────────────────
        // Deep Navy · Champagne Gold · White · Light Teal
        navy: {
          DEFAULT: '#0B1F3A',   // Deep Navy — primary brand colour
          dark:    '#071529',   // hover / pressed / footer depth
          800:     '#10294A',
          700:     '#17365F',
          50:      '#EAEFF6',   // soft navy tint (backgrounds)
        },
        gold: {
          DEFAULT: '#C9A96E',   // Champagne Gold — accents, fills, dividers
          light:   '#F7EFDD',   // gold tint (badges / soft backgrounds)
          dark:    '#8C6D28',   // gold for TEXT on white (4.85:1 contrast)
          deep:    '#6F5519',   // gold text on gold tint (6.1:1)
        },
        teal: {
          DEFAULT: '#7ED6CE',   // Light Teal — fresh accent, highlights
          50:      '#EAF8F6',   // teal tint (hover backgrounds, icon chips)
          100:     '#D2F1ED',
          dark:    '#2F9E95',   // teal for borders / focus rings
          deep:    '#1B6F69',   // teal for TEXT on white (5.96:1 contrast)
        },
        surface: '#F5F8FA',     // neutral off-white page background
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':     'fadeIn 0.6s ease-in-out',
        'slide-up':    'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow':  'pulse 3s infinite',
        'float':       'float 3s ease-in-out infinite',
        'marquee':     'marquee 25s linear infinite',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:    { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: 0, transform: 'translateX(-30px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        float:      { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        marquee:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(11,31,58,0.94) 0%, rgba(16,41,74,0.90) 55%, rgba(27,111,105,0.80) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #E3CB98 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0B1F3A 0%, #17365F 100%)',
        'teal-gradient': 'linear-gradient(135deg, #1B6F69 0%, #7ED6CE 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.15)',
        'nav': '4px 0 24px rgba(0,0,0,0.1)',
        'glass': '0 8px 32px rgba(31,38,135,0.15)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
      },
    },
  },
  plugins: [],
}
