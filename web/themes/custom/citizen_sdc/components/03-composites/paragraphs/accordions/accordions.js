/**
 * @file
 * Accordion toggle behavior. One listener per `[data-accordions]` wrapper.
 * Click on a `.paragraph--accordions__toggle` button expands/collapses its
 * `.paragraph--accordions__panel` sibling-within-item. Only one item can be
 * open at a time — opening one closes any sibling that's currently expanded.
 * The transition itself is pure CSS (`grid-template-rows: 0fr → 1fr` on the
 * panel); JS just toggles the `.is-expanded` / `.is-collapsed` classes and
 * keeps ARIA state + `inert` in sync. No height measurement, no inline
 * styles — grid-rows sizes itself from content and adapts if content height
 * changes after open (late-loading images, embeds).
 * `transitionend` drives the scroll-into-view follow-up so timing stays
 * coupled to the CSS duration.
 * ARIA: `aria-expanded` on the toggle, `inert` on the panel (removed when
 * expanded — `inert` alone handles hiding from AT and tab order, no
 * redundant `aria-hidden`).
 * Keyboard: click/Enter/Space toggle (native button); ↑/↓ move focus to
 * sibling toggles, Home/End jump to first/last (WAI-ARIA accordion pattern).
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
    panel.removeAttribute('inert');
  };

  const closeItem = (item, toggle, panel) => {
    item.classList.remove('is-expanded');
    item.classList.add('is-collapsed');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('inert', '');
  };

  // After the open transition completes (layout has settled), scroll the
  // toggle into view if it ended up off-screen — happens when a sibling
  // was open above and its collapse pushed the clicked item up past the
  // viewport top. Uses `transitionend` so we stay coupled to CSS duration.
  const ensureToggleVisibleWhenDone = (toggle, panel) => {
    const onEnd = (event) => {
      if (event.propertyName !== 'grid-template-rows') return;
      panel.removeEventListener('transitionend', onEnd);

      const rect = toggle.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
      if (isVisible) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      toggle.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    };
    panel.addEventListener('transitionend', onEnd);
  };

  // Focus a sibling toggle — supports ArrowUp/ArrowDown (wrap) + Home/End
  // per the WAI-ARIA accordion pattern.
  const focusSibling = (wrapper, currentToggle, direction) => {
    const toggles = Array.from(wrapper.querySelectorAll(TOGGLE_SELECTOR));
    const count = toggles.length;
    if (count === 0) return;

    const currentIndex = toggles.indexOf(currentToggle);
    let nextIndex;
    switch (direction) {
      case 'next': nextIndex = (currentIndex + 1) % count; break;
      case 'prev': nextIndex = (currentIndex - 1 + count) % count; break;
      case 'first': nextIndex = 0; break;
      case 'last': nextIndex = count - 1; break;
      default: return;
    }
    toggles[nextIndex].focus();
  };

  Drupal.behaviors.citizenAccordions = {
    attach(context) {
      once('citizenAccordions', WRAPPER_SELECTOR, context).forEach((wrapper) => {
        wrapper.querySelectorAll(ITEM_SELECTOR).forEach((item) => {
          const toggle = item.querySelector(TOGGLE_SELECTOR);
          const panel = item.querySelector(PANEL_SELECTOR);
          if (!toggle || !panel) return;

          toggle.addEventListener('click', () => {
            const isCollapsed = item.classList.contains('is-collapsed');

            if (isCollapsed) {
              // Close any currently-expanded siblings so only one item is
              // open at a time.
              wrapper.querySelectorAll(`${ITEM_SELECTOR}.is-expanded`).forEach((other) => {
                if (other === item) return;
                const otherToggle = other.querySelector(TOGGLE_SELECTOR);
                const otherPanel = other.querySelector(PANEL_SELECTOR);
                if (otherToggle && otherPanel) {
                  closeItem(other, otherToggle, otherPanel);
                }
              });

              openItem(item, toggle, panel);
              ensureToggleVisibleWhenDone(toggle, panel);
            }
            else {
              closeItem(item, toggle, panel);
            }
          });

          toggle.addEventListener('keydown', (event) => {
            switch (event.key) {
              case 'ArrowDown':
                event.preventDefault();
                focusSibling(wrapper, toggle, 'next');
                break;
              case 'ArrowUp':
                event.preventDefault();
                focusSibling(wrapper, toggle, 'prev');
                break;
              case 'Home':
                event.preventDefault();
                focusSibling(wrapper, toggle, 'first');
                break;
              case 'End':
                event.preventDefault();
                focusSibling(wrapper, toggle, 'last');
                break;
            }
          });
        });
      });
    },
  };
})(Drupal, once);
