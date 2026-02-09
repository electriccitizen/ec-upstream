# GL Hero Component

A full-width hero component with background image, overlaid content, and flexible alignment options. Designed for prominent placement with support for multiple CTAs and customizable theming.

## Usage

```twig
{% embed 'greatlakes:gl-hero' with {
  title: 'This is my title. Watch it convert.',
  image: {
    src: 'images/gl-hero-bg.webp',
    alt: 'Boring placeholder',
    width: 1230,
    height: 760
  },
  theme: 'dark',
  align_x: 'center',
  align_y: 'center',
  text_color: 'white'
} only %}
  {% block hero_below %}
    <p>Your hero content goes here</p>
  {% endblock %}
  {% block hero_ctas %}
    {{ include('greatlakes:gl-hero-cta', {
      href: 'http://www.drupal.org',
      text: 'Drupal',
    }, with_context = false) }}

    {{ include('greatlakes:gl-hero-cta', {
      href: 'https://wordpress.com/',
      text: 'WordPress',
    }, with_context = false) }}
  {% endblock %}
{% endembed %}
```

### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Hero title displayed as h1 |
| `image` | object | Yes | Background image object with src, alt, width, height |
| `theme` | string | No | Theme variant: inherit, white, light, dark, black, primary (default: inherit) |
| `align_x` | string | No | Horizontal alignment: start, center, end (default: start) |
| `align_y` | string | No | Vertical alignment: top, center, bottom (default: center) |
| `text_color` | string | No | Text color override: inherit, black, white, primary (default: inherit) |

### Slots

| Slot | Description |
|------|-------------|
| `hero_below` | Content area for body text and additional content below title |
| `hero_ctas` | Side area for call-to-action buttons and links |

## CSS Custom Properties

- `--gl-hero-height` - Hero component height (default: `clamp(700px, 80vh, 1000px)`)
- `--gl-hero-text-color` - Primary text color for hero content
- `--gl-hero-border-color` - Border color for hero elements (inherits from text color)
- `--gl-hero-cta-item-alignment` - Alignment of CTA items (default: `center`)
- `--gl-hero-cta-padding-block-value` - Vertical padding for CTA items (default: `44px`)
- `--gl-hero-cta-padding-block` - Applied vertical padding for CTA items
- `--gl-hero-cta-padding-inline-value` - Horizontal padding for CTA items (default: `20px`)
- `--gl-hero-cta-padding-inline` - Applied horizontal padding for CTA items
- `--gl-hero-horizontal-border-image-to-both` - Border image extending to both sides
- `--gl-hero-horizontal-border-image-to-right` - Border image extending to the right
- `--gl-hero-horizontal-border-image-to-left` - Border image extending to the left

## Layout Integration

- **Full-width**: Breaks out of container to span viewport width
- **Fixed hero region**: Meant for use in the `fixed_hero` region but can be used within page builders
- **CTA placement**: Supports unlimited CTAs which stack to the right (optimal amount is two)
- **Container system**: Content respects theme's container constraints

## Image Specifications

- **Optimal aspect ratio**: 2460 x 1520 pixels
- **High priority loading**: Uses `fetchpriority="high"` for above-the-fold optimization
- **Eager loading**: Background image loads immediately

## Accessibility Features

- **Semantic markup**: Uses proper h1 for hero title
- **Image optimization**: High priority loading with proper alt text
- **Contrast requirements**: Text must meet accessibility standards across all themes
