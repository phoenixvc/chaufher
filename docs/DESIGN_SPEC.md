# ChaufHER Design System Specification

> **Version:** 1.0.0  
> **Last Updated:** January 4, 2026  
> **Applies To:** All ChaufHER repositories

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Icons & Imagery](#icons--imagery)
7. [Motion & Animation](#motion--animation)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Repository-Specific Guidelines](#repository-specific-guidelines)

---

## Brand Overview

### Mission Statement
ChaufHER provides safe, reliable transportation for women, by women. Our design reflects trust, empowerment, and modern convenience.

### Brand Personality
- **Trustworthy** - Safety is paramount
- **Empowering** - Women supporting women
- **Modern** - Clean, intuitive interfaces
- **Warm** - Approachable, not corporate
- **Professional** - Reliable and polished

### Brand Voice
- Confident but not aggressive
- Supportive and encouraging
- Clear and direct
- Inclusive and respectful

### Logo

```
Primary Logo:       [📍] ChaufHER
                    Magenta pin icon + "Chauf" (dark) + "HER" (magenta)

Horizontal:         [📍] ChaufHER     (default for headers)
Stacked:            [📍]
                    ChaufHER          (for square spaces)

Icon Only:          [📍]              (app icon, favicon)
```

**Logo Clear Space:** Minimum padding equal to the height of the pin icon on all sides.

**Logo Minimum Size:** 
- Horizontal: 120px width
- Icon only: 32px

---

## Color System

### Primary Colors

```css
/* Magenta - Primary Brand Color */
--color-magenta-50: #FDF2F8;
--color-magenta-100: #FCE7F3;
--color-magenta-200: #FBCFE8;
--color-magenta-300: #F9A8D4;
--color-magenta-400: #F472B6;
--color-magenta-500: #E91E8C;  /* PRIMARY */
--color-magenta-600: #DB2777;
--color-magenta-700: #BE185D;
--color-magenta-800: #9D174D;
--color-magenta-900: #831843;

/* Purple - Secondary/Accent Color */
--color-purple-50: #FAF5FF;
--color-purple-100: #F3E8FF;
--color-purple-200: #E9D5FF;
--color-purple-300: #D8B4FE;
--color-purple-400: #C084FC;
--color-purple-500: #9333EA;  /* SECONDARY */
--color-purple-600: #7C3AED;
--color-purple-700: #6D28D9;
--color-purple-800: #5B21B6;
--color-purple-900: #4C1D95;
```

### Brand Gradients

```css
/* Primary Gradient - Hero sections, CTAs */
--gradient-primary: linear-gradient(135deg, #E91E8C 0%, #9333EA 100%);

/* Soft Gradient - Backgrounds, cards */
--gradient-soft: linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%);

/* Dark Gradient - Footer, dark sections */
--gradient-dark: linear-gradient(135deg, #831843 0%, #4C1D95 100%);

/* Horizontal Gradient - Headers, banners */
--gradient-horizontal: linear-gradient(90deg, #E91E8C 0%, #9333EA 100%);
```

### Semantic Colors

```css
/* Status Colors */
--color-success-50: #F0FDF4;
--color-success-500: #22C55E;
--color-success-700: #15803D;

--color-warning-50: #FFFBEB;
--color-warning-500: #F59E0B;
--color-warning-700: #B45309;

--color-error-50: #FEF2F2;
--color-error-500: #EF4444;
--color-error-700: #B91C1C;

--color-info-50: #EFF6FF;
--color-info-500: #3B82F6;
--color-info-700: #1D4ED8;
```

### Neutral Colors

```css
--color-white: #FFFFFF;
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
--color-black: #000000;
```

### Color Usage Guidelines

| Use Case | Color | Token |
|----------|-------|-------|
| Primary buttons | Magenta 500 | `--color-magenta-500` |
| Primary button hover | Magenta 600 | `--color-magenta-600` |
| Secondary buttons | Purple 500 | `--color-purple-500` |
| Links | Magenta 600 | `--color-magenta-600` |
| Link hover | Magenta 700 | `--color-magenta-700` |
| Page background | Gray 50 | `--color-gray-50` |
| Card background | White | `--color-white` |
| Body text | Gray 700 | `--color-gray-700` |
| Headings | Gray 900 | `--color-gray-900` |
| Muted text | Gray 500 | `--color-gray-500` |
| Borders | Gray 200 | `--color-gray-200` |
| Dividers | Gray 100 | `--color-gray-100` |

### Ride Status Colors

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Scheduled | `purple-50` | `purple-700` | `purple-200` |
| Driver Assigned | `info-50` | `info-700` | `info-200` |
| Driver En Route | `warning-50` | `warning-700` | `warning-200` |
| Driver Arrived | `magenta-50` | `magenta-700` | `magenta-200` |
| In Progress | `info-50` | `info-700` | `info-200` |
| Completed | `success-50` | `success-700` | `success-200` |
| Cancelled | `error-50` | `error-700` | `error-200` |
| No Driver Found | `gray-100` | `gray-700` | `gray-300` |

---

## Typography

### Font Families

```css
/* Primary Font - Headings & UI */
--font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

/* Secondary Font - Body Text */
--font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace - Code, IDs */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Loading (Next.js)

```typescript
// app/layout.tsx
import { Poppins, Inter } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});
```

### Type Scale

```css
/* Headings - Poppins */
--text-h1: 2.5rem;      /* 40px - Page titles */
--text-h2: 2rem;        /* 32px - Section titles */
--text-h3: 1.5rem;      /* 24px - Card titles */
--text-h4: 1.25rem;     /* 20px - Subsections */
--text-h5: 1.125rem;    /* 18px - Labels */
--text-h6: 1rem;        /* 16px - Small headings */

