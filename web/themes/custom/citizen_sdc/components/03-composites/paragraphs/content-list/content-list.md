# Content List paragraph — file map

Reference for where every piece of this widget lives. The content-list paragraph embeds a `content_list` view display (one per supported content type: `news_list`, `events_list`, etc.) and lets the editor narrow by category + pager limit per instance.

## SDC (this folder)

- `content-list.component.yml` — props (`attr`, `title`) + slots (`view`, `link`).
- `content-list.twig` — header row (title + more-link, flex-justified) above the embedded view; delegates to `paragraph-base` with `animate: 'no'`.
- `content-list.scss` / `.css` — textConstrain wrapper + the flex header.

## Drupal template

`web/themes/custom/citizen_sdc/templates/paragraphs/content-list/paragraph--content-list.html.twig`

- Two-stage guard before the SDC renders:
  1. `paragraph.id.value` check — unsaved paragraphs show an editor-only notice.
  2. Render the view once into `rendered_view`, check `|render|striptags|trim|length > 0`. Same render is passed as the SDC's `view` slot, so the emptiness check and the embedded output are guaranteed identical.
- Derives `view_display` from `paragraph.field_content_type.entity.label|lower ~ '_list'`.

## View

`config/sync/views.view.content_list.yml`

- Base: `node_field_data`. Per-content-type displays (`events_list`, `news_list`, …) — each filters on `node.type` for its bundle + `status = 1` + date handling as appropriate.
- Contextual argument: paragraph ID, ridden in through the two-hop relationship chain (`field_list_widget` → `reverse__paragraph__field_content_type`). The arg is what the `views_pre_view` hook reads to identify *this* paragraph instance.

## citizen_custom — view-side logic

`web/modules/custom/citizen_custom/citizen_custom.module` → `citizen_custom_views_pre_view()`

- Runs only for valid view+display combos (hardcoded list in the function).
- Loads `Paragraph::load($view->args[0])`, reads the paragraph's category field (`field_events_category` / `field_news_category`) + `field_limit_list`, and rewrites the view's `filters` and `pager` options accordingly.
- Per-instance independence comes from here — each `drupal_view()` call gets a fresh view object and a fresh hook invocation with its own `$args[0]`.

## citizen_custom — editor-side JS

`web/modules/custom/citizen_custom/js/admin.js` — `Drupal.behaviors.contentList`

- Scoped to `.field--name-field-content-type` via `once('isContentPlacer', ...)`.
- On page load: hides every select-widget field (+ `field_limit_list`) that isn't the content-type selector. Then, based on the currently-selected term's machine name, re-shows the matching `.field--name-field-{type}-category` field plus `field_limit_list` for `events` and `news`.
- On change: re-hides everything (also resetting any hidden selects back to `_none` so old values don't leak into the view), then re-shows the fields matching the new selection.
- Helper fns inline: `getTypeString()` (pulls the lowercased label from the selected option) + `hideAllBut()` (hide-except pattern).
- Library: `admin-global` in `citizen_custom.libraries.yml` (attached globally for admin routes — not SDC-attached).

## Bundle config

`config/sync/`

- `paragraphs.paragraphs_type.content_list.yml` — bundle definition.
- `field.field.paragraph.content_list.*.yml` — field instances: `field_widget_title`, `field_content_type`, `field_events_category`, `field_news_category`, `field_limit_list`, `field_link`.
- `field.storage.node.field_list_widget.yml` + per-bundle `field.field.node.{type}.field_list_widget.yml` — the hidden term reference on each eligible content type, feeds the view's relationship chain.
- `taxonomy.vocabulary.list_widget.yml` — the vocab backing `field_content_type` + the term-reference fields on nodes.
- `core.entity_form_display.paragraph.content_list.default.yml` + `core.entity_view_display.paragraph.content_list.{default,preview}.yml` — form + view displays.

## Related note

The `list_widget` vocab + `field_list_widget` node fields + the Views relationship chain are slated for removal after the SDC theme conversion ships — see `memory/project_list_widget_removal.md`. The hook is already arg-only and doesn't reference list_widget, so the refactor is config-only. When that lands, the Drupal-template line that derives `view_display` changes from `.entity.label|lower ~ '_list'` to `.value ~ '_list'`; nothing else in this folder has to change.
