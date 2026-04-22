/**
 * @file
 * Wraps each matched search term in `<mark class="search-highlight">` inside
 * the site-search results' `.views-field-body-1` cells (meta description).
 * Reads the entered query out of the exposed filter (
 * `#edit-site-search-api-fulltext`); only runs when the site-search
 * exposed form is on the page. Co-located with the search-results SDC so
 * the library auto-attaches only when the results view renders.
 */
((Drupal, once) => {
  'use strict';

  Drupal.behaviors.searchHighlight = {
    attach(context) {
      once('highlight', '#views-exposed-form-site-search-site-search-block', context).forEach(() => {
        const input = document.getElementById('edit-site-search-api-fulltext');
        if (!input || !input.value) return;

        const words = input.value
          .replace(/["“”]/g, '')
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        if (!words.length) return;

        const regex = new RegExp(`(${words.join('|')})`, 'gi');
        document.querySelectorAll('.views-field-field-meta-description').forEach((el) => {
          el.innerHTML = el.textContent.replace(
            regex,
            '<mark class="search-highlight">$1</mark>'
          );
        });
      });
    },
  };
})(Drupal, once);
