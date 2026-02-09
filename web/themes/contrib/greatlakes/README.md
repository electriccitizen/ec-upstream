# Greatlakes Theme

Thanks for choosing **Greatlakes** . This theme reflects hundreds of hours of development and is designed to look beautiful out of the box while providing extensibility through best practices, WCAG 2.2 AA accessibility compliance, minimal technical debt, high performance, and flexible component-driven architecture.

## Table of Contents

- [Greatlakes Theme](#greatlakes-theme)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Quick Start](#quick-start)
    - [Theme Configuration](#theme-configuration)
  - [How to use this theme](#how-to-use-this-theme)
  - [Theme Architecture](#theme-architecture)
    - [Base Theme (dripyard\_base)](#base-theme-dripyard_base)
    - [Greatlakes Theme](#greatlakes-theme-1)
    - [Subtheme (Recommended)](#subtheme-recommended)
  - [Layout Builder Integration](#layout-builder-integration)
    - [Layout Sections](#layout-sections)
  - [Version Support](#version-support)
    - [Drupal 11.2+](#drupal-112)
  - [Component Architecture](#component-architecture)
  - [Accessibility](#accessibility)
  - [Color System](#color-system)
  - [CSS Architecture](#css-architecture)
  - [Layout \& Container System](#layout--container-system)
  - [Fixed Header \& Navigation System](#fixed-header--navigation-system)
    - [Fixed Header (`gl-header`)](#fixed-header-gl-header)
    - [Popover Navigation System](#popover-navigation-system)
    - [Header Popover Regions](#header-popover-regions)
    - [Key Benefits](#key-benefits)
  - [Theme Regions](#theme-regions)
    - [Fixed Header Region](#fixed-header-region)
    - [Header Popover Regions](#header-popover-regions-1)
    - [Content Regions](#content-regions)
    - [Fixed Regions](#fixed-regions)
    - [Footer Regions](#footer-regions)
  - [Preprocess System](#preprocess-system)
  - [Components](#components)
    - [Header \& Navigation Components](#header--navigation-components)
    - [Content \& Layout Components](#content--layout-components)
    - [Utility Components](#utility-components)
    - [Inherited Components](#inherited-components)
  - [Recommended Modules](#recommended-modules)

---

## Key Features

- Out-of-the-box modern design with fixed header navigation system
- Fully translatable including RTL language support
- Component-driven architecture using Single Directory Components (SDC)
- WCAG 2.2 AA accessibility compliance including forced colors mode, focus management, and reduced motion support
- Dynamic color and component-based theming system
- Fixed header with integrated mobile popover navigation
- No front-end build tools required
- No module dependencies
- Core-only APIs with no opinionated content model
- Performance-optimized asset loading
- Basic usage if JavaScript is unavailable

---

## Quick Start

Install Greatlakes at **Appearance > Add Theme** with no license keys or remote callbacks required.

**Important**: Greatlakes includes a pre-configured subtheme for customizations. Always use the included subtheme rather than modifying Greatlakes directly. This ensures you can safely update the main theme without losing your customizations.

### Theme Configuration

Configure your brand through your theme's settings page:

- **Theme Colors**: Set primary color and color scheme (see [Color System](#color-system))
- **Logo & Branding**: Upload logo and favicon
- **Footer Settings**: Select footer color theme (Primary, White, Light, Dark, Black)
- **Social Media**: Add links to your social media profiles
- **Recipe Installation**: Apply optional DripYard recipes for content types and demo content

---

## How to use this theme

This theme is meant to get you 90-99% of the way there. It has best practices and opinionated logical defaults baked in, but does not dictate your content architecture. This means that you will need to map data to your components. This is most frequently done within the component's template file, but can also be done within PHP, or a contributed module such as [SDC Display](https://www.drupal.org/project/sdc_display) or (coming soon) [Drupal Canvas](https://drupal.org/project/canvas).

---

## Theme Architecture

Greatlakes follows a sophisticated multi-layer architecture designed for maintainability and upgrades:

### Base Theme (dripyard_base)
- **Foundation Layer**: Provides core functionality, base styles, and shared utilities
- **Component Library**: Houses the complete Single Directory Components library shared across all DripYard themes
- **Framework**: Contains preprocessing system, theme settings infrastructure, and accessibility features
- **Bundled**: Included with Greatlakes installation, no separate download required

### Greatlakes Theme
- **Style Layer**: Applies Greatlakes-specific design tokens, colors, and visual treatments
- **Configuration**: Extends base theme settings with Greatlakes-specific options
- **Component Overrides**: Customizes base components for the Greatlakes aesthetic
- **Fixed Header System**: Unique navigation architecture with popover overlay

### Subtheme (Recommended)
- **Customization Layer**: For all site-specific modifications and extensions
- **Future-Proof**: Protects customizations during theme updates
- **Override Capability**: Can override any component, style, or functionality from parent themes
- **Best Practice**: Always make changes in a subtheme rather than modifying Greatlakes directly

This architecture ensures clean separation of concerns while maintaining upgrade compatibility.

---

## Layout Builder Integration

Landing page recipe utilizes Layout Builder for content construction. Compatible with other page builders (Paragraphs, UI Suite), but Layout Builder is chosen for core inclusion.

### Layout Sections

Greatlakes includes a **Dynamic Layout** component that enables flexible grid layouts with 1-4 columns and 1-4 rows. This component supports:

- **Flexible Grid System**: Create 1, 2, 3, or 4 column layouts with configurable rows
- **Content Width Control**: Choose from `edge-to-edge`, `max-width`, or `narrow` content widths
- **Column Proportions**: Customize 2-column (50/50, 25/75, 33/67, 75/25, 67/33) and 3-column ratios (33/33/33, 50/25/25, 25/50/25, 25/25/50)
- **Advanced Spacing**: Control margins, padding, and gutters with options for zero, small, medium, large, or default spacing
- **Alignment Options**: Set horizontal (start, center, end) and vertical (top, center, bottom) content alignment
- **Theme Integration**: All five theme variants (white, light, primary, dark, black) supported

The layout uses CSS Grid for responsive behavior and provides up to 16 content slots (cells) based on your column × row configuration.

Additionally, six layout sections are defined in `greatlakes.layouts.yml`:

- **One column** - Single column with `content_above` region for `title-cta` component
- **Two column** - Dual column with `content_above` region for `title-cta` component
- **Three column** - Triple column with `content_above` region for `title-cta` component
- **Four column** - Quad column with `content_above` region for `title-cta` component
- **Tab group** - Container for `tab` components
- **Accordion group** - Container for `accordion_item` components

---

## Version Support

### Drupal 11.2+
No dependencies required.

---

## Component Architecture

*Greatlakes inherits the component architecture from dripyard_base. For complete component architecture documentation, see [dripyard_base component architecture](../dripyard_base/README.md#component-architecture).*

---


## Accessibility

Greatlakes is fully WCAG 2.2 AA compliant. Most components' documentation includes an **Accessibility** section. However, site authors should still test their site and apply best practices to maintain accessibility.

---

## Color System

*Greatlakes inherits the complete 4-layer color system from dripyard_base. For detailed color system documentation, see [dripyard_base color system](../dripyard_base/README.md#color-system).*

---

## CSS Architecture

*Greatlakes inherits the CSS architecture from dripyard_base. For complete CSS architecture documentation, see [dripyard_base CSS architecture](../dripyard_base/README.md#css-architecture).*

---

## Layout & Container System

*Greatlakes inherits the layout and container system from dripyard_base. For complete documentation of utility classes, layout system, and container architecture, see [dripyard_base layout system](../dripyard_base/README.md#layout--container-system).*

---

## Fixed Header & Navigation System

Greatlakes features a unique **fixed header and navigation system** that provides a modern, app-like experience:

### Fixed Header (`gl-header`)
- **Fixed Positioning**: Header remains at the top during scroll for constant access to navigation
- **Container Layout**: Uses consistent container system for content alignment
- **Mobile Responsive**: Seamlessly transitions between desktop and mobile layouts
- **Integrated Toggle**: Mobile navigation button integrated directly into header

### Popover Navigation System
- **Full-Screen Modal**: Mobile navigation displays as a full-screen overlay using native `<dialog>` element
- **Four Content Areas**: Structured layout with top, left, right, and bottom content regions
- **Flexible Content**: Supports menus, text, widgets, or any Drupal region content
- **Accessibility First**: Proper focus management, keyboard support, and screen reader compatibility

### Header Popover Regions
Greatlakes provides specialized popover regions for the mobile navigation overlay:
- **`header_popover_top`**: Logo and close button area
- **`header_popover_left`**: Main navigation area
- **`header_popover_right`**: Secondary content or additional navigation
- **`header_popover_bottom`**: Footer-style content within the popover

### Key Benefits
- **Always Accessible**: Fixed header ensures navigation is always available
- **Mobile Optimized**: Popover system provides excellent mobile UX
- **Performance**: Minimal JavaScript footprint with progressive enhancement
- **Customizable**: All popover areas can contain any Drupal content

---

## Theme Regions

Greatlakes defines strategic regions for flexible content placement throughout your site. Each region is optimized for specific content types and use cases.

**Verified regions from greatlakes.info.yml:**

### Fixed Header Region

- **`fixed_hero`** - Fixed hero
  - Content that appears above the fixed header
  - Useful for announcements or special promotions
  - Scrolls with page content

- **`header`** - Header
  - Main fixed header region containing all header content
  - Processes all content through the `gl-header` component
  - Includes navigation, branding, and mobile toggle functionality

### Header Popover Regions

Specialized regions for mobile navigation overlay:

- **`header_popover_top`** - Header popover content (top)
  - Top section of mobile navigation popover
  - Typically contains logo and close button
  - Spans full width of popover

- **`header_popover_left`** - Header popover content (left)
  - Left main content area in popover
  - Primary location for mobile navigation menu
  - Part of two-column layout in main section

- **`header_popover_right`** - Header popover content (right)
  - Right main content area in popover
  - Secondary navigation or additional content
  - Part of two-column layout in main section

- **`header_popover_bottom`** - Header popover content (bottom)
  - Bottom section of mobile navigation popover
  - Footer-style content within the overlay
  - Spans full width of popover

### Content Regions

- **`highlighted`** - Highlighted
  - Above main content area
  - Site-wide announcements or alerts
  - Featured promotions or important notices
  - This region features styling that creates a light background from to the top of the viewport.

- **`content`** - Content
  - Primary content area
  - Main page content, articles, landing pages
  - Layout Builder content when using landing pages

### Fixed Regions

- **`fixed_bottom_right`** - Fixed bottom right (messages)
  - System status messages (success, error, warning notifications)
  - Fixed positioning for consistent visibility

### Footer Regions

- **`footer_top`** - Footer top
  - Primary footer content area
  - Main footer navigation, site information
  - Can accommodate multiple columns of content

- **`footer_left`** - Footer left
  - Left column of footer content
  - Company information, contact details
  - Secondary navigation menus

- **`footer_right`** - Footer right
  - Right column of footer content
  - Social media links, newsletter signup
  - Additional contact information or links

- **`footer_bottom`** - Footer bottom
  - Copyright notices, legal information
  - Final footer content, typically minimal
  - Terms of service, privacy policy links

---

## Preprocess System

*Greatlakes inherits the preprocessing system from dripyard_base. For complete preprocessing system documentation, see [dripyard_base preprocessing system](../dripyard_base/README.md#preprocessing-system).*

---

## Components

Greatlakes includes **12 theme-specific components** that extend the base theme:

### Header & Navigation Components
- **gl-header** - Fixed header component with integrated navigation and branding
- **gl-mobile-nav-button** - Mobile navigation toggle with accessibility features
- **header-popover** - Full-screen mobile navigation overlay using native dialog element
- **popover-menu** - Flexible menu component for popover navigation areas
- **menu-vertical-simple** - Simple vertical menu for navigation areas
- **gl-language-switcher** - Language selection interface with Greatlakes styling
- **gl-header-search** - Integrated header search with mobile-optimized behavior

### Content & Layout Components
- **gl-hero** - Landing page hero component
- **gl-hero-cta** - Hero with call-to-action elements
- **gl-footer** - Custom footer with Greatlakes styling and theme integration

### Utility Components
- **html-header** - Document head, metadata, and page initialization
- **icon** - Flexible icon display component with UI Icons integration

### Inherited Components
Greatlakes inherits **50+ additional components** from dripyard_base, including layout components, UI elements, content components, media components, form elements, and Drupal integration components.

For complete component documentation, see:
- Greatlakes components: `components/` directory
- Base components: See [dripyard_base documentation](../dripyard_base/README.md#component-library)

---

## Recommended Modules

* [UI Icons](https://www.drupal.org/project/ui_icons): Icon picker support
* Core Navigation Module: Replaces tabs with a flexible top bar
