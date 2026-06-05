---
name: Premium Event Corporate
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#5a4136'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#555f6f'
  on-tertiary: '#ffffff'
  tertiary-container: '#909aab'
  on-tertiary-container: '#283240'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d9e3f6'
  tertiary-fixed-dim: '#bdc7d9'
  on-tertiary-fixed: '#121c2a'
  on-tertiary-fixed-variant: '#3d4756'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a premium corporate environment, specifically tailored for high-stakes event manpower management. The brand personality is energetic yet authoritative, blending the urgency of event logistics with the reliability of enterprise software. It targets event organizers and corporate stakeholders who require a tool that feels efficient, modern, and high-end.

The design style is **Corporate / Modern** with a focus on high-impact visual clarity. It utilizes heavy whitespace to reduce cognitive load during complex scheduling tasks, complemented by vibrant primary accents that guide the user's eye toward critical actions. The aesthetic is clean and structured, using subtle depth to distinguish between management layers without cluttering the interface.

## Colors

The palette is anchored by a high-energy "Action Orange" (Primary), which serves as the signature for all interactive and branding elements. This is balanced by a vast "Cloud White" (Secondary) and "Slate Tint" (Neutral) background to maintain a professional, airy feel.

- **Primary (#FF6B00):** Reserved for primary calls to action, brand identifiers, and active selection states.
- **Secondary (#FFFFFF):** Used for surface areas, card backgrounds, and navigation bars to ensure a "clean" corporate look.
- **Dark Text (#1F2937):** A deep charcoal for high-contrast legibility, used for all headings and body copy.
- **Light Background (#F8FAFC):** An off-white neutral used for the canvas to differentiate from card surfaces.
- **Accent/Hover (#E65C00):** A slightly deeper orange used exclusively for interactive feedback states (hover/active).

## Typography

This design system uses a dual-font strategy to balance character with utility. 

**Poppins** is used for all headlines and branding elements. Its geometric construction provides a modern, friendly, yet professional tone that stands out in large sizes. 

**Inter** is the workhorse for body text, forms, and data-heavy tables. It is chosen for its exceptional legibility at small sizes and its neutral, systematic feel which prevents the UI from feeling "over-designed" in high-density management views.

For mobile, scale down `headline-xl` to 32px and `headline-lg` to 24px to ensure headers do not wrap awkwardly on small viewports.

## Layout & Spacing

This design system follows a **12-column Fluid Grid** for desktop and a **4-column Fluid Grid** for mobile. The layout emphasizes vertical flow and logical grouping of manpower data.

- **Desktop (1024px+):** 12 columns with 24px gutters. Content is centered in a max-width container of 1280px. 
- **Tablet (768px - 1023px):** 8 columns with 20px gutters and 24px side margins.
- **Mobile (Up to 767px):** Single column layout with 16px side margins. Navigation transitions to a bottom bar or a clean full-screen overlay.

Spacing follows an 8px base unit. Always use `stack-md` (16px) for internal card padding and `stack-lg` (32px) for section vertical spacing.

## Elevation & Depth

To achieve a "Premium Corporate" feel, this design system avoids heavy shadows in favor of **Ambient Shadows** and **Tonal Layers**. 

Depth is communicated through:
1.  **Level 0 (Background):** `#F8FAFC` (Canvas).
2.  **Level 1 (Cards/Surfaces):** `#FFFFFF` with a subtle 4px blur, 2% opacity black shadow. This makes the manpower modules appear to float slightly above the canvas.
3.  **Level 2 (Hover/Overlays):** When a user hovers over a service card, the shadow should deepen to a 12px blur, 6% opacity black shadow, and the element should lift 2px via transform.

Borders should be used sparingly, primarily in a low-contrast Slate-200 for input fields to maintain a clean, high-end appearance.

## Shapes

The design system utilizes a distinct **rounded-2xl** aesthetic for its primary components. This choice softens the "corporate" edge, making the platform feel approachable and modern.

- **Standard Elements (Inputs, Small Buttons):** Use `rounded-lg` (0.5rem / 8px).
- **Primary Containers (Service Cards, Modal Windows):** Use `rounded-2xl` (1rem / 16px).
- **Interactive Tags/Chips:** Use pill-shaped (full rounding) to contrast against the structured grid.

## Components

### Buttons
- **Primary:** Background `#FF6B00`, Text `#FFFFFF`. Bold weight, `rounded-lg`. On hover, shift background to `#E65C00`.
- **Secondary:** Transparent background, Border 1px `#FF6B00`, Text `#FF6B00`. Use for less critical actions.

### Form Inputs
- Background should be `#FFFFFF`. Border 1px `#E2E8F0`. 
- **Focus State:** Border color shifts to `#FF6B00` with a subtle 2px orange glow (ring).
- Labels must be `label-md` and placed above the input field.

### Service Cards
- Background `#FFFFFF`, `rounded-2xl`, subtle Level 1 shadow. 
- Padding: 24px.
- **Hover effect:** Lift 2px and transition to Level 2 shadow. Icons within cards should use the Primary Orange color.

### Navigation
- **Mobile:** A bottom tab bar for "Dashboard," "Events," "Staff," and "Profile" to ensure one-handed operation.
- **Desktop:** A sticky top navigation bar with a glassmorphism effect (Backdrop blur 10px, 80% opacity `#FFFFFF`).

### Chips/Badges
- Small status indicators (e.g., "Active," "Pending"). Use light tinted backgrounds of the status color with high-contrast text (e.g., Light Green bg with Dark Green text).