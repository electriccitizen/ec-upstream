# GL Header Component

A fixed-position site header with responsive navigation and integrated popover overlay. Features container layout and mobile navigation toggle.

## Usage

The component is invoked directly through the theme's `page.html.twig`.

```twig
{{ include('greatlakes:gl-header', {
  header: page.header,
  popover_content_top: page.popover_top,
  popover_content_left: page.popover_left,
  popover_content_right: page.popover_right,
  popover_content_bottom: page.popover_bottom,
}, with_context = false) }}
```

## Sub-Components

The header integrates multiple components:

- `gl-mobile-nav-button` - Mobile navigation toggle
- `header-popover` - Overlay popover for mobile navigation

## Layout Integration

- **Container system**: Uses container class for consistent layout
- **Fixed positioning**: Header stays at top during scroll
- **Mobile responsive**: Includes mobile navigation overlay
- **Popover system**: Modal-style overlay for mobile navigation

## Accessibility Features

- **Focus management**: Proper focus handling for mobile navigation
- **ARIA attributes**: Uses proper controls relationships
- **Keyboard support**: Full keyboard navigation compatibility
- **Progressive enhancement**: Graceful degradation when JavaScript is disabled

## Drupal Integration

The header content comes from Drupal regions defined in the theme's `.info.yml` file.
