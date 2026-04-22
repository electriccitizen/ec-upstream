# Gallery paragraph — file map

Image gallery with two render modes — **lightbox** (thumbnail list opening a native `<dialog>` modal, vanilla, no jQuery) and **slider** (carousel via slick, jQuery — to be replaced with Embla). Single-SDC pattern for parent/child paragraph pair: the `gallery_item` child bundle has no SDC of its own. Same approach as `accordions/`.

## SDC (this folder)

- `gallery.component.yml` — props (`attr`, optional `title`, required `type` = `lightbox|slider`, required `gallery_id`, required `items` array).
- `gallery.twig` — branches on `type`. BEM modifier `paragraph--gallery--lightbox` / `paragraph--gallery--slider` added to the paragraph-base wrapper via `attr.addClass()`. Delegates to `paragraph-base` with `animate: 'yes'`.
  - **Lightbox markup** uses semantic `<ul>/<li>`; each item has a real `<button>` trigger wrapping the thumbnail + an inert `<template>` sibling holding the full image + caption. A sibling `<dialog>` (one per gallery) is pre-rendered in the markup and hoisted to the top layer by `.showModal()` when opened.
  - **Slider markup** is still `<div>`-based. `<ul>/<li>` migration will happen with the slick → Embla rewrite.
- `gallery.scss` / `.css` — lightbox thumbnail grid + modal chrome live here (ported from the featherlight override styles); slider visuals mirror dart via `@include textConstrain` + `@include edgeToEdge`; scroll-in animation states.
- `gallery.js` — vanilla `<dialog>` handler for the lightbox (~100 LOC; keyboard nav, focus trap free from `<dialog>`, focus return on close, aria-live position announcement); slick init for the slider is still wrapped in the same behavior for now. Auto-registered by the SDC module.

## Drupal template

`templates/paragraphs/gallery/paragraph--gallery.html.twig`

- Derives `gallery_type` from `paragraph.field_gallery_type.value` (boolean: `'1'` = lightbox, `'0'` = slider).
- Only attaches `citizen_sdc/slick` when `type == 'slider'`. Lightbox has **no library dep** beyond the SDC's own co-located `gallery.js`.
- Iterates `content.field_gallery_items`, grabs each child paragraph's `field_image.0.target_id`, renders each media entity twice via `drupal_entity()` — `'large_thumb'` for the thumbnail and `'large'` for the modal / slider main image.
- Builds `items` as `{id, thumb, full, caption}[]` and passes to the SDC.
- Empty guard: if `items` is empty, renders nothing — no empty wrapper.

## Lightbox architecture (vanilla `<dialog>`)

Replaces the old featherlight + jQuery integration. What the browser gives us for free via `<dialog>` + `.showModal()`:

- `role="dialog"` + `aria-modal="true"` set implicitly.
- Focus trap — Tab/Shift-Tab cycle only within the dialog while it's open.
- Hoisting to the top layer — stacking contexts / `overflow: hidden` on ancestors are irrelevant.
- Native ESC-to-close (no JS needed).
- `::backdrop` pseudo-element for the dim overlay.

What the SDC's JS does on top of that:

- On trigger click, clone the matching `<template>` content into the modal's `.paragraph--gallery__modal-stage` (`<figure>`) and call `.showModal()`.
- Prev/next buttons + ArrowLeft/ArrowRight keys cycle through items (wrap at ends).
- Backdrop click (click on the dialog element itself, not inner content) closes.
- On `close` event (any path), returns focus to the trigger that opened the modal.
- Live region inside the dialog announces "Image N of M" on each render.
- Hides prev/next when there's only one image.

## Libraries (citizen_sdc.libraries.yml)

- `citizen_sdc/slick` — slick carousel (jQuery). Pending replacement with Embla in the next pass.
- *(no longer used: `citizen_sdc/featherlight`)* — library removed; `/components-addons/featherlight/` files still on disk and can be deleted once the vanilla lightbox is confirmed in all contexts.

## Global library skin file

`components/00-base/03-global/_galleries.scss` now holds **only slick** styles (the featherlight block moved into the gallery SDC's own SCSS since featherlight's gone and its styling is gallery-specific anyway). When slick is replaced, this file shrinks further or goes away.

## Pending — slick → Embla

- Drop in `components-addons/embla/` (UMD bundles of `embla-carousel` + `embla-carousel-autoplay`).
- Create a new SDC at `components/02-chunks/slider/` that owns the chrome (arrow buttons, dots, ARIA roles/live region) + takes a `slides` slot.
- Gallery slider variant becomes `{{ include('citizen_sdc:slider', { slides: rendered_items, autoplay: true }) }}`.
- Migrate slider markup here from `<div>` → `<ul>/<li>` at the same time.
- Remove `citizen_sdc/slick` library + `components-addons/slick/` + remaining `_galleries.scss` content.

## Pending — accessibility polish (lightbox done, slider pending)

`<ul>/<li>` + aria-labeled `<button>` triggers + focus return on close are already in for the lightbox. Slider `<ul>/<li>` migration is bundled with the Embla rewrite above.
