/**
 * @file
 * When the URL suggests an exposed filter was just submitted (`?f`, `?c`,
 * or `?s` query param present), smooth-scroll + focus the skip-filters
 * anchor so keyboard users land on the updated results.
 */
((Drupal, once) => {
  'use strict';

  Drupal.behaviors.viewsFormScroll = {
    attach(context) {
      once('wasSearched', '#views-form-wrapper', context).forEach(() => {
        const url = window.location.href;
        if (url.indexOf('?f') === -1 && url.indexOf('?c') === -1 && url.indexOf('?s') === -1) return;

        window.addEventListener('load', () => {
          setTimeout(() => {
            const anchor = document.getElementById('skip-filters');
            if (anchor) {
              anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
              anchor.focus();
            }
          }, 300);
        });
      });
    },
  };
})(Drupal, once);
