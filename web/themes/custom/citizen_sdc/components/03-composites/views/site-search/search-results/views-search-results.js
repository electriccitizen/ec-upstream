/**
 * @file
 * Wraps each matched search term in `<mark class="search-highlight">` inside
 * the site-search results' meta description blocks. Targets the SDC selector
 * `.node-search-result__meta-description` from `node-search-result-base`,
 * which sits around the rendered `field_meta_description` in the search_result
 * view mode. Reads the entered query out of the exposed filter
 * (`#edit-site-search-api-fulltext`); only runs when the site-search exposed
 * form is on the page. Co-located with the search-results SDC so the library
 * auto-attaches only when the results view renders.
 */
((Drupal, once) => {
  'use strict';

  Drupal.behaviors.searchHighlight = {
    attach(context) {
      const cells = once('highlight', '.node-search-result__meta-description', context);
      if (!cells.length) return;

      const input = document.getElementById('edit-site-search-api-fulltext');
      if (!input || !input.value) return;

      const words = input.value
        .replace(/["“”]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      if (!words.length) return;

      const regex = new RegExp(`(${words.join('|')})`, 'gi');
      cells.forEach((el) => {
        el.innerHTML = el.textContent.replace(
          regex,
          '<mark class="search-highlight">$1</mark>'
        );
      });
    },
  };
})(Drupal, once);
