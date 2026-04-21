# Node Alert Teaser SDC

This is the actual dismissible alert markup — what site visitors see in the
alert region. **It is rendered server-side but reaches the browser via AJAX**,
not as part of the initial page HTML. See the companion `block-alert.md` for
the other side of the wiring.

## Where it renders from

1. Visitor requests any page.
2. The `alert` block (`citizen_sdc:block-alert`) renders an empty placeholder
   into the theme's alert region.
3. `citizen_custom/alert` JS (attached via `block-alert`'s
   `libraryOverrides.dependencies`) fires `fetch('/ajax/alert')`.
4. The `citizen_custom.alert_ajax` controller entity-queries published alert
   nodes whose `field_display_range` spans the current timestamp, renders
   each in `teaser` view-mode, and returns the concatenated HTML.
5. Drupal's teaser render pipeline lands on `node--alert--teaser.html.twig`,
   which delegates to this SDC with `node.uuid.value`, the urgency string,
   and the rendered `field_alert_text` render array as the `content` slot.
6. JS injects the returned HTML into the placeholder and re-runs
   `Drupal.attachBehaviors()` so close-button handlers bind.

## Key markup contracts with JS

The following are **load-bearing** for `js/alert.js` — changing them means
updating the JS too:

- `data-alert-uuid="{{ uuid }}"` — keys 30-day localStorage dismissal.
- `data-alert-close` — selector the JS uses to find close buttons inside
  injected teasers.
- The close button must be inside the `[data-alert-uuid]` element so
  `button.closest('[data-alert-uuid]')` finds the right teaser to dismiss.

The `.alert` / `.alert--{urgency}` BEM classes are purely visual — styling
changes are safe there.

## Why not extend node-teaser-base

The standard teaser bases (`node-teaser-base`, `node-listing-base`, etc.) are
link-card wrappers designed for listing pages: `<article>` + linked `<h2>` +
image slot + content. An alert teaser is none of those — it's a live
dismissible notice with no linked title, no image, no listing context. Trying
to fit it into `node-teaser-base` would force a bunch of empty slots and
fight the card styling. Standalone BEM (`.alert`) keeps the CSS clean.

## CSS attachment (gotcha)

The teaser renders inside the AJAX Response body, so **any library attached
during this SDC's render dies with the Response**. `block-alert` pulls in
`core/components.citizen_sdc--node-alert-teaser` (this SDC's auto-library)
via its own `libraryOverrides.dependencies` so the CSS is already on the
parent page before the fetch resolves.

If you add JS to this SDC in the future, it has to be pulled in from
`block-alert.component.yml` the same way — don't rely on SDC auto-attach for
anything rendered inside the AJAX pipeline.

## Content composition

Props:

- `uuid` (required) — `node.uuid.value` from the Drupal template. Note the
  `.value` suffix: bare `node.uuid` returns the uuid FieldItemList, which
  can't be stringified, and `node.uuid()` hits the Twig sandbox.
- `urgency` — the raw `field_urgency` value (`standard` / `urgent`). Drives
  the `.alert--{urgency}` modifier class.
- `dismiss_label` — aria-label for the close button. Defaults to
  `'Dismiss alert'|t`.

Slot:

- `content` — the rendered `field_alert_text` from the teaser view display.
  Teaser display only shows the text (no urgency / no date range — those
  are part of the default-view node page, not the live alert in the region).

## Related files

- `web/modules/custom/citizen_custom/src/Controller/Alert.php` — AJAX endpoint.
- `web/modules/custom/citizen_custom/js/alert.js` — fetcher + dismissal.
- `templates/content/nodes/alert/node--alert--teaser.html.twig` — Drupal
  template override that delegates here.
- `close-icon.svg` (colocated) — reference source for the inline SVG in the
  close button. Not loaded at runtime; the markup is inlined in the twig so
  `stroke="currentColor"` can inherit the button's color.
