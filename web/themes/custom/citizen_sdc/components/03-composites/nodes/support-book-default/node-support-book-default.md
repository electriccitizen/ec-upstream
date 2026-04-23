# Node Support Book Default

Thin wrapper around `citizen_sdc:node-base` with `modifier_class: 'support-book'`. The interesting access logic sits in the page template and preprocess, not this SDC.

## Custom code outside this SDC

- **`templates/layout/page--support-book.html.twig`** — page-level template override. For `field_support_type === 'site_management'` nodes viewed by non-elevated users, it replaces the `pageMain` block with a friendly "you do not have permission" message instead of rendering node content. This is the designed UX for direct-URL access to restricted pages.
- **`citizen_sdc_preprocess_page()`** in `includes/citizen_sdc.html.inc` — injects the `is_elevated` variable the page template reads. Adds `user.roles` to cache contexts.
- **`citizen_custom.support_book_access`** service — the `isElevated()` check. Same helper used by the menu and search-results SDCs.
- **`citizen_custom` anonymous access subscriber** (`AnonymousAccessDenial`) — blocks anonymous requests to support_book canonical routes with a 403 before this template runs, so the page template only needs to handle authenticated-but-not-elevated users.

## Related support SDCs

- **`citizen_sdc:menu-support-book`** — sidebar menu; removes site_management items from the tree for non-elevated users (same `isElevated` check).
- **`citizen_sdc:views-support-search-results`** — support-book sidebar search; filters site_management rows (same `isElevated` check).
