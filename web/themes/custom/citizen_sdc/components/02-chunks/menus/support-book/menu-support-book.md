# Menu Support Book

Thin menu chunk — most of the support-book behavior lives in preprocess + the citizen_custom access helper, not in this folder.

## Custom code outside this SDC

- `citizen_sdc_preprocess_menu__support_book()` in `includes/citizen_sdc.menu.inc` does two things:
  1. Drops `<li>` items whose linked node is `field_support_type === 'site_management'` (and their descendants) from the rendered tree when the current user isn't elevated. Items aren't CSS-hidden — they're removed from the HTML.
  2. Adds a BEM modifier class on the `<li>` for each type: `menu-item--support-type--content` or `menu-item--support-type--site-management` (for the items that survive step 1).
- The "is this user elevated" check comes from the **`citizen_custom.support_book_access`** service (`isElevated()`). Single source of truth shared with the node and search-results SDCs.

## Related support SDCs

- **`citizen_sdc:node-support-book-default`** — renders the node view; its page template is where the friendly denial message shows.
- **`citizen_sdc:views-support-search-results`** — renders the support-search view; uses the same `isElevated` check to filter site_management rows.

## Note

If the section menu design is basically the same as the current support book theming (differing pretty much only in color), you can scrap most of the support-book-specific `.scss` / `.js` and pull in the section menu assets as library dependencies instead.
