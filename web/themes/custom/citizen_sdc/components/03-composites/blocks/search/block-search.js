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

        // While the drawer is open, trap Tab / Shift+Tab among close → input
        // → submit (DOM order); Escape clicks the close button so keyboard
        // users have a non-mouse exit. Listener is added on open, removed
        // on close — no work runs when the drawer is shut.
        const trapKeydown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            if (closeBtn) closeBtn.click();
            return;
          }
          if (event.key !== 'Tab') return;
          const focusables = [closeBtn, input, submit].filter(Boolean);
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;
          if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
          }
        };

        const openSearch = (event) => {
          event.preventDefault();
          wrapper.setAttribute('aria-hidden', 'false');
          setTabindex(openBtn, '-1');
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
          document.addEventListener('keydown', trapKeydown);
        };

        const closeSearch = (event) => {
          event.preventDefault();
          wrapper.setAttribute('aria-hidden', 'true');
          setTabindex(openBtn, '0');
          setTabindex(closeBtn, '-1');
          setTabindex(input, '-1');
          setTabindex(submit, '-1');
          if (closeWrapper) closeWrapper.style.display = 'none';
          setTimeout(() => {
            wrapper.style.maxHeight = '0px';
          }, 10);
          openBtn.focus();
          document.removeEventListener('keydown', trapKeydown);
        };

        openBtn.addEventListener('click', openSearch);
        if (closeBtn) closeBtn.addEventListener('click', closeSearch);
      });
    },
  };
})(Drupal, once);
