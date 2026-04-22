# Portals paragraph — file map

Grid of clickable portal cards (image + H3 headline, with optional long-text description beneath). **Single-SDC pattern** for the parent/child paragraph pair — `portal` child bundle has no SDC of its own; the Drupal template iterates `field_portals` and passes a structured `items` array to this SDC. Same approach as accordions and gallery.

## SDC (this folder)

- `portals.component.yml` — props `attr`, optional `title`, required `items` (array of `{id, link: {url, title, target?, rel?}, image, headline, long_text?}`).
- `portals.twig` — semantic `<ul>/<li>` grid. Each `<li>` contains an `<a>` wrapping image + H3 headline (card-level click target); optional `long_text` sits **outside** the link as a sibling description (matches dart). Delegates to `paragraph-base` with `animate: 'yes'`.
- `portals.scss` / `.css` — flex-wrap grid centered, 308px max per card; image border + hover opacity/border-color transition; headline via `heading4` mixin; staggered fade-in animation (see below).
- No JS — uses the shared `citizen_sdc/paragraph-animate` observer.

## Drupal template

`templates/paragraphs/portals/paragraph--portals.html.twig` — iterates `content.field_portals`, pulls each portal child's fields directly (`portal['#paragraph'].field_*.0.value / target_id / url / etc.`), renders the image via `drupal_entity('media', id, '400x300')`, and composes a `processed_text` render array for `field_long_text` so the filter format applies. Skips items missing a `field_image.target_id`. Empty guard: if no valid children, SDC isn't included (no empty wrapper).

## Bundle config

- `paragraphs.paragraphs_type.portals` — parent bundle.
- `paragraphs.paragraphs_type.portal` — child bundle (no SDC).
- `field.field.paragraph.portals.field_widget_title` — optional string (H2 above grid).
- `field.field.paragraph.portals.field_portals` — entity_reference_revisions → `portal`, unlimited.
- `field.field.paragraph.portal.field_headline` — string, required (H3 on card).
- `field.field.paragraph.portal.field_image` — entity_reference → media (image), required.
- `field.field.paragraph.portal.field_link` — link, required.
- `field.field.paragraph.portal.field_long_text` — text_long, optional (limited_html format).

No child Drupal template override exists — generic `paragraph.html.twig` catches any edge-case standalone render.

## Animation

Staggered random-ish fade-in on each `<li>`, mirroring the gallery lightbox pattern but **tuned for multiples of 3** since portal blocks are typically 3 or 6 items. 3-delay cycle via `:nth-child(3n+X)`:

- `3n+1` (1st, 4th, …): `0s`
- `3n+2` (2nd, 5th, …): `0.20s`
- `3n`   (3rd, 6th, …): `0.10s`

Same transition shape as gallery (`opacity + translateY(12px) → 0` over 0.55s ease-out). Triggered by the shared paragraph-animate observer adding `.is-in-view` on scroll-in. `prefers-reduced-motion` short-circuits to final state.
