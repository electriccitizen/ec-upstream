# Menu System A11y Verification Checklist

Derived from CSB Priority 1 remediation work, updated for the new site's menu structure and committing fully to the **disclosure pattern** (not menubar). Use this to verify which items are already handled and which still need attention. Each item is phrased as something to **check** — flag what's missing/broken, skip what's already correct.

For each item, note:
- ✅ Already handled
- ❌ Still needs work (with file/location reference)
- ⚠️ Partially handled or unclear

---

## Menu Structure Reference

The new site's menu uses this structure for every menu item:

- **Link parents** (item is a page): `<a>` element
- **Non-link parents** (item has no URL, Drupal allows this): `<span>` element
- **Toggle for expandable items**: a sibling `<button>` element next to the `<a>` or `<span>` — never wrapping it

This applies to both desktop and mobile. The link and the toggle are **separate, independent controls**: the link navigates, the button toggles the submenu, and neither does both.

All checks below assume this structure.

---

## 1. Pattern Integrity — Confirm Disclosure, Not Menubar

The old site had a mix of menubar and disclosure patterns, which is worse than either alone. The new site should be **disclosure only**. Before anything else, verify that menubar-pattern artifacts have been fully removed.

- [ ] No `role="menu"` anywhere in menu markup (Twig templates or rendered output)
- [ ] No `role="menuitem"` anywhere
- [ ] No `role="menubar"` anywhere
- [ ] No `aria-haspopup` on any menu element (links, spans, or buttons)
- [ ] No arrow-key event handlers in menu JS (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown` should not be doing anything menu-specific)
- [ ] No custom tab-trapping or "single tab stop for the whole menu" logic — every focusable item should be a normal tab stop

---

## 2. Keyboard Operability (Disclosure Pattern)

- [ ] `Tab` moves through every link and toggle button in DOM order (one tab stop per element)
- [ ] `Shift+Tab` reverses that order cleanly
- [ ] `Enter` on a link `<a>` navigates to its URL
- [ ] `Space` or `Enter` on a toggle `<button>` expands/collapses its submenu
- [ ] `Enter`/`Space` on a link does **not** toggle the submenu (that's the button's job)
- [ ] `Space` or `Enter` on a `<span>` parent does nothing (it's not interactive)
- [ ] `Escape` closes an open submenu and returns focus to the toggle button that opened it
- [ ] Clicking/activating outside an open submenu closes it (mouse and keyboard both)

---

## 3. Link Markup (`<a>` elements)

- [ ] Links do not have `aria-expanded` (that's on the button, not the link)
- [ ] Links do not have `aria-controls`
- [ ] Links do not have `aria-haspopup`
- [ ] Links do not have `role="button"` or any other role override
- [ ] The link for the current page has `aria-current="page"`
- [ ] Ancestors of the current page (active trail parents) do **not** get `aria-current` — visual-only indication for them is fine
- [ ] External links, if any, get appropriate treatment (`rel`, icon with accessible label, etc.) — verify this matches site conventions

---

## 4. Non-Link Parent Markup (`<span>` elements)

- [ ] Non-link parents are `<span>` (not `<a href="#">` or `<div>`)
- [ ] Spans have no ARIA attributes — they're just visible text
- [ ] Spans are not focusable (no `tabindex`)

---

## 5. Toggle Button Markup (`<button>` elements)

- [ ] Toggle is a real `<button>` (not a styled link or div)
- [ ] Toggle is a sibling of the link/span, not a wrapper around it
- [ ] Has `type="button"` (prevents accidental form submission if ever placed inside a form)
- [ ] Has `aria-expanded="false"` at page load
- [ ] `aria-expanded` flips to `"true"` when the submenu opens and back to `"false"` when it closes
- [ ] Has `aria-controls="<id-of-submenu-ul>"` pointing at the submenu it controls
- [ ] Has a descriptive accessible name that includes the parent label — e.g. "Expand Services submenu" or "Services submenu" (not a bare "Expand")
- [ ] Accessible name is translatable via `{{ 'Expand @label submenu'|t({'@label': item.title}) }}` or equivalent
- [ ] Accessible name updates with state — "Expand Services" → "Collapse Services" when open (or equivalent pattern the site uses)
- [ ] Any icon inside the button (chevron, +/−) is `aria-hidden="true"` since the button already has a text label
- [ ] Button has no `aria-haspopup`

---

## 6. Submenu `<ul>` Markup

- [ ] Submenu `<ul>` has an `id` matching the toggle button's `aria-controls`
- [ ] Submenu is hidden from assistive tech and removed from tab order when collapsed — preferred approach is `display: none` or the `hidden` attribute on the `<ul>` (or an ancestor). `aria-hidden` alone is not sufficient because it doesn't remove focusability.
- [ ] If `aria-hidden` is used, it flips with state (`"true"` when closed, removed or `"false"` when open) — but still pair it with `display`/`visibility`/`hidden` so submenu links are genuinely non-focusable when closed
- [ ] Submenu links are not reachable by Tab when the submenu is collapsed

---

## 7. Mobile Menu Toggle (Hamburger)

- [ ] Toggle is a single `<button>` that visually changes between hamburger and X states (not two separate buttons)
- [ ] Has `type="button"`
- [ ] Has `aria-expanded` that toggles between `"false"` and `"true"`
- [ ] Has `aria-controls="<id-of-main-menu-ul>"`
- [ ] Accessible name is "Open Main Menu" by default, swaps to "Close Main Menu" when the menu is open (both translatable)
- [ ] Main menu `<ul>` that the toggle controls has a matching `id`
- [ ] Main menu `<ul>` is properly hidden (via `display`/`hidden`, not just `aria-hidden`) when the menu is closed, preventing tab access to menu items
- [ ] Icon inside the toggle is `aria-hidden="true"`

---

## 8. Focus Management

- [ ] When opening a submenu via keyboard, focus stays on the toggle button (user can then Tab into the submenu). Do not auto-move focus into the submenu on expand.
- [ ] When closing a submenu via `Escape`, focus returns to its toggle button
- [ ] When the mobile menu opens, focus can stay on the hamburger toggle (standard disclosure behavior) — confirm this matches UX expectations on the new site
- [ ] When the mobile menu closes via `Escape` or the X button, focus returns to the hamburger toggle
- [ ] No focus is ever lost to the `<body>` or document root during menu interactions
- [ ] Focus indicators are visible on all menu elements (links, toggle buttons, hamburger) — meets WCAG 2.2 SC 2.4.11 (Focus Not Obscured) and SC 2.4.13 (Focus Appearance)

---

## 9. Alert / Announcement Bar (If Present)

Old remediation flagged alert links as being in the tab order. EC correctly pushed back: that's expected when the alert is visible. Verify the new site handles this the same way.

- [ ] Alert links appear **after** the main menu in the DOM, so the menu tab order isn't disrupted
- [ ] When an alert is dismissed, its DOM is **removed** (not just hidden with CSS), so its links are no longer focusable
- [ ] Dismiss control is a real `<button>` with an accessible name like "Dismiss alert"

---

## 10. Date Picker (Only If the New Site Has One)

The old site used a jQuery Flatpickr calendar that was entirely inaccessible. Client direction was to replace with native HTML date inputs. If the new site has any date-filtering UI, verify:

- [ ] Uses `<input type="date">` rather than a jQuery/custom calendar
- [ ] Input has a proper `<label>` or `aria-label`
- [ ] Any "Apply" / submit button is a real `<button>`
- [ ] No `flatpickr` or jQuery UI datepicker dependencies in the theme

Skip this section entirely if the new site has no date-filtering feature.

---

## Suggested Grep / Search Patterns for Claude Code

Run these early to get a lay of the land:

```bash
# Menubar pattern artifacts (should find nothing)
grep -rn 'role="menu"' web/themes/custom/
grep -rn 'role="menuitem"' web/themes/custom/
grep -rn 'role="menubar"' web/themes/custom/
grep -rn "aria-haspopup" web/themes/custom/

# Arrow-key handlers in menu JS (should find nothing menu-related)
grep -rn "ArrowLeft\|ArrowRight\|ArrowUp\|ArrowDown" web/themes/custom/ --include="*.js"

# Required ARIA attributes (should find matches on toggle buttons)
grep -rn "aria-expanded" web/themes/custom/
grep -rn "aria-controls" web/themes/custom/
grep -rn "aria-current" web/themes/custom/

# Tabindex manipulation in JS (watch for tabindex="-1" being added to things that should be focusable)
grep -rn "tabindex" web/themes/custom/ --include="*.js"
grep -rn "setAttribute.*tabindex" web/themes/custom/

# Menu templates and components
find web/themes/custom/ -name "menu*.html.twig"
find web/themes/custom/ -name "*menu*.twig"
find web/themes/custom/components/ -type d -name "*menu*"

# Legacy jQuery datepicker (should find nothing if date picker section applies)
grep -rn "flatpickr\|datepicker" web/themes/custom/ web/modules/custom/
```

---

## Notes

- WCAG 2.2 AA is the baseline. Pay attention to the newer 2.2 criteria — **2.4.11 Focus Not Obscured (Minimum)** and **2.4.13 Focus Appearance** — which didn't exist when the CSB audit was done.
- Drupal 11's default menu rendering may differ from older versions. If the site's menu templates are overrides of core, verify each override is still doing meaningful work — some may be redundant now.
- If the menu is built as an SDC, the checks above map to the component's `.twig`, `.js`, and `.component.yml`. The `.component.yml` props schema is a good place to confirm expected menu data shape.
- Disclosure pattern references: Adrian Roselli, "Don't Use ARIA Menu Roles for Site Nav" (adrianroselli.com/2017/10); WAI-ARIA Authoring Practices, "Disclosure (Show/Hide) Pattern" (w3.org/WAI/ARIA/apg/patterns/disclosure).
