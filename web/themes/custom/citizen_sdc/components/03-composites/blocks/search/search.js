((Drupal, once) => {
  'use strict';

  const BLOCK_SELECTOR = '.block--site-search';
  const OPEN_TRIGGER_SELECTOR = '.site-search__trigger--open';
  const CLOSE_TRIGGER_SELECTOR = '.site-search__trigger--close';
  const CLOSE_WRAPPER_SELECTOR = '.site-search__toggle--close';
  const FORM_WRAPPER_ID = 'search-form-wrapper';
  const INPUT_SELECTOR = '.site-search--fulltext, #edit-site-search-api-fulltext';
  const SUBMIT_SELECTOR = '#edit-site-search-submit';

  const setTabindex = (el, value) => {
    if (el) el.setAttribute('tabindex', value);
  };

  Drupal.behaviors.siteSearchToggle = {
    attach(context) {
      once('siteSearch', BLOCK_SELECTOR, context).forEach((block) => {
        const openBtn = block.querySelector(OPEN_TRIGGER_SELECTOR);
        const closeBtn = block.querySelector(CLOSE_TRIGGER_SELECTOR);
        const closeWrapper = block.querySelector(CLOSE_WRAPPER_SELECTOR);
        const wrapper = block.querySelector(`#${FORM_WRAPPER_ID}`);
        const input = block.querySelector(INPUT_SELECTOR);
        const submit = block.querySelector(SUBMIT_SELECTOR);

        if (!openBtn || !wrapper) return;

        setTabindex(closeBtn, '-1');
        setTabindex(input, '-1');
        setTabindex(submit, '-1');

        const openSearch = (event) => {
          event.preventDefault();
          wrapper.setAttribute('aria-hidden', 'false');
          setTabindex(closeBtn, '0');
          setTabindex(input, '0');
          setTabindex(submit, '0');
          wrapper.style.maxHeight = '0px';
          setTimeout(() => {
            wrapper.style.maxHeight = `${wrapper.scrollHeight}px`;
          }, 10);
          if (closeWrapper) {
            setTimeout(() => {
              closeWrapper.style.display = 'block';
            }, 300);
          }
          if (input) {
            setTimeout(() => input.focus(), 320);
          }
        };

        const closeSearch = (event) => {
          event.preventDefault();
          wrapper.setAttribute('aria-hidden', 'true');
          setTabindex(closeBtn, '-1');
          setTabindex(input, '-1');
          setTabindex(submit, '-1');
          if (closeWrapper) closeWrapper.style.display = 'none';
          setTimeout(() => {
            wrapper.style.maxHeight = '0px';
          }, 10);
          openBtn.focus();
        };

        openBtn.addEventListener('click', openSearch);
        if (closeBtn) closeBtn.addEventListener('click', closeSearch);
      });
    },
  };
})(Drupal, once);
