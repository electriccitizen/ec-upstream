# Content List Paragraph Architecture

## Overview

The `content_list` paragraph type lets editors place filtered, paginated lists of content (events, news, etc.) on any page. Editors select a content type, optionally choose a category filter and result limit, and the system renders the appropriate view display.

---

## How It Worked Before (List Widget Taxonomy)

The old system used a **List Widget taxonomy vocabulary** as a bridge between paragraphs and content nodes:

1. Each content type that could appear in a list had a corresponding taxonomy term in the `list_widget` vocabulary (e.g., "Events", "News").
2. The paragraph's `field_content_type` was an entity reference to this taxonomy.
3. Each node type had a hidden `field_list_widget` field pointing back to its corresponding term.
4. The View used a **2-hop relationship chain**: paragraph -> taxonomy term -> node (via reverse entity reference).
5. The Twig template called `drupal_view()` and used `render|striptags|trim` to check for empty results, causing the view to execute twice per paragraph.
6. Filter and pager logic was handled by a `switch/case` block in `hook_views_pre_view` with hardcoded field names for each content type.

## How It Works Now (Direct Field + Custom Argument Plugin)

1. The paragraph's `field_content_list_type` is a `list_string` field with machine-name values (`event`, `news`).
2. A custom Views argument plugin (`ContentListParagraph`) accepts the paragraph ID, loads the paragraph, reads the content type, and adds a `node_field_data.type = :type` WHERE condition directly.
3. The View has one embed display per content type (`events_list`, `news_list`), each with its own sorts and filters.
4. A config-driven `hook_views_pre_view` reads `citizen_custom.settings` to apply category filters and pager limits from paragraph fields — no switch/case, no hardcoded field names.
5. A preprocess hook (`citizen_custom_preprocess_paragraph__content_list`) renders the view once in PHP and passes the result to Twig. The template simply outputs the variable — no `drupal_view()`, no double-render.

---

## Pros and Cons

### Pros of the New Approach

- **No taxonomy dependency.** The list_widget vocabulary was a redundant data structure that mirrored content type names. Removing it eliminates a setup step for new sites and a potential point of failure during migrations.
- **Single-query view execution.** The old 2-hop relationship (paragraph -> term -> node) required JOINs through the taxonomy system. The new argument plugin adds a simple `WHERE type = :type` condition.
- **No double-render.** The old Twig template called `drupal_view()` (which executes the view), then checked `render|striptags|trim` for empty results (which rendered the view). The new approach executes and renders once in the preprocess hook.
- **Config-driven extensibility.** Adding a new content type's category filter requires only a config entry in `citizen_custom.settings.yml` — no PHP code changes.
- **Stable form values.** The admin JS now reads `select.value` (machine names like `event`) instead of option label text. This is immune to label changes and translation.
- **Simpler Views config.** No relationships, no reverse entity references, no taxonomy dependencies in the view.
- **Cleaner empty-result handling.** When a view returns no results, the paragraph outputs nothing — no empty wrapper divs.

### Cons / Trade-offs

- **Custom code dependency.** The argument plugin (`ContentListParagraph.php`) and the `views_pre_view` hook are custom PHP. If someone unfamiliar with the codebase edits the view in the UI, they need to understand that filters and pager are applied programmatically, not through the Views UI.
- **Display ID convention.** The system assumes display IDs follow the pattern `{content_type}_list` (e.g., `news_list`). This convention must be followed when adding new displays.
- **Config file coordination.** Adding a new content type touches multiple config files (field storage, module settings, view display). The old approach also required this, but the steps were different.
- **Two-deploy migration.** Transitioning from the old system requires a two-step deployment to safely migrate data before removing old fields.

---

## Adding a New Content Type List

This example adds a **Books** content type (machine name: `book`) to the content list system.

### Step 1: Add the value to the field storage allowed values

Edit `config/sync/field.storage.paragraph.field_content_list_type.yml`:

```yaml
settings:
  allowed_values:
    -
      value: book
      label: Books
    -
      value: event
      label: Events
    -
      value: news
      label: News
```

### Step 2: Create the View display

Edit `config/sync/views.view.content_list.yml` and add a new display. The easiest approach is through the Views UI:

