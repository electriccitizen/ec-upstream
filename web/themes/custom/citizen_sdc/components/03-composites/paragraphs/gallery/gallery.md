# Gallery paragraph — file map

Image gallery with two render modes — **lightbox** (thumbnail list opening a native `<dialog>` modal) and **slider** (Embla carousel via the shared `citizen_sdc:slider` SDC). Both modes are **vanilla, no jQuery**. Single-SDC pattern for the `gallery` / `gallery_item` parent/child paragraph pair; gallery_item has no SDC of its own.

## SDC (this folder)

- `gallery.component.yml` — props (`attr`, optional `title`, required `type` = `lightbox|slider`, required `gallery_id`, required `items` array of `{id, thumb, full, caption}`).
- `gallery.twig` — branches on `type`. BEM modifier `paragraph--gallery--lightbox` / `paragraph--gallery--slider` added to the paragraph-base wrapper via `attr.addClass()`. Delegates to `paragraph-base` with `animate: 'yes'`.
  - **Lightbox**: semantic `<ul>/<li>`; each item wraps a `<button>` trigger around the thumb + an inert `<template>` sibling holding the full image + caption. A sibling `<dialog>` is pre-rendered per gallery.
  - **Slider**: composes each slide's content (image + optional caption) as a rendered string, then delegates to `citizen_sdc:slider` with the resulting array.
- `gallery.scss` / `.css` — lightbox thumb grid + dialog modal chrome (ported from the old featherlight overrides); slider mode owns only its **slide-content** styling (edge-to-edge mobile → constrained desktop, caption below image in italic grey). Slider chrome (viewport, arrows, live region) comes from `slider.scss`. Scroll-in animations for both variants.
- `gallery.js` — vanilla lightbox handler (~100 LOC). Slider init lives in `slider.js` (shared SDC).

## Drupal template

`templates/paragraphs/gallery/paragraph--gallery.html.twig`

- Derives `gallery_type` from `paragraph.field_gallery_type.value` (boolean: `'1'` = lightbox, `'0'` = slider).
- Iterates `content.field_gallery_items`, pulls `field_image.0.target_id`, renders each media twice via `drupal_entity()` — `large_thumb` + `large`.
- Builds `items` as `{id, thumb, full, caption}[]` and passes to the SDC.
- No more `attach_library()` needed — both modes are vanilla; slider's Embla dep is attached automatically by `citizen_sdc:slider` via its `libraryOverrides.dependencies`.
- Empty guard: if `items` is empty, renders nothing.

## Lightbox architecture (vanilla `<dialog>`)

What the browser gives us via `<dialog>` + `.showModal()`:
- `role="dialog"` + `aria-modal="true"` implicit
- Focus trap (Tab/Shift-Tab cycle within the dialog)
- Hoisting to the top layer — stacking contexts / `overflow: hidden` on ancestors are irrelevant
- Native ESC-to-close
- `::backdrop` pseudo-element for the dim overlay

What `gallery.js` adds:
- On trigger click, clone matching `<template>` content into `.paragraph--gallery__modal-stage` (a `<figure>`) and call `.showModal()`
- Prev/next buttons + ArrowLeft/ArrowRight keys cycle with wrap
- Backdrop-click closes (click on the dialog element itself, not inner content)
- On `close` event (any path), returns focus to the opening trigger
- `aria-live` region announces "Image N of M" on each render
- Hides prev/next when only one image

## Slider architecture (Embla via `citizen_sdc:slider`)

Gallery composes each slide as a `<div class="paragraph--gallery__slide">` with the full image + optional `<figcaption class="paragraph--gallery__caption">`, then hands an array of these off to `citizen_sdc:slider` which produces the carousel chrome. Embla autoplay (5s) + loop + 1 slide per view are the defaults gallery uses.

See `components/02-chunks/slider/slider.md` for slider internals + the responsive per-view CSS-custom-property pattern.

## Libraries (citizen_sdc.libraries.yml)

- `citizen_sdc/embla` — Embla carousel core + autoplay plugin (vanilla). Attached indirectly via the slider SDC.
- *(removed)* `citizen_sdc/slick` + `components-addons/slick/`
- *(removed)* `citizen_sdc/featherlight` + `components-addons/featherlight/`

No more jQuery dep on the gallery path.

## Accessibility

**Lightbox** — `<ul>/<li>` semantic list, `<button>` triggers with `aria-haspopup="dialog"` + positional+captioned `aria-label`, native `<dialog>` provides modal semantics + focus trap + ESC, focus return on close, aria-live position announcement.

**Slider** — the chrome SDC provides `role="region"` + `aria-roledescription="carousel"` on the wrapper, `role="group"` + `aria-roledescription="slide"` + positional `aria-label` per slide, prev/next real `<button>`s, aria-live slide-change announcement. Gallery passes `label: ''` to avoid announcing a redundant region name (the gallery has its own H2).

## Global library skin file — removed

`components/00-base/03-global/_galleries.scss` no longer exists. The featherlight block moved to gallery.scss (slick rewrite); the slick block was then deleted entirely. No 3rd-party library chrome overrides remain — Embla needs zero global CSS, just the per-consumer chrome in `slider.scss`.
