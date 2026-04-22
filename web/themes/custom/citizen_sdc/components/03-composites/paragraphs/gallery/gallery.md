# Gallery paragraph — file map

Image gallery with two render modes — **lightbox** (thumbnail grid opening a modal gallery) and **slider** (carousel). Single-SDC pattern for parent/child paragraph pair: the `gallery_item` child bundle has no SDC of its own. Same approach as `accordions/`.

## SDC (this folder)

- `gallery.component.yml` — props (`attr`, optional `title`, required `type` = `lightbox|slider`, required `gallery_id`, required `items` array).
- `gallery.twig` — renders an optional H2 title + a `.paragraph--gallery__wrap` that branches on `type`. BEM modifier `paragraph--gallery--lightbox` / `paragraph--gallery--slider` added to the paragraph-base wrapper via `attr.addClass()`. Delegates to `paragraph-base` with `animate: 'yes'`.
- `gallery.scss` / `.css` — `widgetTitle` on the H2; lightbox grid (flex + gap) with thumbnails styled via `imageHover`; slider edge-to-edge on mobile, constrained on tablet+.
- `gallery.js` — jQuery behaviors that init featherlightGallery on lightbox galleries and slick on sliders. Auto-registered as a library by Drupal core's SDC module (co-located JS).

## Drupal template

`templates/paragraphs/gallery/paragraph--gallery.html.twig`

- Derives `gallery_type` from `paragraph.field_gallery_type.value` (boolean: `'1'` = lightbox, `'0'` = slider).
- Conditionally `attach_library()` calls pull in either `citizen_sdc/featherlight` or `citizen_sdc/slick` — **not both** — so we don't ship the unused library per gallery.
- Iterates `content.field_gallery_items`, grabs each child paragraph's `field_image.0.target_id`, renders each media entity twice via `drupal_entity()` — `'large_thumb'` for the thumbnail grid and `'large'` for the lightbox full-size / slider main image.
- Builds `items` as `{id, thumb, full, caption}[]` and passes to the SDC.
- If `items` is empty (all children missing an image), renders nothing — no empty wrapper.

## Bundle config

- `paragraphs.paragraphs_type.gallery` — parent bundle.
- `paragraphs.paragraphs_type.gallery_item` — child bundle (no SDC; Drupal template pulls its fields directly).
- `field.field.paragraph.gallery.field_widget_title` — optional string (H2).
- `field.field.paragraph.gallery.field_gallery_type` — boolean (on=Lightbox, off=Slider).
- `field.field.paragraph.gallery.field_gallery_items` — entity_reference_revisions → `gallery_item`, unlimited.
- `field.field.paragraph.gallery_item.field_image` — entity_reference → media (image bundle).
- `field.field.paragraph.gallery_item.field_caption` — optional string_long.

## Libraries (citizen_sdc.libraries.yml)

- `citizen_sdc/slick` — slick carousel (jQuery). Phase B: evaluate vanilla replacement (e.g. Splide, Embla, or a hand-rolled carousel).
- `citizen_sdc/featherlight` — featherlight modal/gallery (jQuery). Phase B: evaluate vanilla replacement (native `<dialog>` with a small keyboard-navigation shim, or PhotoSwipe vanilla build).

## 3rd-party library visual skins

`components/00-base/03-global/_galleries.scss` (compiled into `style.css` via `style.scss`) holds the skin rules for featherlight and slick — they can't live in the gallery SDC's own SCSS because the DOM they target is inserted outside the SDC wrapper: featherlight appends modals at `<body>` level, slick wraps content in its own `.slick-*` class tree. File is ported from dart's `04-assembly/global/_galleries.scss`, with:

- `safeFlex(column,nowrap,center,center)` replaced by inline `display:flex; flex-direction:column; justify-content:center; align-items:center;`
- dart's `translate()` / `transition()` shorthand mixins replaced by the raw CSS props.
- caption selector flipped from dart's `.field-caption` to the SDC's `.paragraph--gallery__caption`.
- exports an `outsideSliderArrows($space, $color, $hover)` mixin for per-project slider-arrow layouts.

## Pending — Phase B (library evaluation)

Goal: drop jQuery from the gallery path entirely. Both libraries are small but bring jQuery in tow, and a vanilla implementation is within reach for both modes.

- Slider: the feature surface we use is small — auto-advance, prev/next arrows, adaptive height. A hand-rolled carousel using `scroll-snap` + intersection observers, or a small vanilla lib like Embla, would cover it.
- Lightbox: native `<dialog>` + arrow-key nav + focus trap is ~100 lines of vanilla JS. PhotoSwipe (vanilla) is the heavier-weight fallback.

## Pending — Phase C (accessibility)

Client accessibility review on a prior project with the same gallery suggested using `<ul>` / `<li>` for the items container + each item. Phase C:

- Swap `.paragraph--gallery__wrap` `<div>` → `<ul>`, items → `<li>`.
- Confirm this still composes with featherlight's `.featherlight-gal` hook selectors and with slick's DOM expectations (slick wraps children in `.slick-slide` divs — should be fine with `<li>` direct children of `<ul>`).
- Add `aria-label="Gallery"` (or pick up `title` if present) on the wrapper.
- For lightbox: consider adding a visually-hidden heading per thumbnail ("Open image 3 of 8") so SR users know what activating the link does; confirm focus returns to the triggering thumbnail on close.
- For slider: confirm slick's built-in aria is on; supply our own if not.
