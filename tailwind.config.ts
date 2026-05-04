import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          50:  '#FFFDF0',
          100: '#FEF9DC',
          200: '#FEF0A3',
          300: '#FDE46B',
          400: '#FBCF38',
          500: '#F5BC0F',
          600: '#D99B08',
          700: '#B47506',
          800: '#8F5505',
          900: '#6B3D04',
          950: '#3D2002',
        },
        cream: {
          50:  '#FFFEF7',
          100: '#FFFDF0',
          200: '#FFF8DC',
          300: '#FFF3BC',
        },
      },
      fontFamily: {
        heading: ['var(--font-amatic)', 'cursive'],
        body:    ['var(--font-cabin)', 'sans-serif'],
        arabic:  ['var(--font-cairo)', 'sans-serif'],
      },
      backgroundImage: {
        'honey-gradient':   'linear-gradient(135deg, #D99B08 0%, #F5BC0F 60%, #FBCF38 100%)',
        'honey-radial':     'radial-gradient(ellipse at top, #FEF9DC 0%, #FFFDF0 100%)',
        'glass-light':      'linear-gradient(135deg, rgba(255,253,240,0.7) 0%, rgba(254,249,220,0.5) 100%)',
        'dark-glass':       'linear-gradient(135deg, rgba(61,32,2,0.8) 0%, rgba(107,61,4,0.6) 100%)',
        'hero-pattern':     "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D99B08' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'honey':    '0 4px 20px rgba(217,155,8,0.25)',
        'honey-lg': '0 8px 40px rgba(217,155,8,0.35)',
        'glass':    '0 8px 32px rgba(61,32,2,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        'card':     '0 2px 16px rgba(61,32,2,0.06), 0 1px 4px rgba(61,32,2,0.04)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s infinite',
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
