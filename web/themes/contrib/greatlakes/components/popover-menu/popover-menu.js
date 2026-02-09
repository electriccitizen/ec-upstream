/**
 * @file
 * Primary menu interactions.
 */
((Drupal, once) => {
  let popoverMenu;
  let contentMainRight;

  /**
   * Close all submenus.
   */
  function closeAllSubmenus() {
    popoverMenu.querySelectorAll('[aria-expanded="true"]').forEach(button => {
      button.setAttribute('aria-expanded', false);
      contentMainRight.classList.remove('visibility-hidden');
    });
  }

  Drupal.dripyard = Drupal.dripyard || {};
  Drupal.dripyard.closeAllSubmenus = closeAllSubmenus;

  /**
   * Checks if the popover is wide (where submenus appear to the right), or
   * mobile (where submenus appear underneath).
   *
   * @returns {boolean}
   */
  function isNarrowPopover() {
    return window.getComputedStyle(document.querySelector('.header-popover'), ':after').getPropertyValue('content').replace(/\"/g, '') === 'mobile';
  }

  /**
   * Toggles the `aria-expanded` attribute for every <button> within the
   * popover. Also handles the hiding/showing of the content right region
   * when in "wide" mode.
   *
   * @param {event} e - Click event object
   */
  function toggleButtonState({ currentTarget: button }) {
    const currentState = button.getAttribute('aria-expanded') === 'true';

    if (button.matches('.popover-menu__list-item--level-1 > *')) {
      closeAllSubmenus();
    }

    // Hide content right region, as this is where the submenus go.
    if (!currentState && !isNarrowPopover()) {
      contentMainRight.classList.add('visibility-hidden',);
    }
    button.setAttribute('aria-expanded', !currentState);
  }

  /**
   * Initialize everything.
   *
   * @param {HTMLElement} el - The popover <dialog> element.
   */
  function init(el) {
    popoverMenu = el;
    contentMainRight = document.querySelector('.header-popover__main-right-content');
    popoverMenu.querySelectorAll('[aria-expanded]').forEach(el => el.addEventListener('click', toggleButtonState));
  }

  Drupal.behaviors.popoverMenu = {
    attach(context) {
      once('popover-menu', '.popover-menu', context).forEach(init);
    },
  };
})(Drupal, once);
