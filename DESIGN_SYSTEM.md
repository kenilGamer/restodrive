# Restaurant Digital Suite - Luxury Gold Design System

## 🎨 Color System

### Primary Palette

```css
/* Primary Gold */
--gold-50: #FFFBF0;
--gold-100: #FFF7E0;
--gold-200: #FFEFB3;
--gold-300: #FFE680;
--gold-400: #F6C440;  /* Primary Gold */
--gold-500: #E5B030;
--gold-600: #D49E20;
--gold-700: #B88510;
--gold-800: #9A6D00;
--gold-900: #7C5500;

/* Deep Black */
--black-50: #1A1A1A;
--black-100: #141414;
--black-200: #0F0F0F;
--black-300: #0D0D0D;  /* Deep Black */
--black-400: #0A0A0A;
--black-500: #080808;
--black-600: #050505;
--black-700: #030303;
--black-800: #020202;
--black-900: #000000;

/* Warm Brown */
--brown-50: #F5F1ED;
--brown-100: #E8DED4;
--brown-200: #D4C2B0;
--brown-300: #B89A7D;
--brown-400: #9B7A5A;
--brown-500: #7D5A3D;
--brown-600: #5F3F28;
--brown-700: #412A1A;
--brown-800: #2B1E14;  /* Warm Brown */
--brown-900: #1A120C;

/* Champagne White */
--champagne-50: #FEFCF9;
--champagne-100: #FCF9F3;
--champagne-200: #FAF5ED;
--champagne-300: #F8F2E7;  /* Champagne White */
--champagne-400: #F5EDE0;
--champagne-500: #F2E8D9;

/* Graphite Gray */
--graphite-50: #4A4A4A;
--graphite-100: #3D3D3D;
--graphite-200: #303030;
--graphite-300: #252525;
--graphite-400: #1F1F1F;  /* Graphite Gray */
--graphite-500: #1A1A1A;
--graphite-600: #151515;
--graphite-700: #121212;
--graphite-800: #0F0F0F;
--graphite-900: #0D0D0D;

/* Accent Colors */
--emerald: #2ECC71;
--emerald-dark: #27AE60;
--error-red: #E74C3C;
--error-red-dark: #C0392B;
--warning-amber: #F39C12;
--info-blue: #3498DB;
```

### Background Hierarchy

```css
/* Light Mode */
--bg-primary: #F8F2E7;      /* Champagne White */
--bg-secondary: #FFFFFF;     /* Pure White */
--bg-tertiary: #F5EDE0;      /* Light Champagne */
--bg-elevated: #FFFFFF;      /* Cards, Modals */
--bg-overlay: rgba(13, 13, 13, 0.6);  /* Modal overlays */

/* Dark Mode */
--bg-primary-dark: #0D0D0D;  /* Deep Black */
--bg-secondary-dark: #1F1F1F; /* Graphite Gray */
--bg-tertiary-dark: #252525;  /* Lighter Graphite */
--bg-elevated-dark: #2B1E14;  /* Warm Brown */
--bg-overlay-dark: rgba(0, 0, 0, 0.8);
```

### Surface Layers

```css
/* Elevation Levels */
--surface-0: transparent;
--surface-1: rgba(255, 255, 255, 0.05);  /* Subtle elevation */
--surface-2: rgba(255, 255, 255, 0.08);
--surface-3: rgba(255, 255, 255, 0.12);
--surface-4: rgba(255, 255, 255, 0.16);
--surface-5: rgba(255, 255, 255, 0.20);
```

### Borders

```css
--border-light: rgba(246, 196, 64, 0.2);
--border-medium: rgba(246, 196, 64, 0.4);
--border-strong: rgba(246, 196, 64, 0.6);
--border-dark: rgba(43, 30, 20, 0.3);
```

### Gradients

