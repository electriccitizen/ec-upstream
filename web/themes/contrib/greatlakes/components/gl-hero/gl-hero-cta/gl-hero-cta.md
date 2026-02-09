# GL Hero CTA Component

A call-to-action button component designed specifically for use within the GL Hero component. Features responsive layout, hover effects, and proper focus management.

## Usage

```twig
{{ include('greatlakes:gl-hero-cta', {
  text: 'Get Started',
  href: 'https://example.com'
}, with_context = false) }}
```

### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | string | Yes | CTA button text displayed to users |
| `href` | string | Yes | Link destination URL (supports both absolute and relative URLs) |
