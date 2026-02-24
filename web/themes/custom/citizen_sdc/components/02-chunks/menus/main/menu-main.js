((Drupal, once) => {
  const deskMenu = 984;
  const ROOT_NAV_SELECTOR = '#block-menu-main';
  const MAIN_MENU_SELECTOR = '#menu-main';
  const TOGGLE_SELECTOR = '.block-menu__toggle';
  const TOGGLE_ACTIVE_CLASS = 'block-menu__toggle--active';
  const EXPANDED_LI_SELECTOR = 'li.menu-item--expanded';
  const ITEM_TOGGLE_SELECTOR = '.menu-item__toggle';
  const MENU_OPEN_CLASS = 'menu-item--open';
  const SHIFT_LEFT_CLASS = 'menu-item--dropdown-shift-left';
  const SHIFT_RIGHT_CLASS = 'menu-item--dropdown-shift-right';
  const MOBILE_SEARCH_CLASS = 'menu-item--mobile-search';
  const MOBILE_SECONDARY_CLASS = 'menu-item--mobile-secondary';
  const MENU_MAIN_OPEN_CLASS = 'menu-main--open';
  const MENU_MAIN_HIDDEN_CLASS = 'menu-main--hidden';
  const MENU_MAIN_CLOSING_CLASS = 'menu-main--closing';
  const SECONDARY_MENU_SELECTOR = '#menu-secondary';
  const MOBILE_SEARCH_HTML = `
    <li class="menu-item menu-item__level-1 ${MOBILE_SEARCH_CLASS}">
      <a href="/site-search" class="menu-item__link">Search</a>
    </li>`;

  const isMobile = () => window.innerWidth < deskMenu;

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

  const applyDropdownOverflowClass = (ul, li) => {
    if (!ul || !li) return;
    li.classList.remove(SHIFT_LEFT_CLASS, SHIFT_RIGHT_CLASS);
    const rect = ul.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    if (rect.right > vw) {
      li.classList.add(SHIFT_LEFT_CLASS);
    } else if (rect.left < 0) {
      li.classList.add(SHIFT_RIGHT_CLASS);
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

  const ensureMobileExtras = (menuUl) => {
    if (!menuUl) return;
    if (!menuUl.querySelector(`.${MOBILE_SEARCH_CLASS}`)) {
      menuUl.insertAdjacentHTML('beforeend', MOBILE_SEARCH_HTML.trim());
    }
    if (menuUl.querySelector(`.${MOBILE_SECONDARY_CLASS}`)) return;
    const secondary = document.querySelector(SECONDARY_MENU_SELECTOR);
    if (secondary) {
      const wrapper = document.createElement('li');
      wrapper.className = `menu-item menu-item__level-1 ${MOBILE_SECONDARY_CLASS}`;
      const cloneUl = document.createElement('ul');
      cloneUl.className = 'menu menu--secondary-clone';
      secondary.querySelectorAll(':scope > li').forEach((li) => {
        const cloned = li.cloneNode(true);
        cloned.classList.remove('menu-item__level-1');
        const anchor = cloned.querySelector('a');
        if (anchor) {
          anchor.classList.remove('menu-item__link');
        }
        cloneUl.appendChild(cloned);
      });
      wrapper.appendChild(cloneUl);
      menuUl.appendChild(wrapper);
    }
  };

  const removeMobileExtras = (menuUl) => {
    if (!menuUl) return;
    menuUl.querySelectorAll(`.${MOBILE_SEARCH_CLASS}, .${MOBILE_SECONDARY_CLASS}`).forEach((li) => li.remove());
  };

  const setSubmenuState = (li, open, { animate = false, manageOverflow = false } = {}) => {
    if (!li) return;
    const toggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
    const childUl = li.querySelector(':scope > ul');
    if (!toggle || !childUl) return;
    li.classList.toggle(MENU_OPEN_CLASS, open);
    if (!open) li.classList.remove(SHIFT_LEFT_CLASS, SHIFT_RIGHT_CLASS);
    setAriaExpanded(toggle, open);
    setAriaHidden(childUl, !open);
    setToggleText(toggle, open ? 'Collapse Menu' : 'Expand Menu');
    if (manageOverflow && open) applyDropdownOverflowClass(childUl, li);
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

  const debounce = Drupal.debounce
    ? Drupal.debounce
    : (fn, wait = 150) => {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn.apply(undefined, args), wait);
        };
      };

  Drupal.behaviors.mainNavigation = {
    attach(context) {
      const nav = once('mainNav', context.querySelectorAll(ROOT_NAV_SELECTOR)).pop();
      if (!nav) return;

      const mainMenu = nav.querySelector(MAIN_MENU_SELECTOR);
      const toggleBtn = nav.querySelector(TOGGLE_SELECTOR);
      if (!mainMenu || !toggleBtn) return;

      const modeState = { mobile: null };
      let lastInputWasPointer = false;

      const setDesktopMode = () => {
        toggleBtn.removeAttribute('aria-expanded');
        mainMenu.removeAttribute('aria-hidden');
        toggleBtn.classList.remove(TOGGLE_ACTIVE_CLASS);
        setToggleText(toggleBtn, toggleBtn.dataset.openText || 'Open Menu');
        mainMenu.style.height = '';
        mainMenu.classList.remove(MENU_MAIN_OPEN_CLASS, MENU_MAIN_HIDDEN_CLASS);
        removeMobileExtras(mainMenu);
        resetSubmenus(nav);
        nav.querySelectorAll(`${MAIN_MENU_SELECTOR} ul`).forEach((ul) => { ul.style.height = ''; });
        modeState.mobile = false;
      };

      const setMobileMode = () => {
        setAriaExpanded(toggleBtn, false);
        setAriaHidden(mainMenu, true);
        toggleBtn.classList.remove(TOGGLE_ACTIVE_CLASS);
        setToggleText(toggleBtn, toggleBtn.dataset.openText || 'Open Menu');
        mainMenu.style.height = '0px';
        mainMenu.classList.remove(MENU_MAIN_OPEN_CLASS);
        mainMenu.classList.add(MENU_MAIN_HIDDEN_CLASS);
        resetSubmenus(nav);
        nav.querySelectorAll(`${MAIN_MENU_SELECTOR} ul`).forEach((ul) => { ul.style.height = '0px'; });
        ensureMobileExtras(mainMenu);
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

      nav.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target === toggleBtn || toggleBtn.contains(target)) {
          event.preventDefault();
          if (modeState.mobile) {
            const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            if (expanded) {
              toggleBtn.classList.remove(TOGGLE_ACTIVE_CLASS);
              setAriaExpanded(toggleBtn, false);
              setAriaHidden(mainMenu, true);
              setToggleText(toggleBtn, toggleBtn.dataset.openText || 'Open Menu');
              mainMenu.classList.add(MENU_MAIN_CLOSING_CLASS);
              animateHeight(mainMenu, false, () => {
                mainMenu.classList.remove(MENU_MAIN_OPEN_CLASS);
                mainMenu.classList.remove(MENU_MAIN_CLOSING_CLASS);
                mainMenu.classList.add(MENU_MAIN_HIDDEN_CLASS);
              });
            } else {
              toggleBtn.classList.add(TOGGLE_ACTIVE_CLASS);
              setAriaExpanded(toggleBtn, true);
              setAriaHidden(mainMenu, false);
              setToggleText(toggleBtn, toggleBtn.dataset.closeText || 'Close Menu');
              mainMenu.classList.remove(MENU_MAIN_CLOSING_CLASS, MENU_MAIN_HIDDEN_CLASS);
              mainMenu.classList.add(MENU_MAIN_OPEN_CLASS);
              animateHeight(mainMenu, true);
            }
          }
          return;
        }

        const itemToggle = target.closest(ITEM_TOGGLE_SELECTOR);
        if (itemToggle) {
          const li = itemToggle.closest(EXPANDED_LI_SELECTOR);
          if (!li) return;
          const isOpen = itemToggle.getAttribute('aria-expanded') === 'true';
          event.preventDefault();
          if (modeState.mobile) {
            setSubmenuState(li, !isOpen, { animate: true });
          } else {
            setSubmenuState(li, !isOpen, { animate: false, manageOverflow: !isOpen });
          }
        }
      });

      nav.addEventListener('pointerdown', () => { lastInputWasPointer = true; });
      nav.addEventListener('keydown', () => { lastInputWasPointer = false; });

      nav.addEventListener('mouseover', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest?.(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        setSubmenuState(li, true, { manageOverflow: true, animate: false });
      });

      nav.addEventListener('mouseout', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest?.(EXPANDED_LI_SELECTOR);
        const related = event.relatedTarget;
        if (!li || !nav.contains(li)) return;
        if (related && li.contains(related)) return;
        setSubmenuState(li, false, { animate: false });
      });

      nav.addEventListener('focusin', (event) => {
        if (modeState.mobile) return;
        if (!lastInputWasPointer) return;
        const li = event.target.closest(EXPANDED_LI_SELECTOR);
        if (li && nav.contains(li)) setSubmenuState(li, true, { manageOverflow: true, animate: false });
      });

      nav.addEventListener('focusout', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        const related = event.relatedTarget;
        if (related && li.contains(related)) return;
        setSubmenuState(li, false, { animate: false });
      });

      nav.addEventListener('keydown', (event) => {
        const activeEl = document.activeElement;
        if (!(activeEl instanceof HTMLElement)) return;

        if (!modeState.mobile) {
          const key = event.key;
          const li = activeEl.closest(EXPANDED_LI_SELECTOR);
          if (key === 'Enter' || key === ' ') {
            const toggle = activeEl.closest(ITEM_TOGGLE_SELECTOR);
            if (toggle) {
              event.preventDefault();
              const parentLi = toggle.closest(EXPANDED_LI_SELECTOR);
              const open = toggle.getAttribute('aria-expanded') === 'true';
              if (open) {
                setSubmenuState(parentLi, false, { animate: false });
              } else {
                setSubmenuState(parentLi, true, { manageOverflow: true, animate: false });
              }
            }
          }

          if (key === 'Escape' && li) {
            event.preventDefault();
            setSubmenuState(li, false, { animate: false });
            const parentToggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
            parentToggle?.focus();
          }

          const topItems = focusTopLevelItems(mainMenu);
          const idx = topItems.indexOf(activeEl);
          if (idx !== -1 && (key === 'ArrowRight' || key === 'ArrowLeft')) {
            event.preventDefault();
            const dir = key === 'ArrowRight' ? 1 : -1;
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
        }
      });
    },
  };
})(Drupal, once);