```css
/* Gold Gradients */
--gradient-gold-vertical: linear-gradient(180deg, #F6C440 0%, #E5B030 100%);
--gradient-gold-horizontal: linear-gradient(90deg, #F6C440 0%, #E5B030 100%);
--gradient-gold-radial: radial-gradient(circle, #F6C440 0%, #E5B030 100%);
--gradient-gold-subtle: linear-gradient(135deg, rgba(246, 196, 64, 0.1) 0%, rgba(246, 196, 64, 0.05) 100%);

/* Luxury Gradients */
--gradient-luxury: linear-gradient(135deg, #F6C440 0%, #2B1E14 50%, #0D0D0D 100%);
--gradient-champagne: linear-gradient(180deg, #F8F2E7 0%, #F5EDE0 100%);
--gradient-dark-luxury: linear-gradient(135deg, #1F1F1F 0%, #2B1E14 50%, #0D0D0D 100%);
```

### Shadows

```css
/* Light Mode Shadows */
--shadow-xs: 0 1px 2px rgba(13, 13, 13, 0.05);
--shadow-sm: 0 2px 4px rgba(13, 13, 13, 0.08);
--shadow-md: 0 4px 8px rgba(13, 13, 13, 0.12);
--shadow-lg: 0 8px 16px rgba(13, 13, 13, 0.16);
--shadow-xl: 0 12px 24px rgba(13, 13, 13, 0.20);
--shadow-2xl: 0 16px 32px rgba(13, 13, 13, 0.24);

/* Gold Glow Shadows */
--shadow-gold-sm: 0 2px 8px rgba(246, 196, 64, 0.3);
--shadow-gold-md: 0 4px 16px rgba(246, 196, 64, 0.4);
--shadow-gold-lg: 0 8px 24px rgba(246, 196, 64, 0.5);
--shadow-gold-xl: 0 12px 32px rgba(246, 196, 64, 0.6);

/* Dark Mode Shadows */
--shadow-dark-xs: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-dark-sm: 0 2px 4px rgba(0, 0, 0, 0.4);
--shadow-dark-md: 0 4px 8px rgba(0, 0, 0, 0.5);
--shadow-dark-lg: 0 8px 16px rgba(0, 0, 0, 0.6);
--shadow-dark-xl: 0 12px 24px rgba(0, 0, 0, 0.7);
```

---

## 📝 Typography System

### Font Pairings

**Primary:** Inter (Modern, clean, professional)
**Display:** Playfair Display (Elegant, luxury feel)
**Monospace:** JetBrains Mono (Code, technical)

### Type Scale

```css
/* Display */
--text-display: 72px / 80px;      /* Playfair Display, 800 weight */
--text-display-lg: 96px / 104px;  /* Hero headlines */

/* Headings */
--text-h1: 48px / 56px;            /* Inter, 700 weight */
--text-h2: 36px / 44px;           /* Inter, 700 weight */
--text-h3: 30px / 38px;           /* Inter, 600 weight */
--text-h4: 24px / 32px;           /* Inter, 600 weight */
--text-h5: 20px / 28px;           /* Inter, 600 weight */
--text-h6: 18px / 26px;           /* Inter, 600 weight */

/* Subtitle */
--text-subtitle: 16px / 24px;     /* Inter, 500 weight */
--text-subtitle-lg: 18px / 26px;  /* Inter, 500 weight */

/* Body */
--text-body-lg: 18px / 28px;      /* Inter, 400 weight */
--text-body: 16px / 24px;         /* Inter, 400 weight */
--text-body-sm: 14px / 20px;     /* Inter, 400 weight */

/* Caption */
--text-caption: 12px / 16px;      /* Inter, 400 weight */
--text-caption-sm: 11px / 14px;   /* Inter, 400 weight */

/* UI Labels */
--text-label: 14px / 20px;        /* Inter, 500 weight */
--text-label-sm: 12px / 16px;    /* Inter, 500 weight */

/* Button Text */
--text-button-lg: 16px / 24px;    /* Inter, 600 weight */
--text-button: 14px / 20px;       /* Inter, 600 weight */
--text-button-sm: 12px / 16px;   /* Inter, 600 weight */
```

### Letter Spacing