1. Go to **Structure > Views > Content List** (`/admin/structure/views/view/content_list`).
2. Click **+Add** and choose **Embed**.
3. Set the machine name to `book_list` (must match the pattern `{content_type}_list`).
4. Override what you need for this display:
   - **Sort criteria**: e.g., `Title (ASC)` for alphabetical, `Authored on (DESC)` for newest first.
   - **Filter criteria**: Add a `Published (= Yes)` filter. Add any category/taxonomy filters this list needs (see "Adding Filters" below).
   - **Format > Show**: Choose the view mode for the listed nodes (e.g., `Listing`).
5. Save the view and export config: `drush cex -y`.

If the display does not need a category filter, you can skip Steps 3-4 below.

### Step 3: Add a category field to the paragraph (if needed)

If books have a taxonomy (e.g., `book_genres`) that editors should be able to filter by:

1. Add a new entity reference field to the `content_list` paragraph type:
   - Machine name: `field_book_category`
   - Target: Taxonomy term, vocabulary: `book_genres`
2. Export config: `drush cex -y`.

### Step 4: Register the display filter in module settings

Edit `config/sync/citizen_custom.settings.yml`:

```yaml
content_list:
  display_filters:
    book_list:
      category_field: field_book_category
      view_filter: field_category_target_id
    events_list:
      category_field: field_events_category
      view_filter: field_category_target_id
    news_list:
      category_field: field_news_category
      view_filter: field_category_target_id
```

The `view_filter` key must match the filter identifier in the View. If the book display uses the same shared `field_category` field as events/news, use `field_category_target_id`. If it uses a different field, use that filter's identifier.

### Step 5: Update the admin JS mapping

Edit `web/modules/custom/citizen_custom/js/admin.js` and add the new type to the `typeToCategoryPrefix` mapping:

```js
var typeToCategoryPrefix = {
  book: 'book',
  event: 'events',
  news: 'news'
};
```

The value must match the category field name pattern: if the field is `field_book_category`, the prefix is `book` (the JS builds `.field--name-field-{prefix}-category`).

### Step 6: Import config and clear caches

```bash
drush cim -y && drush cr
```

### Summary of files touched

| File | Change |
|------|--------|
| `config/sync/field.storage.paragraph.field_content_list_type.yml` | Add `book` to `allowed_values` |
| `config/sync/views.view.content_list.yml` | Add `book_list` embed display |
| `config/sync/citizen_custom.settings.yml` | Add `book_list` entry to `display_filters` |
| `config/sync/field.field.paragraph.content_list.field_book_category.yml` | New category field (if needed) |
| `web/modules/custom/citizen_custom/js/admin.js` | Add `book` to `typeToCategoryPrefix` |

No PHP code changes are required.

---

## Adding Additional Filters for a Specific List

This example adds a second taxonomy filter (e.g., `news_tags`) to the news list, so editors can filter news by both category and tag.

### Step 1: Add the taxonomy reference field to the paragraph

1. Go to **Structure > Paragraph types > Content List > Manage fields**.
2. Add a new entity reference field:
   - Machine name: `field_news_tags`
   - Target: Taxonomy term, vocabulary: `news_tags`
3. Export config: `drush cex -y`.

### Step 2: Add the filter to the View display

1. Go to **Structure > Views > Content List**, select the **News** display.
2. Override **Filter criteria** (if not already overridden — click "This (override)" to confirm).
3. Add a filter: **Content: Tags (field_tags)** (or whatever the node-side field is).
   - Set operator to "Is one of".
   - Set a placeholder value (any term ID — the hook will override this at runtime).
   - Note the filter identifier shown in the URL/config (e.g., `field_tags_target_id`).
4. Save and export config: `drush cex -y`.

### Step 3: Register the additional filter in module settings

The current config structure supports one `category_field` + `view_filter` pair per display. To support multiple filters, extend the config structure. Edit `config/sync/citizen_custom.settings.yml`:

```yaml
content_list:
  display_filters:
    news_list:
      category_field: field_news_category
      view_filter: field_category_target_id
      additional_filters:
        - paragraph_field: field_news_tags
          view_filter: field_tags_target_id
```

Then update the `citizen_custom_views_pre_view()` hook in `citizen_custom.module` to iterate over `additional_filters` using the same pattern as the primary filter (load paragraph field values, set view filter). The existing pattern for category filters serves as the template:

