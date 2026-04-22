# Horizontal Rule paragraph — file map

Simple `<hr>` divider with an editor-selectable color. Replaces dart's `field_width` (full / text) with a `field_color` enum (light_gray / black / primary). Width is now always the text-constrained column (matches dart's `.text` variant).

## SDC (this folder)

- `horizontal-rule.component.yml` — props `attr`, required `color` (enum `light_gray | black | primary`).
- `horizontal-rule.twig` — adds `paragraph--horizontal-rule--{color|clean_class}` BEM modifier via `attr.addClass()`, delegates to paragraph-base with an `<hr>` in the content slot. `animate: 'no'` — dividers don't need scroll-in animation.
- `horizontal-rule.scss` / `.css` — `@include textConstrain` on the wrapper; `<hr>` gets a 1px top border whose color is set per BEM modifier: `--light-gray` → `$lightGray`, `--black` → `$black`, `--primary` → `$hrPrimary`.

## Drupal template

`templates/paragraphs/horizontal-rule/paragraph--horizontal-rule.html.twig` — hands `paragraph.field_color.value` to the SDC as `color`.

## Bundle config

- `paragraphs.paragraphs_type.horizontal_rule`
- `field.storage.paragraph.field_color` — list_string with allowed values `light_gray | black | primary`
- `field.field.paragraph.horizontal_rule.field_color` — required, default `light_gray`

## Theme override hook

`$hrPrimary` in `_component-colors.scss` defaults to `$link`. Per-project overrides point it at a different brand color without touching the SDC.
