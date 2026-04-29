((Drupal, once) => {
  const ROOT_NAV_SELECTOR = '#block-menu-secondary';
  const EXPANDED_LI_SELECTOR = 'li.menu-item--expanded';
  const ITEM_TOGGLE_SELECTOR = '.menu-item__toggle';
  const MENU_OPEN_CLASS = 'menu-item--open';

  const setAriaExpanded = (btn, state) => {
    if (btn) btn.setAttribute('aria-expanded', state ? 'true' : 'false');
  };

  const setAriaHidden = (el, state) => {
    if (el) el.setAttribute('aria-hidden', state ? 'true' : 'false');
  };

  const setToggleText = (btn, text) => {
    if (!btn || !text) return;
    const span = btn.querySelector('.visually-hidden');
    if (span) {
      span.textContent = text;
    } else {
      btn.textContent = text;
    }
  };

  const setSubmenuState = (li, open) => {
    if (!li) return;
    const toggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
    const childUl = li.querySelector(':scope > ul');
    if (!toggle || !childUl) return;
    li.classList.toggle(MENU_OPEN_CLASS, open);
    setAriaExpanded(toggle, open);
    setAriaHidden(childUl, !open);
    setToggleText(toggle, open ? toggle.dataset.collapseLabel : toggle.dataset.expandLabel);
  };

  const resetSubmenus = (root) => {
    root.querySelectorAll(EXPANDED_LI_SELECTOR).forEach((li) => setSubmenuState(li, false));
  };

  Drupal.behaviors.secondaryNavigation = {
    attach(context) {
      const nav = once('secondaryNav', context.querySelectorAll(ROOT_NAV_SELECTOR)).pop();
      if (!nav) return;

      // Toggle button click — flip the open state on its parent li.
      // Closing siblings before opening keeps only one dropdown open at a time.
      nav.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const itemToggle = target.closest(ITEM_TOGGLE_SELECTOR);
        if (!itemToggle) return;
        const li = itemToggle.closest(EXPANDED_LI_SELECTOR);
        if (!li) return;
        const isOpen = itemToggle.getAttribute('aria-expanded') === 'true';
        event.preventDefault();
        if (!isOpen) resetSubmenus(nav);
        setSubmenuState(li, !isOpen);
      });

      // Mouse hover open/close — handled in JS (rather than CSS :hover) so
      // .menu-item--open stays the single source of truth and explicit
      // closes (Escape, toggle click) aren't overridden.
      nav.addEventListener('mouseover', (event) => {
        const li = event.target.closest?.(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        setSubmenuState(li, true);
      });

      nav.addEventListener('mouseout', (event) => {
        const li = event.target.closest?.(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        const related = event.relatedTarget;
        if (related && li.contains(related)) return;
        setSubmenuState(li, false);
      });

      // Click outside the menu closes anything left open.
      document.addEventListener('click', (event) => {
        if (nav.contains(event.target)) return;
        resetSubmenus(nav);
      });

      // Escape closes the focused submenu and returns focus to its toggle.
      nav.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        const activeEl = document.activeElement;
        if (!(activeEl instanceof HTMLElement)) return;
        const li = activeEl.closest(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        event.preventDefault();
        setSubmenuState(li, false);
        li.querySelector(ITEM_TOGGLE_SELECTOR)?.focus();
      });
    },
  };
})(Drupal, once);
