# Header Popover Component

A full-screen modal dialog for mobile navigation and content display. Features four content areas with slots and integrated close functionality.

## Usage

```twig
{{ include('greatlakes:header-popover', {
  popover_id: popover_id,
  popover_content_top: content_top,
  popover_content_left: content_left,
  popover_content_right: content_right,
  popover_content_bottom: content_bottom,
}, with_context = false) }}
```

### Slots

| Slot | Description |
|------|-------------|
| `content_top` | Top section with logo and close button |
| `content_left` | Left main content area |
| `content_right` | Right main content area |
| `content_bottom` | Bottom content area |

## Layout Structure

The popover has a structured layout:

### Top Section
- **Logo display**: Shows theme logo
- **Close button**: Integrated close functionality
- **Content area**: Additional top content via props/slots

### Main Section
- **Two-column layout**: Left and right content areas
- **Flexible content**: Supports menus, text, or other content
- **Container constraints**: Respects theme's container system

### Bottom Section
- **Full-width area**: Spans entire popover width
- **Footer content**: Additional links or information

## Dialog Implementation

- **Semantic HTML**: Uses `<dialog>` element for proper modal behavior
- **Theme integration**: Uses `theme--primary` class
- **Container system**: Content respects theme's container constraints
- **Unique IDs**: Generated unique IDs prevent conflicts

## Accessibility Features

- **Modal semantics**: Proper dialog role and behavior
- **Focus management**: Traps focus within popover when open
- **Keyboard support**: Escape key and close button support
- **Screen reader support**: Hidden text for close button
- **ARIA controls**: Proper relationship with trigger elements

## Visual Features

- **Full-screen overlay**: Covers entire viewport
- **Primary theme**: Uses theme's primary color scheme
- **Close icon**: Visual close button with hover states
- **Responsive layout**: Adapts to different screen sizes

## Integration

- **Header system**: Designed to work with gl-header component
- **Mobile navigation**: Primary use for mobile menu overlay
- **Content flexibility**: Can display any Drupal region content