```css
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### Line Height Rules

- **Display/Headings:** 1.1 - 1.2 (tight)
- **Body Text:** 1.5 - 1.75 (comfortable reading)
- **UI Elements:** 1.25 - 1.5 (compact but readable)

---

## 🎯 Component System

### Buttons

#### Primary (Gold)
```css
.btn-primary {
  background: var(--gradient-gold-vertical);
  color: var(--black-300);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-gold-sm);
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold-md);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary (Black)
```css
.btn-secondary {
  background: var(--black-300);
  color: var(--gold-400);
  border: 1px solid var(--border-medium);
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--black-200);
  box-shadow: 0 0 0 3px rgba(246, 196, 64, 0.1);
}
```

#### Ghost
```css
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
}

.btn-ghost:hover {
  background: var(--surface-1);
}
```

#### Destructive
```css
.btn-destructive {
  background: var(--error-red);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}
```

### Inputs

```css
.input-base {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.2s;
}

.input-base:focus {
  outline: none;
  border-color: var(--gold-400);
  box-shadow: 0 0 0 3px rgba(246, 196, 64, 0.1);
}

.input-base::placeholder {
  color: var(--graphite-300);
}
```

### Cards

#### Dashboard Card
```css
.card-dashboard {
  background: var(--bg-elevated);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s;
}

.card-dashboard:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

#### Menu Item Card
```css
.card-menu-item {
  background: var(--bg-elevated);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.card-menu-item:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-gold-md);
}
```

### Navigation

#### Sidebar
```css
.sidebar {
  background: var(--black-300);
  width: 256px;
  border-right: 1px solid var(--border-dark);
}

.sidebar-item {
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--champagne-300);
  transition: all 0.2s;
}

.sidebar-item:hover {
  background: var(--surface-2);
  color: var(--gold-400);
}

.sidebar-item.active {
  background: var(--gradient-gold-subtle);
  color: var(--gold-400);
  border-left: 3px solid var(--gold-400);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: rgba(46, 204, 113, 0.1);
  color: var(--emerald);
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.badge-warning {
  background: rgba(243, 156, 18, 0.1);
  color: var(--warning-amber);
  border: 1px solid rgba(243, 156, 18, 0.2);
}

.badge-error {
  background: rgba(231, 76, 60, 0.1);
  color: var(--error-red);
  border: 1px solid rgba(231, 76, 60, 0.2);
}
```

### Alerts

```css
.alert {
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 4px solid;
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-success {
  background: rgba(46, 204, 113, 0.1);
  border-color: var(--emerald);
  color: var(--emerald-dark);
}

.alert-warning {
  background: rgba(243, 156, 18, 0.1);
  border-color: var(--warning-amber);
  color: var(--warning-amber);
}

.alert-error {
  background: rgba(231, 76, 60, 0.1);
  border-color: var(--error-red);
  color: var(--error-red-dark);
}
```

### Modals

```css
.modal-overlay {
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s;
}

.modal-content {
  background: var(--bg-elevated);
  border-radius: 16px;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-light);
  animation: scaleIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  max-width: 600px;
  padding: 32px;
}
```

### Tables

```css
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  background: var(--surface-1);
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-light);
}

.table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
}

.table tr:hover {
  background: var(--surface-1);
}
```

---

## 🎬 Interaction & Motion

### Animation Timing

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--easing-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
--easing-enter: cubic-bezier(0.0, 0.0, 0.2, 1);
--easing-exit: cubic-bezier(0.4, 0.0, 1, 1);
```

### Motion States

```css
/* Button Hover Lift + Glow */
@keyframes buttonLift {
  from {
    transform: translateY(0);
    box-shadow: var(--shadow-gold-sm);
  }
  to {
    transform: translateY(-2px);
    box-shadow: var(--shadow-gold-md);
  }
}

/* Card Hover Bloom */
@keyframes cardBloom {
  from {
    box-shadow: var(--shadow-md);
  }
  to {
    box-shadow: var(--shadow-gold-lg);
  }
}

/* Add to Cart Bounce */
@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Modal Fade Scale */
@keyframes modalFadeScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Drawer Slide In */
@keyframes drawerSlide {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

---

## 📐 Spacing & Grid System

### Spacing Scale

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Border Radius Scale

```css
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Grid System

