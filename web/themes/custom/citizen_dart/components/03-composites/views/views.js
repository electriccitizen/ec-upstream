(function (Drupal, once) {

  /* Scroll to results if an exposed filter was used,
   * set placeholders for select2.
  ------------------------------------ */
  Drupal.behaviors.viewsScroll = {
    attach: function (context, settings) {
      once('wasSearched', '#views-form-wrapper', context).forEach(view => {

        const urlCurrent = window.location.href;

        if ((urlCurrent.indexOf("?f") > -1) || (urlCurrent.indexOf("?c") > -1) || (urlCurrent.indexOf("?s") > -1)) {

          window.onload = function () {
            setTimeout(function () {
              var viewScrollAnchor = document.getElementById('skip-filters');

              if (viewScrollAnchor) {
                viewScrollAnchor.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                viewScrollAnchor.focus();
              }
            }, 300);
          };
        }

      });
    }
  };

  /* Highlight search results.
  ------------------------------------ */
  Drupal.behaviors.searchHighlight = {
    attach: function (context, settings) {
      once('highlight', '#views-exposed-form-site-search-site-search-block', context)
        .forEach(searchBlock => {
          const searchInput = document.getElementById('edit-site-search-api-fulltext');

          if (searchInput && searchInput.value) {

            // Remove quotes and split into words
            const searchString = searchInput.value
              .replace(/["“”]/g, '')
              .split(/\s+/)
              .filter(Boolean);

            // Escape regex characters in each word
            const escapeRegex = str =>
              str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            function wrapInTag(element, opts) {
              const tag = opts.tag;
              const words = (opts.words || []).map(escapeRegex);

              if (!words.length) return;

              const regex = new RegExp(`(${words.join('|')})`, 'gi');
              const replacement = `<${tag}>$1</${tag.split(' ')[0]}>`;

              element.innerHTML = element.textContent.replace(regex, replacement);
            }

            const bodyElements = document.querySelectorAll('.views-field-field-meta-description');

            if (bodyElements.length > 0) {
              bodyElements.forEach(element => {
                wrapInTag(element, {
                  tag: 'mark class="search-highlight"',
                  words: searchString
                });
              });
            }
          }
        });
    }
  };

})(Drupal, once);
