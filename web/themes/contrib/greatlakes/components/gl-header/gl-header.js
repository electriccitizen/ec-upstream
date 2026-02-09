/**
 * @file
 * Site header.
 */

((Drupal, once) => {
  let mobileNavButton;
  let popOver;
  let popOverCloseButton;
  Drupal.dripyard = Drupal.dripyard || {};

  /**
   * A selector that will return all focusable elements.
   */
  Drupal.dripyard.focusableElementsSelector = ':is(audio, button, canvas, details, iframe, input, select, summary, textarea, video, [accesskey], [contenteditable], [href], [tabindex]:not([tabindex*="-"])):not(:is([disabled], [inert]))';


  function syncPopover({ currentTarget: popOver }) {
    const currentState = popOver.open;
    mobileNavButton.setAttribute('aria-expanded', currentState);
    document.body.classList.toggle('is-active-mobile-menu', currentState);
  }

  /**
   *
   * @param {boolean|null|undefined} toState
   */
  function toggleNavigationPopoverVisibility(toState) {
    let open = toState ?? !popOver.open;

    if (open) {
      popOver.showModal();
      mobileNavButton.setAttribute('aria-expanded', true);
      document.body.classList.add('is-active-mobile-menu');
      Drupal.dripyard.closeLanguageSwitcher?.();
      Drupal.dripyard.closeSearch?.();
    }
    else {
      popOver.close();
      document.body.classList.remove('is-active-mobile-menu');
    }
  }

  function closePopoverNavigation() {
    toggleNavigationPopoverVisibility(false);
  }

  Drupal.dripyard.closePopoverNavigation = closePopoverNavigation;

  function init(el) {
    mobileNavButton = el.querySelector('.mobile-nav-button');
    popOver = document.getElementById(mobileNavButton.getAttribute('aria-controls'));
    popOverCloseButton = popOver.querySelector('.header-popover__close');

    mobileNavButton.addEventListener('click', toggleNavigationPopoverVisibility);
    popOver.addEventListener('close', syncPopover);
    popOverCloseButton.addEventListener('click', () => popOver.close());
  }

  Drupal.behaviors.glHeader = {
    attach(context) {
      once('site-header', '.site-header', context).forEach(init);
    },
  };

})(Drupal, once);
