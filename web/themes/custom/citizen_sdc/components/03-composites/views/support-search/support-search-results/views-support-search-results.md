# Views Support Search Results

Renders the `support_search.search_results` view display. Splits first 6 rows inline + rest inside a drawer via `citizen_sdc:drawer` (declared as a library dep). Role-based row filtering + row split happen in the Drupal template above this SDC, not inside.

## Custom code outside this SDC

- **`templates/views/views-view-unformatted--support-search--search-results.html.twig`** — strips rows whose class includes `site-management` for non-elevated users, then splits the remaining rows into `visible_rows` (first 6) and `drawer_rows` (rest) before including this SDC.
- **`citizen_sdc_preprocess_views_view_unformatted()`** in `includes/citizen_sdc.views.inc` — injects `is_elevated` that the Drupal template reads. Adds `user.roles` to cache contexts.
- **`citizen_custom.support_book_access`** service — the `isElevated()` check. Same helper used by the menu and node SDCs.
- **`citizen_sdc:drawer`** — included for the toggle + collapse markup. Pass plain strings (not `|t`'d) for `toggle_open_text` / `toggle_close_text` — the drawer SDC applies `|t` itself.
- Search API `content_access` processor is enabled on the `support` index — the view query respects published/access state at the index layer. Role-based (`site_management`) filtering is a theme-layer concern handled in the Drupal template.

## Related support SDCs

- **`citizen_sdc:menu-support-book`** — sidebar menu on the same pages; drops site_management items using the same `isElevated` check.
- **`citizen_sdc:node-support-book-default`** — the support-book node view; `page--support-book.html.twig` shows the denial message for direct-URL access to site_management pages.
