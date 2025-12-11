/**
 * HeroDeviceShowcase Usage Example (TypeScript)
 * 
 * This file demonstrates how to use the HeroDeviceShowcase component
 * with various configurations.
 */

import HeroDeviceShowcase, { type HeroDeviceShowcaseProps, type FeatureCard } from "@/components/hero/HeroDeviceShowcase"

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export function BasicExample() {
  const images: HeroDeviceShowcaseProps["images"] = {
    hero: {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&h=1080&fit=crop&q=90",
      alt: "Premium vegetarian restaurant website background",
      priority: true, // Load immediately
    },
    tablet: {
      src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=90",
      alt: "Tablet mockup showing menu template",
    },
    phone: {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop&q=90",
      alt: "Mobile mockup showing restaurant app",
    },
    featureCards: [
      {
        id: "food-photography",
        title: "Stunning Food Photography",
        subtitle: "Showcase your dishes beautifully",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=90",
        badge: "Premium",
      },
      {
        id: "menu-layout",
        title: "Elegant Menu Layout",
        subtitle: "Organize your menu with style",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=90",
      },
      {
        id: "reservations",
        title: "Table Reservations",
        subtitle: "Seamless booking experience",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=90",
      },
      {
        id: "online-ordering",
        title: "Online Ordering",
        subtitle: "Accept orders seamlessly",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=90",
        badge: "New",
      },
    ],
  }

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-white via-[#FFFBF0] to-[#F9F9F9] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <HeroDeviceShowcase images={images} />
      </div>
    </section>
  )
}

// ============================================================================
// Example 2: Custom Theme Tokens
// ============================================================================

export function CustomThemeExample() {
  const customTheme = {
    colors: {
      amberStart: "#F59E0B", // Different amber shade
      amberEnd: "#D97706",
      cardBg: "rgba(255, 255, 255, 0.95)",
      uiBorder: "rgba(229, 231, 235, 0.6)",
    },
  }

  const images: HeroDeviceShowcaseProps["images"] = {
    hero: {
      src: "https://example.com/hero.jpg",
      alt: "Hero background",
      priority: true,
    },
    featureCards: [],
  }

  return <HeroDeviceShowcase images={images} themeTokens={customTheme} />
}

// ============================================================================
// Example 3: Reduced Motion
// ============================================================================

export function ReducedMotionExample() {
  const images: HeroDeviceShowcaseProps["images"] = {
    hero: {
      src: "https://example.com/hero.jpg",
      alt: "Hero background",
      priority: true,
    },
    featureCards: [],
  }

  return <HeroDeviceShowcase images={images} reducedMotion={true} />
}

// ============================================================================
// Example 4: Minimal (Hero Background Only)
// ============================================================================

export function MinimalExample() {
  const images: HeroDeviceShowcaseProps["images"] = {
    hero: {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&h=1080&fit=crop&q=90",
      alt: "Restaurant background",
      priority: true,
    },
    featureCards: [
      {
        id: "feature-1",
        title: "Quick Setup",
        subtitle: "Get started in minutes",
      },
    ],
  }

  return <HeroDeviceShowcase images={images} />
}

// ============================================================================
// Example 5: Type-Safe Card Array
// ============================================================================

export function TypeSafeExample() {
  const featureCards: FeatureCard[] = [
    {
      id: "card-1",
      title: "Feature One",
      subtitle: "Description one",
      image: "https://example.com/image1.jpg",
      badge: "Premium",
    },
    {
      id: "card-2",
      title: "Feature Two",
      subtitle: "Description two",
      image: "https://example.com/image2.jpg",
    },
  ]

  const images: HeroDeviceShowcaseProps["images"] = {
    hero: {
      src: "https://example.com/hero.jpg",
      alt: "Hero",
      priority: true,
    },
    featureCards,
  }

  return <HeroDeviceShowcase images={images} />
}
