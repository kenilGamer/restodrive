# HeroDeviceShowcase Component (TypeScript)

A production-ready, accessible, and performant React component for showcasing device mockups with floating feature cards. Built with TypeScript for full type safety.

## Quick Start

```tsx
import HeroDeviceShowcase from "@/components/hero/HeroDeviceShowcase"
import type { HeroDeviceShowcaseProps } from "@/components/hero/HeroDeviceShowcase"

export default function Hero() {
  const images: HeroDeviceShowcaseProps["images"] = {
    hero: {
      src: "https://example.com/hero.jpg",
      alt: "Hero background",
      priority: true,
    },
    tablet: {
      src: "https://example.com/tablet.jpg",
      alt: "Tablet mockup",
    },
    phone: {
      src: "https://example.com/phone.jpg",
      alt: "Phone mockup",
    },
    featureCards: [
      {
        id: "feature-1",
        title: "Stunning Food Photography",
        subtitle: "Showcase your dishes beautifully",
        image: "https://example.com/card1.jpg",
        badge: "Premium",
      },
    ],
  }

  return <HeroDeviceShowcase images={images} />
}
```

## Props

### `images` (required)
Object containing all image configurations:

```jsx
{
  hero: {
    src: string,        // Background image (blurred) + desktop mockup (clear)
    alt: string,       // Alt text for accessibility
    priority?: boolean  // Load immediately (default: false)
  },
  tablet: {
    src: string,       // Tablet mockup image
    alt: string
  },
  phone: {
    src: string,       // Phone mockup image
    alt: string
  },
  featureCards: [
    {
      id: string,           // Unique identifier
      title: string,        // Card title
      subtitle: string,     // Card subtitle/description
      image?: string,       // Optional card image
      badge?: string        // Optional badge text (e.g., "Premium")
    }
  ]
}
```

### `reducedMotion` (optional)
Boolean to force reduced motion mode (overrides `prefers-reduced-motion`)

### `themeTokens` (optional)
Custom theme colors:

```jsx
{
  colors: {
    amberStart: "#FFB800",  // Amber gradient start
    amberEnd: "#FF8A00",    // Amber gradient end
    cardBg: "rgba(255, 255, 255, 0.9)",  // Card background
    uiBorder: "rgba(231, 229, 228, 0.5)" // Card border
  }
}
```

### `className` (optional)
Additional CSS classes for the container

## Features

- ✅ **Background Hero Image**: Desaturated + blur effect for better card readability
- ✅ **3D Device Mockups**: Desktop (centered), Tablet (left), Phone (right)
- ✅ **Floating Cards**: 3-4 on desktop, 1-2 on mobile
- ✅ **Accessibility**: Full ARIA support, keyboard navigation, reduced motion
- ✅ **Performance**: Lazy loading, GPU-friendly animations, optimized images
- ✅ **Responsive**: Mobile-first design with proper breakpoints

## Responsive Behavior

- **Desktop (md+)**: Full layout with background, all 3 devices, 3-4 floating cards
- **Mobile (< md)**: Background + desktop mockup only, 1-2 cards in grid

## Animations

- **Entrance**: Staggered fade-up (0.6s duration, 0.08s stagger)
- **Idle Float**: `y: [-6, 0, -6]`, 6s duration (disabled when `reducedMotion`)
- **Hover**: `scale: 1.04, y: -6, rotateY: ±6deg`

## Styling

- **Card Radius**: 18px (`rounded-lgcard`)
- **Card Background**: Soft white (`cardBg` token)
- **Card Border**: Thin border (`uiBorder` token)
- **Card Shadow**: Subtle glow (`card-glow` token)

## Files Included

1. **`HeroDeviceShowcase.tsx`** - Main component (TypeScript)
2. **`tailwind.config.snippet.js`** - Tailwind configuration
3. **`HeroDeviceShowcase.example.tsx`** - Usage examples (TypeScript)
4. **`HeroDeviceShowcase.ACCESSIBILITY.md`** - Accessibility documentation
5. **`HeroDeviceShowcase.TESTING.md`** - Testing checklist
6. **`HeroDeviceShowcase.CSS_FALLBACK.css`** - CSS fallback (if Tailwind unavailable)

## Tailwind Configuration

Add to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'amber-start': '#FFB800',
        'amber-end': '#FF8A00',
        'card-bg': 'rgba(255, 255, 255, 0.9)',
        'ui-border': 'rgba(231, 229, 228, 0.5)',
      },
      borderRadius: {
        'lgcard': '18px',
      },
      boxShadow: {
        'card-glow': '0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      },
    },
  },
}
```

## Accessibility

- Respects `prefers-reduced-motion`
- Keyboard navigation (Tab, Enter, Space)
- ARIA labels and roles
- Visible focus indicators
- Meaningful alt text required

See `HeroDeviceShowcase.ACCESSIBILITY.md` for full details.

## Testing

See `HeroDeviceShowcase.TESTING.md` for complete test suite.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Use freely in your projects.