/* Body - Inter */
--text-xl: 1.25rem;     /* 20px - Large body */
--text-lg: 1.125rem;    /* 18px - Intro text */
--text-base: 1rem;      /* 16px - Body text */
--text-sm: 0.875rem;    /* 14px - Secondary text */
--text-xs: 0.75rem;     /* 12px - Captions, badges */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Classes

```css
.heading-1 {
  font-family: var(--font-primary);
  font-size: var(--text-h1);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
}

.heading-2 {
  font-family: var(--font-primary);
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
}

.heading-3 {
  font-family: var(--font-primary);
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
}

.body-large {
  font-family: var(--font-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--color-gray-700);
}

.body {
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-700);
}

.body-small {
  font-family: var(--font-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-500);
}

.caption {
  font-family: var(--font-secondary);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Spacing & Layout

### Spacing Scale

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* App-specific */
--container-app: 1200px;     /* Main app content */
--container-narrow: 720px;   /* Forms, modals */
--container-wide: 1440px;    /* Admin dashboards */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Modals, large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;   /* Pills, avatars */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Colored shadows for buttons */
--shadow-magenta: 0 4px 14px 0 rgb(233 30 140 / 0.3);
--shadow-purple: 0 4px 14px 0 rgb(147 51 234 / 0.3);
```

### Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-fixed: 300;
--z-modal-backdrop: 400;
--z-modal: 500;
--z-popover: 600;
--z-tooltip: 700;
--z-toast: 800;
```

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-white);
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-magenta);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgb(233 30 140 / 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-magenta-600);
  background: var(--color-white);
  border: 2px solid var(--color-magenta-500);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-magenta-50);
  border-color: var(--color-magenta-600);
}
```

#### Ghost Button
```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-gray-700);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--color-gray-100);
}
```

#### Button Sizes
```css
.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.btn-md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}
```

### Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  color: var(--color-gray-900);
  background: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.input:hover {
  border-color: var(--color-gray-400);
}

.input:focus {
  outline: none;
  border-color: var(--color-magenta-500);
  box-shadow: 0 0 0 3px rgb(233 30 140 / 0.1);
}

.input:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.input-error {
  border-color: var(--color-error-500);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}
```

### Cards

```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.card-elevated {
  background: var(--color-white);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}

