/**
 * @file
 * Some view-placer variants (the home-page feeds) should disappear
 * entirely when the embedded view returns no results — not just hide the
 * content but drop the widget title + more-link shell that the paragraph
 * renders regardless of results. Drupal views render nothing at all for
 * an empty result set (no wrapper, no empty-area markup in an embed
 * context), so we can't probe for `.view__content`: we check whether a
 * `.view` rendered inside the paragraph at all.
 *
 * Scoped by BEM modifier class so this only runs on the displays that
 * want it. Add the modifier of any new "hide on empty" view display to
 * `HIDE_ON_EMPTY` to opt it in.
 */
((Drupal, once) => {
  'use strict';

  const HIDE_ON_EMPTY = [
    'paragraph--view-placer--homepage-events',
    'paragraph--view-placer--homepage-news',
  ];

  const SELECTOR = HIDE_ON_EMPTY.map((c) => `.${c}`).join(', ');

  Drupal.behaviors.viewPlacerRemoveEmpty = {
    attach(context) {
      once('view-placer-remove-empty', SELECTOR, context).forEach((wrapper) => {
        if (wrapper.querySelector('.view')) return;
        wrapper.remove();
      });
    },
  };
})(Drupal, once);
