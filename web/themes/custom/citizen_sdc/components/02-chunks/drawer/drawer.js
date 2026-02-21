(function (Drupal, once) {

  /* DRAWERS (SHOW MORE)
  ------------------------------------ */
  Drupal.behaviors.drawer = {
    attach: function (context, settings) {
      const focusableSelector = [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable="true"]',
        '[tabindex]'
      ].join(',');

      const toggles = once('drawer', '.drawer-toggle', context);
      if (!toggles.length) {
        return;
      }

      const groups = new Map();

      toggles.forEach((toggle) => {
        const targetId = toggle.getAttribute('aria-controls');
        if (!targetId) {
          return;
        }

        const content = document.getElementById(targetId);

        if (!groups.has(targetId)) {
          groups.set(targetId, { content, toggles: [] });
        }

        groups.get(targetId).toggles.push(toggle);
      });

      groups.forEach(({ content, toggles: relatedToggles }) => {
        if (!content) {
          return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        content.style.overflow = content.style.overflow || 'hidden';
        content.style.height = '0px';

        if (!prefersReducedMotion) {
          content.style.transition = content.style.transition || 'height 300ms ease';
        }

        const setFocusable = (enable) => {
          content.querySelectorAll(focusableSelector).forEach((element) => {
            const datasetKey = 'drawerTabindex';

            if (enable) {
              if (Object.prototype.hasOwnProperty.call(element.dataset, datasetKey)) {
                const previousValue = element.dataset[datasetKey];

                if (previousValue === '') {
                  element.removeAttribute('tabindex');
                }
                else {
                  element.setAttribute('tabindex', previousValue);
                }

                delete element.dataset[datasetKey];
              }
            }
            else if (!Object.prototype.hasOwnProperty.call(element.dataset, datasetKey)) {
              const currentValue = element.getAttribute('tabindex');
              element.dataset[datasetKey] = currentValue !== null ? currentValue : '';
              element.setAttribute('tabindex', '-1');
            }
          });
        };

        const setTogglesState = (isOpen) => {
          relatedToggles.forEach((toggle) => {
            const openText = toggle.dataset.toggleOpen;
            const closeText = toggle.dataset.toggleClose;

            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.classList.toggle('active-drawer', isOpen);
            toggle.textContent = isOpen && closeText ? closeText : openText;
          });
        };

        const openDrawer = () => {
          setFocusable(true);
          content.setAttribute('aria-hidden', 'false');
          setTogglesState(true);

          if (prefersReducedMotion) {
            content.style.height = 'auto';
            return;
          }

          const targetHeight = content.scrollHeight;
          content.style.height = `${targetHeight}px`;

          const finalizeOpen = (event) => {
            if (event.propertyName !== 'height') {
              return;
            }

            content.style.height = 'auto';
            content.removeEventListener('transitionend', finalizeOpen);
          };

          content.addEventListener('transitionend', finalizeOpen);
        };

        const closeDrawer = () => {
          setFocusable(false);
          content.setAttribute('aria-hidden', 'true');
          setTogglesState(false);

          if (prefersReducedMotion) {
            content.style.height = '0px';
            return;
          }

          const currentHeight = content.scrollHeight;
          content.style.height = `${currentHeight}px`;

          // Force reflow so height change is animated from the measured value to 0.
          content.offsetHeight; // eslint-disable-line no-unused-expressions

          content.style.height = '0px';
        };

        // Ensure the drawer starts closed and unfocusable.
        setFocusable(false);
        content.setAttribute('aria-hidden', 'true');
        setTogglesState(false);

        relatedToggles.forEach((toggle) => {
          toggle.addEventListener('click', (event) => {
            event.preventDefault();

            const isOpen = toggle.getAttribute('aria-expanded') === 'true';

            if (isOpen) {
              closeDrawer();
            }
            else {
              openDrawer();
            }
          });
        });
      });
    }
  };

})(Drupal, once);
