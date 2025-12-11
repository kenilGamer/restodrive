/**
 * Tailwind Config Snippet for HeroDeviceShowcase
 * 
 * Add this to your tailwind.config.js theme.extend section
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Amber/Gold accent colors
        'amber-start': '#FFB800',
        'amber-end': '#FF8A00',
        
        // Card and UI colors
        'card-bg': 'rgba(255, 255, 255, 0.9)',
        'ui-border': 'rgba(231, 229, 228, 0.5)',
        
        // Stone palette (if not already defined)
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          600: '#57534E',
          700: '#44403C',
          900: '#0C0A09',
        },
      },
      borderRadius: {
        'lgcard': '18px', // Large card radius
      },
      boxShadow: {
        'card-glow': '0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
        'device': '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'card': '40px', // backdrop-blur-xl equivalent
      },
    },
  },
}

/**
 * Dark Mode Variant (Optional)
 * 
 * To enable dark mode, add this to your theme.extend.colors:
 */
const darkModeColors = {
  dark: {
    'amber-start': '#FFC947',
    'amber-end': '#FF9800',
    'card-bg': 'rgba(28, 25, 23, 0.9)',
    'ui-border': 'rgba(68, 64, 60, 0.5)',
    stone: {
      50: '#1C1917',
      100: '#292524',
      200: '#44403C',
      600: '#A8A29E',
      700: '#D6D3D1',
      900: '#FAFAF9',
    },
  },
}

