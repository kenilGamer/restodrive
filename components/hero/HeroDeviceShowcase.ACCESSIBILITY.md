# Accessibility Documentation for HeroDeviceShowcase

## Overview

The `HeroDeviceShowcase` component is designed to be fully accessible, following WCAG 2.1 Level AA guidelines.

## Reduced Motion Handling

### Automatic Detection
The component automatically detects user preferences via `window.matchMedia('(prefers-reduced-motion: reduce')`:

```jsx
// Automatically respects system preference
<HeroDeviceShowcase images={...} />
```

### Manual Override
You can force reduced motion mode via the `reducedMotion` prop:

```jsx
// Force reduced motion (overrides system preference)
<HeroDeviceShowcase images={...} reducedMotion={true} />
```

### What Gets Disabled
When `reducedMotion` is `true`:
- ✅ Infinite floating animations (`y: [-6, 0, -6]`) are disabled
- ✅ Rotation animations are disabled
- ✅ Hover micro-interactions are disabled
- ✅ Entrance animations are simplified (fade only, no transforms)
- ✅ All animations use shorter durations (0.6s instead of 6s)

## ARIA Labels and Roles

### Device Mockups
- **Role**: `role="img"` - Indicates decorative/illustrative content
- **Label**: `aria-label="desktop website preview"` - Descriptive label for screen readers
- **Hidden Elements**: Browser chrome and notches use `aria-hidden="true"`

### Feature Cards
- **Role**: `role="article"` - Semantic HTML for card content
- **Label**: `aria-label="{title} feature"` - Descriptive label combining title

### Background Hero
- **Hidden**: `aria-hidden="true"` - Decorative background image

### Container
- **Role**: `role="region"` - Landmark region for screen readers
- **Label**: `aria-label="Device showcase"` - Descriptive region label

## Keyboard Navigation

### Focusable Elements
All feature cards are keyboard accessible:
- **Tab Index**: `tabIndex={0}` - Makes cards focusable
- **Keyboard Handler**: `onKeyDown` - Handles Enter/Space to activate
- **Focus Indicator**: Visible focus ring using `focus:ring-2 focus:ring-amberStart`

### Keyboard Interaction
```jsx
// Cards respond to:
- Tab: Focus next card
- Shift+Tab: Focus previous card
- Enter/Space: Activate card (triggers click)
```

### Focus Management
- Focus order follows visual order (left-to-right, top-to-bottom)
- Focus rings are clearly visible (2px ring with amber color)
- Focus offset prevents overlap with card content

## Alt Text Requirements

### Required Alt Text
All images **must** have descriptive alt text:

```jsx
images: {
  hero: {
    src: "...",
    alt: "Premium vegetarian restaurant website background", // ✅ Descriptive
    // alt: "Image" // ❌ Too generic
  },
  tablet: {
    src: "...",
    alt: "Tablet mockup showing menu template", // ✅ Descriptive
  },
  phone: {
    src: "...",
    alt: "Mobile mockup showing restaurant app", // ✅ Descriptive
  },
  featureCards: [
    {
      image: "...",
      // Alt text auto-generated from title + subtitle
      // "Stunning Food Photography - Showcase your dishes beautifully"
    }
  ]
}
```

### Alt Text Guidelines
- ✅ **Do**: Describe the content and purpose
- ✅ **Do**: Include context (e.g., "restaurant website", "menu template")
- ✅ **Do**: Keep it concise (under 125 characters)
- ❌ **Don't**: Use generic text like "image" or "photo"
- ❌ **Don't**: Include "image of" or "picture of" (redundant)

## Focus Indicators

### Visible Focus Rings
All interactive elements have visible focus indicators:

```css
/* Applied to feature cards */
focus:outline-none
focus:ring-2
focus:ring-offset-2
focus:ring-amberStart
```

### Focus Ring Styling
- **Width**: 2px ring
- **Offset**: 2px offset for better visibility
- **Color**: Amber accent color (matches theme)
- **Contrast**: Meets WCAG AA contrast requirements

## Screen Reader Support

### Semantic HTML
- Uses semantic elements (`<article>`, `<section>`)
- Proper heading hierarchy (`<h3>` for card titles)
- Descriptive labels for all interactive elements

### Hidden Decorative Elements
- Browser chrome dots: `aria-hidden="true"`
- Phone notch: `aria-hidden="true"`
- Background hero: `aria-hidden="true"`
- Decorative overlays: `aria-hidden="true"`

### Content Structure
```
Device Showcase (region)
├── Desktop Preview (img)
├── Tablet Preview (img, hidden on mobile)
├── Phone Preview (img, hidden on mobile)
└── Feature Cards (articles)
    ├── Food Photography (article)
    ├── Menu Layout (article)
    └── ...
```

## Color Contrast

### Text Contrast
- **Card Titles**: `text-stone-900` on `cardBg` - Meets WCAG AA (4.5:1)
- **Card Subtitles**: `text-stone-600` on `cardBg` - Meets WCAG AA (4.5:1)
- **Badge Text**: White on amber gradient - Meets WCAG AA (4.5:1)

### Focus Indicators
- **Focus Ring**: Amber color on white background - High contrast
- **Focus Offset**: Ensures visibility on all backgrounds

## Testing Checklist

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Verify all images have meaningful alt text
- [ ] Verify cards are announced correctly
- [ ] Verify device mockups are described

### Keyboard Navigation Testing
- [ ] Tab through all cards
- [ ] Verify focus rings are visible
- [ ] Test Enter/Space activation
- [ ] Verify focus order matches visual order
- [ ] Test on mobile (touch + keyboard)

### Reduced Motion Testing
- [ ] Enable `prefers-reduced-motion` in OS
- [ ] Verify animations are disabled
- [ ] Verify no infinite loops
- [ ] Test with `reducedMotion={true}` prop
- [ ] Verify content is still readable

### Visual Testing
- [ ] Verify text contrast meets WCAG AA
- [ ] Verify focus indicators are visible
- [ ] Test with browser zoom (200%)
- [ ] Test with high contrast mode
- [ ] Verify mobile layout is accessible

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Fallbacks
- Reduced motion: Graceful degradation (animations disabled)
- CSS Grid: Falls back to flexbox on older browsers
- Backdrop blur: Falls back to solid background

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

