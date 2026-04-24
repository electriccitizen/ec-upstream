((Drupal, once) => {
  const deskMenu = 984;
  const ROOT_NAV_SELECTOR = '#block-menu-support-book';
  const SECTION_MENU_SELECTOR = '#menu-support-book';
  const TOGGLE_SELECTOR = '#support-book-menu-toggle';
  const TOGGLE_ACTIVE_CLASS = 'block-menu__toggle--active';
  const ITEM_TOGGLE_SELECTOR = '.menu-item__toggle';
  const EXPANDED_LI_SELECTOR = 'li.menu-item--expanded';
  const MENU_OPEN_CLASS = 'menu-item--open';
  const MENU_SECTION_OPEN_CLASS = 'menu--open';
  const MENU_SECTION_HIDDEN_CLASS = 'menu--hidden';
  const MENU_SECTION_CLOSING_CLASS = 'menu--closing';

  const isMobile = () => window.innerWidth < deskMenu;

  const setAriaExpanded = (el, state) => {
    if (el) el.setAttribute('aria-expanded', state ? 'true' : 'false');
  };

  const setAriaHidden = (el, state) => {
    if (el) el.setAttribute('aria-hidden', state ? 'true' : 'false');
  };

  const setToggleText = (btn, text) => {
    if (!btn || !text) return;
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = text;
    } else {
      btn.textContent = text;
    }
  };

  const animateHeight = (el, opening, onEnd) => {
    if (!el) return;
    const current = el.getBoundingClientRect().height;
    const target = opening ? el.scrollHeight : 0;
    el.style.overflow = 'hidden';
    el.style.height = `${current}px`;
    requestAnimationFrame(() => {
      el.style.transition = 'height 200ms ease';
      el.style.height = `${target}px`;
    });

    const cleanup = () => {
      el.style.transition = '';
      el.style.overflow = '';
      el.style.height = opening ? 'auto' : '0px';
      el.removeEventListener('transitionend', cleanup);
      if (onEnd) onEnd();
    };

    el.addEventListener('transitionend', cleanup);
    setTimeout(cleanup, 400);
  };

  const setSubmenuState = (li, open, { animate = true } = {}) => {
    if (!li) return;
    const toggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
    const childUl = li.querySelector(':scope > ul');
    if (!toggle || !childUl) return;

    li.classList.toggle(MENU_OPEN_CLASS, open);
    setAriaExpanded(toggle, open);
    setAriaHidden(childUl, !open);
    setToggleText(toggle, open ? Drupal.t('Collapse Menu') : Drupal.t('Expand Menu'));

    if (animate) {
      animateHeight(childUl, open);
    } else {
      childUl.style.height = open ? 'auto' : '0px';
    }
  };

  const resetSubmenus = (root) => {
    root.querySelectorAll(EXPANDED_LI_SELECTOR).forEach((li) => setSubmenuState(li, false, { animate: false }));
  };

  const focusTopLevelItems = (menu) => Array.from(menu.querySelectorAll(':scope > li')).map((li) => {
    const control = li.querySelector(':scope > .menu-item__toggle, :scope > a, :scope > button, :scope > [tabindex]');
    return control instanceof HTMLElement ? control : null;
  }).filter(Boolean);

  const debounce = (typeof _ !== 'undefined' && _.debounce)
    ? _.debounce
    : (fn, wait = 150) => {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn.apply(undefined, args), wait);
        };
      };

  Drupal.behaviors.sectionNav = {
    attach(context) {
      const nav = once('sectionNavigation', context.querySelectorAll(ROOT_NAV_SELECTOR)).pop();
      if (!nav) return;

      const sectionMenu = nav.querySelector(SECTION_MENU_SELECTOR);
      const toggleBtn = nav.querySelector(TOGGLE_SELECTOR);
      if (!sectionMenu || !toggleBtn) return;

      const modeState = { mobile: null };
      let mobileTitleItem = null;

      const addMobileTitleLink = () => {
        if (mobileTitleItem) return;
        const titleLink = nav.querySelector('.block-menu__title > a');
        if (!titleLink) return;

        const clonedLink = titleLink.cloneNode(true);
        clonedLink.classList.add('menu-item__link');

        const li = document.createElement('li');
        li.classList.add('menu-item', 'menu-item__level-1');
        li.appendChild(clonedLink);

        sectionMenu.prepend(li);
        mobileTitleItem = li;
      };

      const removeMobileTitleLink = () => {
        if (mobileTitleItem && mobileTitleItem.parentElement === sectionMenu) {
          sectionMenu.removeChild(mobileTitleItem);
        }
        mobileTitleItem = null;
      };

      const setDesktopMode = () => {
        toggleBtn.removeAttribute('aria-expanded');
        sectionMenu.removeAttribute('aria-hidden');
        toggleBtn.classList.remove(TOGGLE_ACTIVE_CLASS);
        setToggleText(toggleBtn, toggleBtn.dataset.openText || Drupal.t('Open Menu'));
        sectionMenu.style.height = '';
        sectionMenu.classList.remove(MENU_SECTION_OPEN_CLASS, MENU_SECTION_HIDDEN_CLASS, MENU_SECTION_CLOSING_CLASS);
        nav.querySelectorAll(`${SECTION_MENU_SELECTOR} ul`).forEach((ul) => { ul.style.height = ''; });
        resetSubmenus(nav);
        removeMobileTitleLink();
        modeState.mobile = false;
      };

      const setMobileMode = () => {
        addMobileTitleLink();
        setAriaExpanded(toggleBtn, false);
        setAriaHidden(sectionMenu, true);
        toggleBtn.classList.remove(TOGGLE_ACTIVE_CLASS);
        setToggleText(toggleBtn, toggleBtn.dataset.openText || Drupal.t('Open Menu'));
        sectionMenu.style.height = '0px';
        sectionMenu.classList.remove(MENU_SECTION_OPEN_CLASS, MENU_SECTION_CLOSING_CLASS);
        sectionMenu.classList.add(MENU_SECTION_HIDDEN_CLASS);
        nav.querySelectorAll(`${SECTION_MENU_SELECTOR} ul`).forEach((ul) => { ul.style.height = '0px'; });
        resetSubmenus(nav);
        modeState.mobile = true;
      };

      const handleModeChange = () => {
        const nowMobile = isMobile();
        if (modeState.mobile === nowMobile) return;
        if (nowMobile) {
          setMobileMode();
        } else {
          setDesktopMode();
        }
      };

      handleModeChange();
      window.addEventListener('resize', debounce(handleModeChange, 150));

      const handleSectionToggle = (event) => {
        event.preventDefault();
        if (!modeState.mobile) return;
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';

        if (expanded) {
          toggleBtn.classList.remove(TOGGLE_ACTIVE_CLASS);
          setAriaExpanded(toggleBtn, false);
          setAriaHidden(sectionMenu, true);
          setToggleText(toggleBtn, toggleBtn.dataset.openText || Drupal.t('Open Menu'));
          sectionMenu.classList.add(MENU_SECTION_CLOSING_CLASS);
          animateHeight(sectionMenu, false, () => {
            sectionMenu.classList.remove(MENU_SECTION_OPEN_CLASS, MENU_SECTION_CLOSING_CLASS);
            sectionMenu.classList.add(MENU_SECTION_HIDDEN_CLASS);
          });
        } else {
          toggleBtn.classList.add(TOGGLE_ACTIVE_CLASS);
          setAriaExpanded(toggleBtn, true);
          setAriaHidden(sectionMenu, false);
          setToggleText(toggleBtn, toggleBtn.dataset.closeText || Drupal.t('Close Menu'));
          sectionMenu.classList.remove(MENU_SECTION_CLOSING_CLASS, MENU_SECTION_HIDDEN_CLASS);
          sectionMenu.classList.add(MENU_SECTION_OPEN_CLASS);
          animateHeight(sectionMenu, true);
        }
      };

      toggleBtn.addEventListener('click', handleSectionToggle);

      nav.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const itemToggle = target.closest(ITEM_TOGGLE_SELECTOR);
        if (!itemToggle) return;
        const li = itemToggle.closest(EXPANDED_LI_SELECTOR);
        if (!li) return;
        event.preventDefault();
        const isOpen = itemToggle.getAttribute('aria-expanded') === 'true';
        setSubmenuState(li, !isOpen, { animate: true });
      });

      nav.addEventListener('keydown', (event) => {
        const activeEl = document.activeElement;
        if (!(activeEl instanceof HTMLElement)) return;

        const key = event.key;
        const li = activeEl.closest(EXPANDED_LI_SELECTOR);

        if (key === 'Enter' || key === ' ') {
          const toggle = activeEl.closest(ITEM_TOGGLE_SELECTOR);
          if (toggle) {
            event.preventDefault();
            const parentLi = toggle.closest(EXPANDED_LI_SELECTOR);
            const open = toggle.getAttribute('aria-expanded') === 'true';
            setSubmenuState(parentLi, !open, { animate: true });
          }
        }

        if (key === 'Escape' && li) {
          event.preventDefault();
          setSubmenuState(li, false, { animate: true });
          li.querySelector(ITEM_TOGGLE_SELECTOR)?.focus();
        }

        const topItems = focusTopLevelItems(sectionMenu);
        const idx = topItems.indexOf(activeEl);
        if (idx !== -1 && (key === 'ArrowDown' || key === 'ArrowUp')) {
          event.preventDefault();
          const dir = key === 'ArrowDown' ? 1 : -1;
          const next = (idx + dir + topItems.length) % topItems.length;
          topItems[next].focus();
        }

        if ((key === 'ArrowDown' || key === 'ArrowUp') && li) {
          const childUl = li.querySelector(':scope > ul');
          if (childUl && li.classList.contains(MENU_OPEN_CLASS)) {
            const focusables = childUl.querySelectorAll('a, button, [tabindex]');
            if (focusables.length) {
              event.preventDefault();
              const targetIndex = key === 'ArrowDown' ? 0 : focusables.length - 1;
              focusables[targetIndex].focus();
            }
          }
        }
      });
    },
  };
})(Drupal, once);
