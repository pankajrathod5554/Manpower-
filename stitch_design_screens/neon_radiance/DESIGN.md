---
name: Neon Radiance
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is engineered for elite event management, evoking a sense of high-end exclusivity and nocturnal energy. The brand personality is sophisticated yet electric, blending professional corporate structure with the vibrant pulse of nightlife and premium technology. 

The aesthetic leans heavily into **Glassmorphism** and **Modern Minimalist** movements. It utilizes deep, ink-like backgrounds to provide maximum contrast for glowing interactive elements. The emotional response should be one of "controlled excitement"—a highly organized, reliable platform that feels like a VIP digital concierge. Expect smooth motion, translucent depth, and a focus on clarity through light.

## Colors
This design system utilizes a high-contrast dark palette to create a "Neon Radiance" effect. 

- **Primary & Secondary:** The core of the identity is a dual-tone vibrant engine. The Vivid Purple (#8B5CF6) provides depth and luxury, while the Electric Cyan (#06B6D4) adds energy and precision.
- **Surface Strategy:** Surfaces are layered using a "Glass" approach. The base is a Deep Navy (#020617), with container levels rising into a semi-translucent Navy (#0F172A).
- **Interactive States:** Use the accent gradient for primary actions. Borders should remain subtle at #334155 but can "glow" with primary or secondary colors during active or hover states to guide user focus.

## Typography
The typography system relies exclusively on **Inter** to maintain a systematic, utilitarian, and clean professional look. 

- **Hierarchy:** Strong weight contrast is used to distinguish between data-heavy event details and editorial headlines. 
- **Character:** Display styles use extra-bold weights and tighter letter spacing to create a high-impact, modern feel.
- **Readability:** Body text maintains a healthy line height (1.5x) to ensure legibility against the dark background, preventing "halations" or eye strain. 
- **Labels:** Caps or semi-bold weights are used for metadata and utility labels to ensure they stand out against translucent backgrounds.

## Layout & Spacing
The design system follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Spacing Rhythm:** A 4px baseline grid ensures mathematical harmony. Use 16px (md) for internal component padding and 24px (lg) for gutter spacing between major sections.
- **Margins:** Large outer margins (48px+) on desktop are encouraged to create a premium, "breathable" feel that prevents the UI from looking cluttered.
- **Reflow:** On tablet/mobile, complex dashboard widgets should stack vertically, while navigation transitions from a top bar to a bottom-docked glass navigation bar.

## Elevation & Depth
This design system rejects traditional heavy shadows in favor of **Tonal Layers and Glassmorphism**.

- **Backdrop Blur:** All cards and modal overlays must use a `backdrop-filter: blur(12px)`. This maintains context of the background while providing a clean surface for content.
- **Inner Glow:** Instead of drop shadows, use a 1px solid border (#334155) or a subtle 1px inner "light leak" stroke on the top and left edges to simulate light hitting the edge of a glass pane.
- **Layering:**
  - **Level 0 (Base):** Deep Navy (#020617).
  - **Level 1 (Cards):** Semi-transparent Navy (#0F172A) at 80% opacity.
  - **Level 2 (Modals/Popovers):** Navy (#1E293B) at 90% opacity with a subtle primary-colored glow.

## Shapes
The shape language is consistently "Rounded" (level 2) to soften the high-tech edge of the neon colors.

- **Standard Radius:** 0.5rem (8px) for small components like inputs and buttons.
- **Large Radius (rounded-lg):** 1rem (16px) for cards, modals, and container elements.
- **Extra Large Radius (rounded-xl):** 1.5rem (24px) for featured sections or hero banners.
- **Consistency:** Never use sharp 0px corners; every element must feel approachable and polished.

## Components
- **Buttons:** Primary buttons use the Purple-to-Cyan gradient with white text. Secondary buttons use a "ghost" style with a 1px border (#334155) and a hover state that reveals a subtle purple glow.
- **Cards:** Defined by a 16px border radius, 80% opacity surface, and a 1px border. On hover, the border color should transition to the primary purple.
- **Inputs:** Dark background (#020617) with a subtle border. On focus, the border should glow Cyan with a 2px outer blur.
- **Chips/Badges:** Use low-opacity versions of the primary/secondary colors (e.g., Purple at 10% opacity) with high-contrast text to indicate status without overpowering the UI.
- **Navigation:** A persistent top-bar with `backdrop-filter: blur(20px)` and a thin bottom border to separate it from the content.
- **Event Status:** Use "Pulse" animations for live events—a small glowing dot using the Secondary (Cyan) color.