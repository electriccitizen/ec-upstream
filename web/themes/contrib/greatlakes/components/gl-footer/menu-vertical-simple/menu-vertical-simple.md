# Simple Vertical Menu

A minimal vertical menu component for displaying navigation links in a simple list format with border separators. Note this component intentionally does not support submenus.

## Usage

```twig
{{ include('greatlakes:menu-vertical-simple', { items }) }}
```

## Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `items` | array | Yes | Array of menu items with `title`, `url`, and `attributes` properties |

## CSS Custom Properties

- `--menu-vertical-simple-item-padding-block` - Vertical padding for menu items (default: 10px)
- `--menu-vertical-simple-item-padding-inline` - Horizontal padding for menu items (defaults to theme padding)
- `--menu-vertical-simple--border-color` - Border color between menu items (defaults to theme alt border color)
- `--menu-vertical-simple-font-size` - Font size for menu items (defaults to body-l)

## Features

- **Semantic markup**: Uses proper `<ul>` and `<li>` structure
- **Accessible links**: Standard link elements with proper focus states
- **Border separators**: Visual separation between menu items
- **No nesting**: Intentionally does not support nested submenus for simplicity
