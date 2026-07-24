# Main Menu

## Desktop Breakpoint
Since the main menu desktop breakpoints much more often the default $desk breakpoint, there is a $deskMenu unit variable in _units.scss to set the breakpoints specific to the main menu.

The breakpoint now lives in **one** place: the `$deskMenu` variable in `_units.scss`. It is exposed to JS as the `--desk-menu` custom property (emitted on `:root` from `00-base/03-global/_custom-properties.scss` and loaded via the global `style.css`). `menu-main.js` reads that property at init, so changing `$deskMenu` updates both the SCSS media queries and the JS breakpoint together — no need to touch the JS.

(The section and support-book menus follow the same pattern against the general `$desk` breakpoint via `--desk`.)