```css
/* 12-Column Grid */
.grid-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}

/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 🌓 Theme Tokens

### Light Mode

```css
[data-theme="light"] {
  --bg-primary: #F8F2E7;
  --bg-secondary: #FFFFFF;
  --text-primary: #0D0D0D;
  --text-secondary: #1F1F1F;
  --text-tertiary: #4A4A4A;
  --border-color: rgba(246, 196, 64, 0.2);
  --shadow-base: rgba(13, 13, 13, 0.1);
}
```

### Dark Mode

```css
[data-theme="dark"] {
  --bg-primary: #0D0D0D;
  --bg-secondary: #1F1F1F;
  --text-primary: #F8F2E7;
  --text-secondary: #E8DED4;
  --text-tertiary: #B89A7D;
  --border-color: rgba(246, 196, 64, 0.3);
  --shadow-base: rgba(0, 0, 0, 0.5);
}
```

---

## 🎨 Iconography

### Icon Specifications

- **Library:** Lucide React (recommended)
- **Style:** Outline with rounded corners
- **Stroke Width:** 2px (default), 1.5px (small), 2.5px (large)
- **Size Scale:** 16px, 20px, 24px, 32px, 48px
- **Color:** Inherit from parent or use theme colors

### Restaurant-Specific Icons

- Chef Hat (restaurant/kitchen)
- Utensils (menu/dining)
- Fork & Knife (dining)
- Plate/Dish (menu items)
- Steam (hot food)
- Clock (preparation time)
- Star (ratings/favorites)

---

## 📱 Screen Specifications

### QR Menu Screen

- **Category Tabs:** Horizontal scrollable tabs with gold indicator
- **Menu Grid:** 2-column mobile, 3-column tablet, 4-column desktop
- **Item Modal:** Full-screen mobile, centered modal desktop
- **Food Image:** 16:9 aspect ratio, rounded corners

### Menu Builder

- **Left Sidebar:** 256px width, category list
- **Central Canvas:** Flexible width, drag-drop area
- **Right Panel:** 320px width, properties editor
- **Top Toolbar:** 64px height, action buttons

### POS Dashboard

- **Item Grid:** Touch-friendly 80px minimum touch targets
- **Order Panel:** Fixed right sidebar, 400px width
- **Payment Panel:** Slide-over from right, 480px width

---

## 🎯 Usage Rules

### Color Usage

1. **Gold (#F6C440):** Primary actions, highlights, accents
2. **Deep Black (#0D0D0D):** Primary backgrounds (dark mode), text (light mode)
3. **Champagne White (#F8F2E7):** Primary backgrounds (light mode)
4. **Warm Brown (#2B1E14):** Secondary surfaces, borders
5. **Graphite Gray (#1F1F1F):** Secondary backgrounds, subtle elements
6. **Emerald (#2ECC71):** Success states, positive actions
7. **Error Red (#E74C3C):** Errors, destructive actions

### Typography Rules

1. **Display:** Only for hero sections, landing pages
2. **Headings:** Use semantic hierarchy (h1 → h6)
3. **Body:** Default for all content
4. **Labels:** For form fields, UI elements
5. **Captions:** For metadata, timestamps

### Shadow Rules

1. **Elevation:** Use shadows to show hierarchy
2. **Gold Glow:** Only for interactive gold elements
3. **Dark Mode:** Stronger shadows for better contrast

### Border Rules

1. **Light Mode:** Subtle borders (low opacity)
2. **Dark Mode:** Slightly more visible borders
3. **Gold Accents:** Use gold borders for active/focused states

---

## 🚀 Implementation

This design system can be implemented as:

1. **Tailwind CSS Theme** - Custom theme configuration
2. **CSS Variables** - Global CSS custom properties
3. **Component Library** - React components with design tokens
4. **Storybook** - Component documentation and testing

Would you like me to:
- Create a Tailwind theme configuration file?
- Generate CSS variables file?
- Build React component examples?
- Create a Storybook setup?

