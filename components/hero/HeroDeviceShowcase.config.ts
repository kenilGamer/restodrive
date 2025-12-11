/**
 * Tailwind Config Snippet for HeroDeviceShowcase
 * 
 * Add this to your tailwind.config.js or tailwind.config.ts
 */

export const tailwindConfigSnippet = `
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Amber/Gold accent colors
        'amber-start': '#FFB800',
        'amber-end': '#FF8A00',
        
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
        'device': '0.5rem',      // md:rounded-lg
        'device-lg': '0.75rem',   // md:rounded-xl
        'device-mobile': '2rem',   // rounded-[2rem]
      },
      boxShadow: {
        'device': '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'card': '0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'card-hover': '0 25px 70px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
      },
      backdropBlur: {
        'card': '40px', // backdrop-blur-2xl equivalent
      },
    },
  },
}
`

/**
 * Dark Mode Variant (Optional)
 * 
 * To enable dark mode, add this to your theme.extend.colors:
 */
export const darkModeColors = {
  dark: {
    'amber-start': '#FFC947',
    'amber-end': '#FF9800',
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

