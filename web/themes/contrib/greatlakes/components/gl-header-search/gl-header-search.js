/**
 * @file
 * Search box interaction (at wide widths).
 */
((Drupal, once) => {
  let desktopSearchButton;
  let searchPopover;
  let isSearchOpen;
  let headerSearchPopoverClose;

  /**
   * Initializes everything.
   *
   * @param {Element} header - the <header> element.
   */
  function init(header) {
    desktopSearchButton = header.querySelector('.header-search__trigger');
    searchPopover = header.querySelector('.header-search__content');
    isSearchOpen = () => searchPopover.open;
    searchInput = searchPopover.querySelector('[type="search"], [type="text"]');
    headerSearchPopoverClose = searchPopover.querySelector('.header-search__popover-close');

    desktopSearchButton.addEventListener('click', () => {
      changeSearchVisibility(!isSearchOpen());
    });

    headerSearchPopoverClose.addEventListener('click', () => changeSearchVisibility(false));

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        changeSearchVisibility(false);
      }
    });
  }

  /**
   * Show/hide search.
   *
   * @param {boolean} toState
   */
  function changeSearchVisibility(toState) {
    const searchPopoverContainsFocus = searchPopover.contains(document.activeElement);
    const searchInput = searchPopover.querySelector('[type="search"], [type="text"]');

    searchPopover.classList.toggle('is-active', toState);
    desktopSearchButton.setAttribute('aria-expanded', toState);

    if (toState === false && searchPopoverContainsFocus) {
      desktopSearchButton.focus();
    }

    if (toState === true) {
      Drupal.dripyard.closeLanguageSwitcher?.();
      searchPopover.addEventListener('transitionend', () => searchInput.focus(), { once: true});
      searchInput.focus();
    }

    if (!isSearchOpen() && toState === true) {
      Drupal.dripyard.closePopoverNavigation?.();

      // We cannot use the `showModal()` method here, as it will place the
      // popover in the "top layer", which will prevent search API's
      // autocomplete from showing.
      searchPopover.show();
      document.body.classList.add('is-active-mobile-menu');
      toggleFocusTrap(true);
    }
    else {
      searchPopover.close();
      document.body.classList.remove('is-active-mobile-menu');
      toggleFocusTrap(false);
    }
  }

  /**
   * Enables/disables a focus trap on the search popover.
   *
   * @param {boolean} focusTrapToBeEnabled - True if the focus trap should be enabled,
   * otherwise false.
   */
  function toggleFocusTrap(focusTrapToBeEnabled) {
    if (focusTrapToBeEnabled === true) {
      document.querySelectorAll(Drupal.dripyard.focusableElementsSelector).forEach(focusableElement => {
        if (!searchPopover.contains(focusableElement)) {
          focusableElement.inert = true;
          focusableElement.dataset.searchPopoverInert = true;
        }
      });
    }
    else {
      document.querySelectorAll('[data-search-popover-inert]').forEach(el => {
        el.inert = false;
        delete el.dataset.searchPopoverInert;
      });
    }
  }

  /**
   * Close search popover.
   */
  function closeSearch() {
    changeSearchVisibility(false);
  }

  Drupal.dripyard = Drupal.dripyard || {};
  Drupal.dripyard.closeSearch = closeSearch;

  Drupal.behaviors.headerSearch = {
    attach(context) {
      once('header-search-search', '.site-header', context).forEach(init);
    },
  };
})(Drupal, once);
