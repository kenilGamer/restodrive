# Testing Checklist for HeroDeviceShowcase

## Unit Tests (Jest + React Testing Library)

### Setup

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import HeroDeviceShowcase from './HeroDeviceShowcase'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))
```

### Test 1: Renders Without Crashing

```jsx
describe('HeroDeviceShowcase', () => {
  it('renders without crashing', () => {
    const images = {
      hero: { src: '/test-hero.jpg', alt: 'Test hero' },
      tablet: { src: '/test-tablet.jpg', alt: 'Test tablet' },
      phone: { src: '/test-phone.jpg', alt: 'Test phone' },
      featureCards: [
        { id: '1', title: 'Test', subtitle: 'Test subtitle', image: '/test.jpg' },
      ],
    }

    render(<HeroDeviceShowcase images={images} />)
    
    expect(screen.getByRole('region', { name: /device showcase/i })).toBeInTheDocument()
  })
})
```

### Test 2: Reduced Motion Disables Loops

```jsx
it('disables infinite animations when reducedMotion is true', () => {
  const images = {
    hero: { src: '/test.jpg', alt: 'Test' },
    featureCards: [
      { id: '1', title: 'Test', subtitle: 'Test' },
    ],
  }

  const { container } = render(
    <HeroDeviceShowcase images={images} reducedMotion={true} />
  )

  // Check that motion components don't have repeat: Infinity
  const motionElements = container.querySelectorAll('[data-framer-motion]')
  motionElements.forEach((el) => {
    const style = window.getComputedStyle(el)
    // Verify no infinite animations
    expect(style.animationIterationCount).not.toBe('infinite')
  })
})
```

### Test 3: Mobile Layout Collapses Extra Mockups

```jsx
it('hides tablet and phone mockups on mobile', () => {
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 600, // Mobile width
  })

  const images = {
    hero: { src: '/test.jpg', alt: 'Test' },
    tablet: { src: '/test-tablet.jpg', alt: 'Test tablet' },
    phone: { src: '/test-phone.jpg', alt: 'Test phone' },
    featureCards: [],
  }

  const { container } = render(<HeroDeviceShowcase images={images} />)

  // Tablet and phone should be hidden
  const tablet = container.querySelector('[aria-label*="tablet"]')
  const phone = container.querySelector('[aria-label*="phone"]')

  expect(tablet).toHaveClass('hidden')
  expect(phone).toHaveClass('hidden')
})
```

### Test 4: Keyboard Navigation Works

```jsx
it('allows keyboard navigation of feature cards', () => {
  const images = {
    hero: { src: '/test.jpg', alt: 'Test' },
    featureCards: [
      { id: '1', title: 'Card 1', subtitle: 'Subtitle 1' },
      { id: '2', title: 'Card 2', subtitle: 'Subtitle 2' },
    ],
  }

  render(<HeroDeviceShowcase images={images} />)

  const cards = screen.getAllByRole('article')
  
  // First card should be focusable
  cards[0].focus()
  expect(cards[0]).toHaveFocus()

  // Tab to next card
  fireEvent.keyDown(cards[0], { key: 'Tab' })
  expect(cards[1]).toHaveFocus()
})
```

### Test 5: Images Load Correctly

```jsx
it('loads images with correct attributes', () => {
  const images = {
    hero: {
      src: '/test-hero.jpg',
      alt: 'Hero background',
      priority: true,
    },
    tablet: {
      src: '/test-tablet.jpg',
      alt: 'Tablet mockup',
    },
    featureCards: [
      {
        id: '1',
        title: 'Test',
        subtitle: 'Test',
        image: '/test-card.jpg',
      },
    ],
  }

  render(<HeroDeviceShowcase images={images} />)

  // Hero image should have priority
  const heroImg = screen.getByAltText('Hero background')
  expect(heroImg).toHaveAttribute('src', expect.stringContaining('test-hero'))

  // Card images should load lazily
  const cardImg = screen.getByAltText(/Test - Test/i)
  expect(cardImg).toBeInTheDocument()
})
```

### Test 6: Card Limits (3-4 Desktop, 1-2 Mobile)

```jsx
it('limits cards to 4 on desktop and 2 on mobile', () => {
  const images = {
    hero: { src: '/test.jpg', alt: 'Test' },
    featureCards: [
      { id: '1', title: 'Card 1', subtitle: 'Sub' },
      { id: '2', title: 'Card 2', subtitle: 'Sub' },
      { id: '3', title: 'Card 3', subtitle: 'Sub' },
      { id: '4', title: 'Card 4', subtitle: 'Sub' },
      { id: '5', title: 'Card 5', subtitle: 'Sub' }, // Should be hidden
    ],
  }

  const { container } = render(<HeroDeviceShowcase images={images} />)

  // Desktop: Should show 4 cards max
  const desktopCards = container.querySelectorAll('.hidden.md\\:block article')
  expect(desktopCards.length).toBeLessThanOrEqual(4)

  // Mobile: Should show 2 cards max
  const mobileCards = container.querySelectorAll('.md\\:hidden article')
  expect(mobileCards.length).toBeLessThanOrEqual(2)
})
```

### Test 7: Theme Tokens Applied

```jsx
it('applies custom theme tokens', () => {
  const customTheme = {
    colors: {
      amberStart: '#CUSTOM_START',
      amberEnd: '#CUSTOM_END',
      cardBg: 'rgba(255, 0, 0, 0.9)',
      uiBorder: 'rgba(0, 255, 0, 0.5)',
    },
  }

  const images = {
    hero: { src: '/test.jpg', alt: 'Test' },
    featureCards: [
      { id: '1', title: 'Test', subtitle: 'Test', badge: 'Premium' },
    ],
  }

  const { container } = render(
    <HeroDeviceShowcase images={images} themeTokens={customTheme} />
  )

  // Check that badge uses custom gradient
  const badge = container.querySelector('[style*="CUSTOM_START"]')
  expect(badge).toBeInTheDocument()
})
```

### Test 8: Reduced Motion Detection

```jsx
it('detects prefers-reduced-motion from system', () => {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  const images = {
    hero: { src: '/test.jpg', alt: 'Test' },
    featureCards: [],
  }

  render(<HeroDeviceShowcase images={images} />)

  // Should respect system preference
  expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
})
```

## Integration Tests

### Test: Full Component Integration

```jsx
describe('HeroDeviceShowcase Integration', () => {
  it('renders complete component with all features', async () => {
    const images = {
      hero: {
        src: '/hero.jpg',
        alt: 'Hero background',
        priority: true,
      },
      tablet: {
        src: '/tablet.jpg',
        alt: 'Tablet mockup',
      },
      phone: {
        src: '/phone.jpg',
        alt: 'Phone mockup',
      },
      featureCards: [
        {
          id: '1',
          title: 'Feature 1',
          subtitle: 'Description 1',
          image: '/card1.jpg',
          badge: 'Premium',
        },
        {
          id: '2',
          title: 'Feature 2',
          subtitle: 'Description 2',
          image: '/card2.jpg',
        },
      ],
    }

    const { container } = render(<HeroDeviceShowcase images={images} />)

    // Verify all elements render
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByAltText('Hero background')).toBeInTheDocument()
    expect(screen.getByAltText('Tablet mockup')).toBeInTheDocument()
    expect(screen.getByAltText('Phone mockup')).toBeInTheDocument()
    expect(screen.getByRole('article', { name: /Feature 1/i })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: /Feature 2/i })).toBeInTheDocument()
  })
})
```

## E2E Tests (Playwright/Cypress)

### Test: User Interaction Flow

```jsx
// Playwright example
test('user can navigate cards with keyboard', async ({ page }) => {
  await page.goto('/')
  
  // Focus first card
  await page.keyboard.press('Tab')
  const firstCard = page.locator('article').first()
  await expect(firstCard).toBeFocused()
  
  // Navigate to next card
  await page.keyboard.press('Tab')
  const secondCard = page.locator('article').nth(1)
  await expect(secondCard).toBeFocused()
})
```

## Visual Regression Tests

### Test: Layout Consistency

```jsx
// Using Percy or Chromatic
test('maintains layout across breakpoints', async ({ page }) => {
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')
  await expect(page).toHaveScreenshot('desktop.png')

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 })
  await expect(page).toHaveScreenshot('tablet.png')

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page).toHaveScreenshot('mobile.png')
})
```

## Performance Tests

### Test: Image Loading Performance

```jsx
it('loads priority images immediately', async () => {
  const images = {
    hero: {
      src: '/hero.jpg',
      alt: 'Hero',
      priority: true,
    },
    featureCards: [],
  }

  const { container } = render(<HeroDeviceShowcase images={images} />)

  // Priority image should load immediately
  const heroImg = container.querySelector('img[alt="Hero"]')
  expect(heroImg).toHaveAttribute('loading', 'eager')
})
```

## Accessibility Tests (axe-core)

### Test: No Accessibility Violations

```jsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const images = {
    hero: { src: '/test.jpg', alt: 'Test hero' },
    featureCards: [
      { id: '1', title: 'Test', subtitle: 'Test' },
    ],
  }

  const { container } = render(<HeroDeviceShowcase images={images} />)
  const results = await axe(container)
  
  expect(results).toHaveNoViolations()
})
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All user flows
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Visual Tests**: All breakpoints
- **Performance Tests**: Core Web Vitals

