# Image paragraph — file map

Single image with optional text (headline + additional text) placed **overlay**, **above**, or **below**. Full rewrite from dart: dart's multi-size / linked / captioned model is gone (50/50 handles multi-column composition; galleries handle image groups). Image always grows to a 1280px max.

## SDC (this folder)

- `image.component.yml` — props `attr`, `headline` (optional string), `additional_text` (optional string), `text_position` (optional enum `overlay|above|below|''|null`). One slot: `image` (rendered media).
- `image.twig` — composes the text block via an internal macro so above/below/overlay stay symmetric. Resolves `text_position` (falls back to `'below'` when text is present but position is blank). BEM modifier `paragraph--image--{position}` (or `--no-text`) added via `attr.addClass()`. Delegates to paragraph-base with `animate: 'yes'` **only when position is overlay**; other modes are static.
- `image.scss` / `.css` — 1280px max image, overlay gradient + slide-in animation (tablet+), mobile overlay fallback to `--below` layout.
- No JS — uses the shared `citizen_sdc/paragraph-animate` observer. Overlay mode adds `data-animate="yes"` on the wrapper; the observer applies `.is-in-view` which triggers the CSS slide-in.

## Drupal template

`templates/paragraphs/image/paragraph--image.html.twig` — renders `content.field_image` into a `{% set %}` block as the `image` slot; hands `field_headline`, `field_additional_text`, `field_text_position` values to the SDC.

## Bundle config

**Fields kept**: `field_image` (media entity_reference).

**Fields removed** (from 2026-04-22 rewrite): `field_widget_title`, `field_caption`, `field_link`, `field_size` — and the unique `field_size` storage.

**Fields added**:
- `field_headline` (string, optional) — existing shared storage (also on CTA).
- `field_additional_text` (string_long, optional) — existing shared storage.
- `field_text_position` (list_string, optional, enum `overlay | above | below`) — new dedicated storage.

Form display order: headline, image, additional_text, text_position. Default view display: only `field_image` is visible (via entity_reference_entity_view → view-mode `full`); the other three are hidden (SDC reads them via `paragraph.field_*.value`).

## Text-position logic

| Position value  | Text present?     | Rendered as                                               |
| --------------- | ----------------- | --------------------------------------------------------- |
| `null` / `''`   | no                | image only                                                |
| `null` / `''`   | yes               | text BELOW (default fallback)                             |
| `overlay`       | yes               | tablet+: overlay with gradient; mobile: BELOW fallback    |
| `above`         | yes               | text above image, centered                                |
| `below`         | yes               | text below image, centered                                |

"Has text" = headline OR additional_text populated.

## Overlay details

- Text panel is absolutely positioned on tablet+: `display: flex; align-items: center` → vertically centered. Text left-aligned; max 60% width.
- Dark left-weighted gradient: `linear-gradient(to right, rgba(0,0,0,.75) 0%, rgba(0,0,0,.5) 35%, rgba(0,0,0,0) 70%)` behind the text panel for contrast (WCAG 2.2 AA).
- Whole overlay (gradient + text together) slides in from `translateX(-100%)` to `0` over 0.8s cubic-bezier, opacity 0.6s ease-out. Triggered by `.is-in-view` added to the paragraph wrapper by the shared paragraph-animate observer.
- `overflow: hidden` on `.paragraph--image__media` so the panel doesn't show outside the image bounds during the slide-in.
- Mobile (below tab breakpoint): overlay collapses to the `--below` layout — static position below image, centered, no gradient. Same result as picking `below` mode explicitly. No animation.
- `prefers-reduced-motion`: short-circuits the slide-in to final state immediately.