.card-gradient {
  background: var(--gradient-soft);
  border: 1px solid var(--color-magenta-100);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
```

### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-family: var(--font-secondary);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.badge-scheduled {
  background: var(--color-purple-50);
  color: var(--color-purple-700);
  border: 1px solid var(--color-purple-200);
}

.badge-assigned {
  background: var(--color-info-50);
  color: var(--color-info-700);
  border: 1px solid var(--color-info-200);
}

.badge-en-route {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  border: 1px solid var(--color-warning-200);
}

.badge-arrived {
  background: var(--color-magenta-50);
  color: var(--color-magenta-700);
  border: 1px solid var(--color-magenta-200);
}

.badge-in-progress {
  background: var(--color-info-50);
  color: var(--color-info-700);
  border: 1px solid var(--color-info-200);
}

.badge-completed {
  background: var(--color-success-50);
  color: var(--color-success-700);
  border: 1px solid var(--color-success-200);
}

.badge-cancelled {
  background: var(--color-error-50);
  color: var(--color-error-700);
  border: 1px solid var(--color-error-200);
}

.badge-verified {
  background: var(--color-success-50);
  color: var(--color-success-700);
  border: 1px solid var(--color-success-200);
}

.badge-pending {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  border: 1px solid var(--color-warning-200);
}
```

### Navigation

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
}

.nav-link {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-600);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--color-magenta-600);
  background: var(--color-magenta-50);
}

.nav-link-active {
  color: var(--color-magenta-600);
  background: var(--color-magenta-50);
}
```

### Hero Section

```css
.hero {
  position: relative;
  padding: var(--space-20) var(--space-6);
  background: var(--gradient-primary);
  color: var(--color-white);
  text-align: center;
  overflow: hidden;
}

.hero-title {
  font-family: var(--font-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
}

.hero-subtitle {
  font-family: var(--font-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto var(--space-8);
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) var(--space-8);
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-magenta-600);
  background: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 30px -5px rgb(0 0 0 / 0.2);
}
```

### Data Tables

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  padding: var(--space-3) var(--space-4);
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}

.table td {
  font-family: var(--font-secondary);
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-100);
}

.table tr:hover td {
  background: var(--color-gray-50);
}

.table-striped tr:nth-child(even) td {
  background: var(--color-gray-50);
}
```

### Modals

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop);
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: var(--z-modal);
  width: 100%;
  max-width: var(--container-narrow);
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
}
```

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: var(--z-toast);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  min-width: 300px;
  max-width: 420px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border-left: 4px solid;
}

.toast-success {
  border-left-color: var(--color-success-500);
}

.toast-error {
  border-left-color: var(--color-error-500);
}

.toast-warning {
  border-left-color: var(--color-warning-500);
}

.toast-info {
  border-left-color: var(--color-info-500);
}
```

### Empty States

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-6);
  text-align: center;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-6);
  color: var(--color-gray-300);
}

