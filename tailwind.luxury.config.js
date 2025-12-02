/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Luxury Gold Palette
        gold: {
          50: '#FFFBF0',
          100: '#FFF7E0',
          200: '#FFEFB3',
          300: '#FFE680',
          400: '#F6C440', // Primary Gold
          500: '#E5B030',
          600: '#D49E20',
          700: '#B88510',
          800: '#9A6D00',
          900: '#7C5500',
        },
        // Deep Black Palette
        black: {
          50: '#1A1A1A',
          100: '#141414',
          200: '#0F0F0F',
          300: '#0D0D0D', // Deep Black
          400: '#0A0A0A',
          500: '#080808',
          600: '#050505',
          700: '#030303',
          800: '#020202',
          900: '#000000',
        },
        // Warm Brown Palette
        brown: {
          50: '#F5F1ED',
          100: '#E8DED4',
          200: '#D4C2B0',
          300: '#B89A7D',
          400: '#9B7A5A',
          500: '#7D5A3D',
          600: '#5F3F28',
          700: '#412A1A',
          800: '#2B1E14', // Warm Brown
          900: '#1A120C',
        },
        // Champagne White Palette
        champagne: {
          50: '#FEFCF9',
          100: '#FCF9F3',
          200: '#FAF5ED',
          300: '#F8F2E7', // Champagne White
          400: '#F5EDE0',
          500: '#F2E8D9',
        },
        // Graphite Gray Palette
        graphite: {
          50: '#4A4A4A',
          100: '#3D3D3D',
          200: '#303030',
          300: '#252525',
          400: '#1F1F1F', // Graphite Gray
          500: '#1A1A1A',
          600: '#151515',
          700: '#121212',
          800: '#0F0F0F',
          900: '#0D0D0D',
        },
        // Accent Colors
        emerald: {
          DEFAULT: '#2ECC71',
          dark: '#27AE60',
        },
        error: {
          DEFAULT: '#E74C3C',
          dark: '#C0392B',
        },
        warning: {
          DEFAULT: '#F39C12',
        },
        info: {
          DEFAULT: '#3498DB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '80px', fontWeight: '800' }],
        'display-lg': ['96px', { lineHeight: '104px', fontWeight: '800' }],
      },
      boxShadow: {
        'gold-sm': '0 2px 8px rgba(246, 196, 64, 0.3)',
        'gold-md': '0 4px 16px rgba(246, 196, 64, 0.4)',
        'gold-lg': '0 8px 24px rgba(246, 196, 64, 0.5)',
        'gold-xl': '0 12px 32px rgba(246, 196, 64, 0.6)',
        'dark-xs': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'dark-sm': '0 2px 4px rgba(0, 0, 0, 0.4)',
        'dark-md': '0 4px 8px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 8px 16px rgba(0, 0, 0, 0.6)',
        'dark-xl': '0 12px 24px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-gold-vertical': 'linear-gradient(180deg, #F6C440 0%, #E5B030 100%)',
        'gradient-gold-horizontal': 'linear-gradient(90deg, #F6C440 0%, #E5B030 100%)',
        'gradient-gold-radial': 'radial-gradient(circle, #F6C440 0%, #E5B030 100%)',
        'gradient-gold-subtle': 'linear-gradient(135deg, rgba(246, 196, 64, 0.1) 0%, rgba(246, 196, 64, 0.05) 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #F6C440 0%, #2B1E14 50%, #0D0D0D 100%)',
        'gradient-champagne': 'linear-gradient(180deg, #F8F2E7 0%, #F5EDE0 100%)',
        'gradient-dark-luxury': 'linear-gradient(135deg, #1F1F1F 0%, #2B1E14 50%, #0D0D0D 100%)',
      },
      animation: {
        'button-lift': 'buttonLift 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'card-bloom': 'cardBloom 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'cart-bounce': 'cartBounce 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'modal-fade-scale': 'modalFadeScale 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'drawer-slide': 'drawerSlide 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        buttonLift: {
          '0%': { transform: 'translateY(0)', boxShadow: '0 2px 8px rgba(246, 196, 64, 0.3)' },
          '100%': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(246, 196, 64, 0.4)' },
        },
        cardBloom: {
          '0%': { boxShadow: '0 4px 8px rgba(13, 13, 13, 0.12)' },
          '100%': { boxShadow: '0 8px 24px rgba(246, 196, 64, 0.5)' },
        },
        cartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        modalFadeScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        drawerSlide: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
}

