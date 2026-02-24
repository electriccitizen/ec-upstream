((Drupal, once, _) => {
  const deskMenu = 984;
  const ROOT_NAV_SELECTOR = '#block-menu-main';
  const MAIN_MENU_SELECTOR = '#menu-main';
  const TOGGLE_SELECTOR = '.block-menu__toggle';
  const TOGGLE_ACTIVE_CLASS = 'block-menu__toggle--active';
  const EXPANDED_LI_SELECTOR = 'li.menu-item--expanded';
  const MENU_PARENT_LINK_SELECTOR = '.menu-item__link--menu-parent';
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

  const openMenu = (el) => {
    if (!el) return;
    el.classList.remove(MENU_MAIN_CLOSING_CLASS, MENU_MAIN_HIDDEN_CLASS);
    el.classList.add(MENU_MAIN_OPEN_CLASS);
    const current = el.getBoundingClientRect().height;
    const target = el.scrollHeight;
    if (current === target) return;
    el.style.overflow = 'hidden';
    el.style.height = `${current}px`;
    requestAnimationFrame(() => {
      el.style.transition = 'height 200ms ease';
      el.style.height = `${target}px`;
    });
    const cleanup = () => {
      el.style.transition = '';
      el.style.height = 'auto';
      el.style.overflow = '';
      el.removeEventListener('transitionend', cleanup);
    };
    el.addEventListener('transitionend', cleanup);
    setTimeout(cleanup, 400);
  };

  const closeMenu = (el) => {
    if (!el) return;
    if (el.classList.contains(MENU_MAIN_HIDDEN_CLASS) && !el.classList.contains(MENU_MAIN_OPEN_CLASS)) return;
    const current = el.getBoundingClientRect().height;
    el.style.overflow = 'hidden';
    el.style.height = `${current}px`;
    el.classList.add(MENU_MAIN_CLOSING_CLASS);
    requestAnimationFrame(() => {
      el.style.transition = 'height 200ms ease';
      el.style.height = '0px';
    });
    const cleanup = () => {
      el.style.transition = '';
      el.style.height = '0px';
      el.style.overflow = '';
      el.classList.remove(MENU_MAIN_CLOSING_CLASS);
      el.classList.remove(MENU_MAIN_OPEN_CLASS);
      el.classList.add(MENU_MAIN_HIDDEN_CLASS);
      el.removeEventListener('transitionend', cleanup);
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

  const resetSubmenus = (root) => {
    root.querySelectorAll(EXPANDED_LI_SELECTOR).forEach((li) => {
      li.classList.remove(MENU_OPEN_CLASS, SHIFT_LEFT_CLASS, SHIFT_RIGHT_CLASS);
      const toggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
      const childUl = li.querySelector(':scope > ul');
      setAriaExpanded(toggle, false);
      setAriaHidden(childUl, true);
      if (childUl) {
        childUl.style.height = '0px';
        childUl.style.overflow = '';
        childUl.style.transition = '';
        childUl.style.display = '';
      }
    });
  };

  const openExpandedItem = (li) => {
    if (!li) return;
    const toggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
    const childUl = li.querySelector(':scope > ul');
    li.classList.add(MENU_OPEN_CLASS);
    setAriaExpanded(toggle, true);
    setAriaHidden(childUl, false);
    applyDropdownOverflowClass(childUl, li);
  };

  const closeExpandedItem = (li) => {
    if (!li) return;
    const toggle = li.querySelector(ITEM_TOGGLE_SELECTOR);
    const childUl = li.querySelector(':scope > ul');
    li.classList.remove(MENU_OPEN_CLASS, SHIFT_LEFT_CLASS, SHIFT_RIGHT_CLASS);
    setAriaExpanded(toggle, false);
    setAriaHidden(childUl, true);
  };

  const focusTopLevelItems = (menu) => Array.from(menu.querySelectorAll(':scope > li > a, :scope > li > button, :scope > li > span, :scope > li ' + ITEM_TOGGLE_SELECTOR))
    .filter((el) => el instanceof HTMLElement);

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
              closeMenu(mainMenu);
            } else {
              toggleBtn.classList.add(TOGGLE_ACTIVE_CLASS);
              setAriaExpanded(toggleBtn, true);
              setAriaHidden(mainMenu, false);
              setToggleText(toggleBtn, toggleBtn.dataset.closeText || 'Close Menu');
              openMenu(mainMenu);
            }
          }
          return;
        }

        const itemToggle = target.closest(ITEM_TOGGLE_SELECTOR);
        if (itemToggle) {
          const li = itemToggle.closest(EXPANDED_LI_SELECTOR);
          const childUl = li?.querySelector(':scope > ul');
          if (!li || !childUl) return;
          const isOpen = itemToggle.getAttribute('aria-expanded') === 'true';

          if (modeState.mobile) {
            event.preventDefault();
            if (isOpen) {
              li.classList.remove(MENU_OPEN_CLASS);
              setAriaExpanded(itemToggle, false);
              setAriaHidden(childUl, true);
              closeMenu(childUl);
            } else {
              li.classList.add(MENU_OPEN_CLASS);
              setAriaExpanded(itemToggle, true);
              setAriaHidden(childUl, false);
              openMenu(childUl);
            }
          } else {
            // desktop click/keyboard toggle
            event.preventDefault();
            if (isOpen) {
              closeExpandedItem(li);
            } else {
              openExpandedItem(li);
            }
          }
        }
      });

      nav.addEventListener('mouseover', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest?.(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        openExpandedItem(li);
      });

      nav.addEventListener('mouseout', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest?.(EXPANDED_LI_SELECTOR);
        const related = event.relatedTarget;
        if (!li || !nav.contains(li)) return;
        if (related && li.contains(related)) return;
        closeExpandedItem(li);
      });

      nav.addEventListener('focusin', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest(EXPANDED_LI_SELECTOR);
        if (li && nav.contains(li)) openExpandedItem(li);
      });

      nav.addEventListener('focusout', (event) => {
        if (modeState.mobile) return;
        const li = event.target.closest(EXPANDED_LI_SELECTOR);
        if (!li || !nav.contains(li)) return;
        const related = event.relatedTarget;
        if (related && li.contains(related)) return;
        closeExpandedItem(li);
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
                closeExpandedItem(parentLi);
              } else {
                openExpandedItem(parentLi);
              }
            }
          }

          if (key === 'Escape' && li) {
            event.preventDefault();
            closeExpandedItem(li);
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
})(Drupal, once, drupalSettings?.underscore || window._);