.empty-state-title {
  font-family: var(--font-primary);
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-family: var(--font-secondary);
  font-size: var(--text-base);
  color: var(--color-gray-500);
  max-width: 400px;
  margin-bottom: var(--space-6);
}
```

---

## Icons & Imagery

### Icon Library
Use **Lucide Icons** (lucide.dev) for consistent iconography.

```bash
# Install
npm install lucide-react
```

### Common Icons

| Purpose | Icon Name | Usage |
|---------|-----------|-------|
| Navigation | `Home`, `MapPin`, `Car`, `User`, `Settings` | Nav items |
| Actions | `Plus`, `Edit`, `Trash`, `Search`, `Filter` | Buttons |
| Status | `Check`, `X`, `AlertTriangle`, `Clock`, `Loader` | Indicators |
| Ride | `MapPin`, `Navigation`, `Car`, `Users`, `Phone` | Ride cards |
| Payment | `CreditCard`, `Wallet`, `DollarSign`, `Receipt` | Payment UI |
| Safety | `Shield`, `Lock`, `Eye`, `AlertCircle` | Safety features |

### Icon Sizing

```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
--icon-2xl: 48px;
```

### Photography Guidelines

1. **Hero Images**: Real photos of female drivers with passengers
2. **Diversity**: Represent diverse women across age, ethnicity
3. **Setting**: South African urban/suburban environments
4. **Mood**: Warm, safe, professional, friendly
5. **Quality**: High-resolution, professionally lit
6. **Overlay**: Use gradient overlays for text readability

### Illustrations

For empty states and onboarding, use simple line illustrations in magenta/purple tones.

---

## Motion & Animation

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Durations

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Standard Transitions

```css
/* Buttons, links */
.transition-colors {
  transition: color var(--duration-fast) var(--ease-out),
              background-color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

/* Transform effects */
.transition-transform {
  transition: transform var(--duration-normal) var(--ease-out);
}

/* All properties */
.transition-all {
  transition: all var(--duration-normal) var(--ease-out);
}
```

### Animation Keyframes

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide Down */
@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Usage Classes

```css
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.animate-slide-up {
  animation: slideUp var(--duration-slow) var(--ease-out);
}

.animate-slide-down {
  animation: slideDown var(--duration-slow) var(--ease-out);
}

.animate-scale-in {
  animation: scaleIn var(--duration-normal) var(--ease-out);
}

.animate-pulse {
  animation: pulse 2s var(--ease-in-out) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / Small desktop */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop */
```

### Media Queries

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Responsive Typography

```css
html {
  font-size: 14px; /* Mobile */
}

@media (min-width: 768px) {
  html {
    font-size: 15px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 16px; /* Desktop */
  }
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

---

## Accessibility

### Color Contrast
All color combinations must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Focus States

```css
/* Custom focus ring */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-white), 
              0 0 0 4px var(--color-magenta-500);
}

/* Focus visible only */
.focus-visible:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

.focus-visible:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-white), 
              0 0 0 4px var(--color-magenta-500);
}
```

### Skip Links

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: var(--space-2) var(--space-4);
  background: var(--color-magenta-500);
  color: var(--color-white);
  z-index: var(--z-tooltip);
}

.skip-link:focus {
  top: 0;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### ARIA Guidelines
- Use semantic HTML elements
- Add `aria-label` for icon-only buttons
- Use `aria-live` for dynamic content
- Ensure proper heading hierarchy
- Mark required form fields with `aria-required`

---

## Repository-Specific Guidelines

### chaufher-pwa (Next.js PWA)

#### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        magenta: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#E91E8C',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#9333EA',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E91E8C 0%, #9333EA 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #831843 0%, #4C1D95 100%)',
      },
      boxShadow: {
        'magenta': '0 4px 14px 0 rgb(233 30 140 / 0.3)',
        'purple': '0 4px 14px 0 rgb(147 51 234 / 0.3)',
      },
    },
  },
  plugins: [],
};
```

#### Component Structure
```
src/
├── components/
│   ├── ui/              # Base components (Button, Input, Card)
│   ├── layout/          # Header, Footer, Sidebar
│   ├── rider/           # Rider-specific components
│   ├── driver/          # Driver-specific components
│   └── shared/          # Shared components
├── styles/
│   ├── globals.css      # Global styles
│   └── tokens.css       # CSS custom properties
└── lib/
    └── utils.ts         # Utility functions (cn, etc)
```

### chaufher-web (Admin Portal)

Same Tailwind config as PWA, with additional:
- Data visualization colors for charts
- Extended table styles
- Dashboard-specific components

#### Admin-Specific Colors
```css
/* Chart colors */
--chart-1: var(--color-magenta-500);
--chart-2: var(--color-purple-500);
--chart-3: var(--color-info-500);
--chart-4: var(--color-success-500);
--chart-5: var(--color-warning-500);
```

### chaufher-api (Backend)

No direct UI, but API responses should include status codes that map to design system colors:
- `scheduled` → Purple
- `assigned` → Blue
- `en_route` → Yellow
- `arrived` → Magenta
- `in_progress` → Blue
- `completed` → Green
- `cancelled` → Red

### chaufher-infra

No design components, but documentation should follow brand guidelines:
- Use brand colors in diagrams
- Follow typography in documentation
- Include logo in infrastructure diagrams

---

## File Exports

This spec should be accompanied by:

1. **`tokens.css`** - CSS custom properties
2. **`tailwind.config.js`** - Tailwind configuration
3. **`components/`** - React component library
4. **`assets/`** - Logo files, icons, illustrations

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 4, 2026 | Initial specification |

---

## Questions?

Contact the design team or open an issue in `chaufher-workspace` repository.
