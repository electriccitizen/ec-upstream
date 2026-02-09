# Popover Menu Component

A navigation menu component designed for use within popover overlays. Features multi-level menus with expandable submenus and proper accessibility support.

## Usage

```twig
{{ include('greatlakes:popover-menu', {
  items: menu_items
}, with_context = false) }}
```

### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `items` | array | Yes | Menu tree structure from Drupal |
