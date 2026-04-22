/**
 * @file
 * Accordion toggle behavior. One listener per `[data-accordions]` wrapper.
 * Click on a `.paragraph--accordions__toggle` button expands/collapses its
 * `.paragraph--accordions__panel` sibling-within-item. Only one item can be
 * open at a time within a wrapper — opening one closes any sibling that's
 * currently expanded. Transitions via inline `max-height` so the panel
 * animates between 0 and its natural content height. ARIA state
 * (`aria-expanded`, `aria-hidden`, `inert`) stays in sync with visual state.
 */
((Drupal, once) => {
  'use strict';

  const WRAPPER_SELECTOR = '[data-accordions]';
  const ITEM_SELECTOR = '.paragraph--accordions__item';
  const TOGGLE_SELECTOR = '.paragraph--accordions__toggle';
  const PANEL_SELECTOR = '.paragraph--accordions__panel';

  const openItem = (item, toggle, panel) => {
    item.classList.remove('is-collapsed');
    item.classList.add('is-expanded');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    panel.removeAttribute('inert');

    // Start at 0, then set scrollHeight on next tick so the transition runs.
    panel.style.maxHeight = '0px';
    setTimeout(() => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }, 10);
  };

  // Slightly longer than the max-height transition (600ms in SCSS). After
  // the close-siblings + open animations finish, the layout has settled so
  // the clicked header's final viewport position is known.
  const SCROLL_DELAY_MS = 650;

  // If the clicked header ends up off-screen (common when a sibling was open
  // far above and its panel just collapsed, pushing the page up), scroll
  // so the header is back in view. Respects prefers-reduced-motion.
  const ensureToggleVisible = (toggle) => {
    setTimeout(() => {
      const rect = toggle.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
      if (isVisible) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      toggle.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, SCROLL_DELAY_MS);
  };

  const closeItem = (item, toggle, panel) => {
    item.classList.remove('is-expanded');
    item.classList.add('is-collapsed');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');

    // Set the current height explicitly first, then 0 on next tick so the
    // transition has a start value to animate from.
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    setTimeout(() => {
      panel.style.maxHeight = '0px';
    }, 10);
  };

  Drupal.behaviors.citizenAccordions = {
    attach(context) {
      once('citizenAccordions', WRAPPER_SELECTOR, context).forEach((wrapper) => {
        wrapper.querySelectorAll(ITEM_SELECTOR).forEach((item) => {
          const toggle = item.querySelector(TOGGLE_SELECTOR);
          const panel = item.querySelector(PANEL_SELECTOR);
          if (!toggle || !panel) return;

          toggle.addEventListener('click', (event) => {
            event.preventDefault();
            const isCollapsed = item.classList.contains('is-collapsed');

            if (isCollapsed) {
              // Close any currently-expanded siblings in this wrapper first
              // so only one item is open at a time.
              wrapper.querySelectorAll(`${ITEM_SELECTOR}.is-expanded`).forEach((other) => {
                if (other === item) return;
                const otherToggle = other.querySelector(TOGGLE_SELECTOR);
                const otherPanel = other.querySelector(PANEL_SELECTOR);
                if (otherToggle && otherPanel) {
                  closeItem(other, otherToggle, otherPanel);
                }
              });

              openItem(item, toggle, panel);
              // After the layout settles (sibling close + open), scroll the
              // toggle back into view if the reflow pushed it off-screen.
              ensureToggleVisible(toggle);
            }
            else {
              closeItem(item, toggle, panel);
            }
          });
        });
      });
    },
  };
})(Drupal, once);