```php
// After the primary category filter block, add:
if (!empty($filter_config['additional_filters'])) {
  foreach ($filter_config['additional_filters'] as $extra) {
    $para_field = $extra['paragraph_field'];
    $view_filter_id = $extra['view_filter'];
    if ($paragraph->hasField($para_field) && !$paragraph->get($para_field)->isEmpty()) {
      $values = [];
      foreach ($paragraph->get($para_field) as $item) {
        $values[] = $item->target_id;
      }
      $filters[$view_filter_id]['value'] = $values;
    }
    elseif (isset($filters[$view_filter_id])) {
      unset($filters[$view_filter_id]);
    }
  }
}
```

### Step 4: Update the admin JS

Add an entry to `typeToCategoryPrefix` if the new field should be shown/hidden by the content type selector. If the visibility logic becomes more complex (multiple fields per type), extend `showFieldsForType()` to accept an array of field selectors per type.

### Step 5: Update config schema

If you extended the config structure, update `web/modules/custom/citizen_custom/config/schema/citizen_custom.schema.yml` to include the `additional_filters` sequence.

---

## Adjusting Sort Order for a Specific List

Each content type's view display has its own sort criteria. Sorts are configured entirely in the Views UI — no custom code involved.

### Example: Sorting a bio list by last name

1. Go to **Structure > Views > Content List** (`/admin/structure/views/view/content_list`).
2. Select the display you want to modify (e.g., **Bio** or create a new `bio_list` display).
3. Click **Sort criteria** in the display settings.
4. If this display inherits sorts from Default, click **override** to create display-specific sorts.
5. Remove or rearrange existing sorts.
6. Click **Add** and choose the field to sort by (e.g., `Content: Last Name (field_last_name)`).
7. Set the sort direction (ASC for A-Z, DESC for Z-A).
8. Rearrange if multiple sorts exist (the first sort is primary).
9. Save the view.
10. Export config: `drush cex -y`.

### Common sort patterns

| Use case | Sort field | Direction |
|----------|-----------|-----------|
| Upcoming events | `field_dates_value` | ASC (soonest first) |
| Latest news | `Authored on (created)` | DESC (newest first) |
| Alphabetical bios | `field_last_name` | ASC |
| Manual/weighted order | `field_weight` (integer field on node) | ASC (lowest first) |

### Important notes

- When overriding sorts on a display, you must also override **Filter criteria** and **Filter groups** if they differ from the default display. Views treats each section's override independently.
- The default display's sort (`field_dates_value ASC`) is designed for events. News overrides this with `created DESC`. Any new display should override sorts to match its content type's needs.
- Sort changes are purely config — no PHP or JS changes needed.

---

## Architecture Reference

### Key files

| File | Purpose |
|------|---------|
| `web/modules/custom/citizen_custom/citizen_custom.module` | Hooks: `views_data_alter`, `views_pre_view`, `preprocess_paragraph__content_list` |
| `web/modules/custom/citizen_custom/src/Plugin/views/argument/ContentListParagraph.php` | Custom Views argument plugin — loads paragraph, filters by content type |
| `web/modules/custom/citizen_custom/js/admin.js` | Admin form JS — shows/hides category and limit fields based on content type selection |
| `config/sync/citizen_custom.settings.yml` | Config mapping: display IDs to paragraph fields and view filter identifiers |
| `config/sync/views.view.content_list.yml` | The content_list View with per-type embed displays |
| `config/sync/field.storage.paragraph.field_content_list_type.yml` | Field storage for the content type selector (list_string) |
| `web/themes/custom/citizen_dart/templates/paragraphs/content-list/paragraph--content-list.html.twig` | Twig template — outputs preprocess variables, no view logic |

### Data flow

```
Editor selects "News" + category + limit on paragraph form
                        |
                        v
Paragraph saved with field_content_list_type=news,
  field_news_category=5, field_limit_list=2
                        |
                        v
Page renders -> preprocess hook loads paragraph
  -> builds display_id = "news_list"
  -> calls Views::getView('content_list')
  -> preExecute() fires views_pre_view hook
     -> hook reads citizen_custom.settings
     -> applies category filter from paragraph field
     -> applies pager limit from paragraph field
  -> execute() runs query with LIMIT and WHERE
  -> render() produces output
  -> passes to Twig as content_list_view
                        |
                        v
Twig outputs: title + view results + link
(or nothing if no results)
```
