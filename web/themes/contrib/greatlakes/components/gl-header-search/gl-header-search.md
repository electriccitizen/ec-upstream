# GL Header Search Component

A search component that functions as a full-screen dialog overlay when triggered. Features search form content and close button functionality.

## Usage

```twig
{{ include('greatlakes:gl-header-search', {
  attributes: attributes,
  content: search_form,
  popover_id: popover_id
}, with_context = false) }}
```

### Slots

| Slot | Description |
|------|-------------|
| `content` | Search form content block |

## Dialog Implementation

The component uses a `<dialog>` element for full-screen overlay:

- **Theme integration**: Uses `theme--primary` class
- **Container system**: Content respects theme's container constraints
- **Close button**: Integrated close functionality with popover coordination

## Accessibility Features

- **Semantic HTML**: Uses `<search>` element for proper structure
- **ARIA states**: Uses `aria-expanded` for trigger state
- **Keyboard navigation**: Full keyboard support with focus management
- **Screen reader support**: Hidden text for trigger and close buttons
- **Modal behavior**: Proper dialog semantics for overlay

## Visual Features

- **Search icon**: SVG icon for trigger button
- **Close icon**: Animated close button
- **Full overlay**: Dialog covers entire viewport
- **Themed background**: Uses primary theme colors

## Integration

- **Search forms**: Compatible with Drupal core search and Search API module
- **Popover coordination**: Integrates with header popover system
- **Theme system**: Uses theme's color and spacing variables
