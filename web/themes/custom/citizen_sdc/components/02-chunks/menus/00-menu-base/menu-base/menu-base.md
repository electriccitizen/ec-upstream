# Menu Base

## Custom Variables & Classes
The menu base component uses a menu preprocess in citizen_sdc.menu.inc to get the routes of menu items and to set appropriate classes based on the route. This detection is mainly used to find any links that have '#' (development links) and `<nolink>` Menu column parents. These links get special classes and properties to function as they should.

These classes are used in the menu.html.twig to set `<span>` for any `<nolink>` items instead of `<a>` for accessiblity. '#' development links get '#' as their href and .hash-link as their modifier class so they work as live links for development testing.

Lastly, active items get an active modifier class and external links get .ext as a class (set in the extlink module config).
