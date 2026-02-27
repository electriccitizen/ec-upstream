# Menu Support Book

## Custom Variables & Classes

The support book menu gets custom preprocess classes added to its menu item `<li>` elements via two hooks in `includes/citizen_sdc.menu.inc`.

### Generic menu item classes (all menus)
`citizen_sdc_preprocess_menu()` runs for every menu on the site and adds classes to the `<a>` / `<span>` link element via `$item['link_classes']`. These cover common cases like `menu-item__link--no-link`, `menu-item__link--hash-link`, `menu-item__link--menu-parent`, and `menu-item__link--active`.

### Support type classes (support book only)
`citizen_sdc_preprocess_menu__support_book()` runs exclusively for the support book menu. For each menu item that links to a node, it loads that node, reads the `field_support_type` list field key, and adds a BEM modifier class to the item's `<li>` attributes object.

**Class format:** `menu-item--support-type-{key}`

**Examples:**
- `menu-item--support-type-content`
- `menu-item--support-type-site-management`

These classes are used to control the visibility of support book menu links based on the user's role.
---

NOTE: If the section menu design is basically the same as the current support book theming (differing pretty much only in color), you can scrap most of the support book specific .scss and .js and bring in the section menu CSS and JS as library dependencies instead.
