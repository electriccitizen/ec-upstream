(function ($, Drupal, once) {
  Drupal.behaviors.main_navigation = {
    attach: function (context, settings) {
      const activeClass = "open";
      const rtlClass = "right-to-left";
      const hoverDelay = 200;

      $(once('main-navigation', '#main-menu', context)).each(function () {
        const menu = $('.menu-main-navigation', this);
        let lastSize = $("body").hasClass("size-desk") ? "size-desk" : "size-mobile";
        initializeDropdownAria(menu);

        // Behavior depends on if we're mobile or not. To track this, we set a
        // single class in the body in 04-assembly/global/site.js.
        // "size-desk" indicates desktop size (> 986px wide) and "size-mobile"
        // indicates smaller than that.
        // The menu has two different designs based on which width the screen
        // currently is, and you'll see those checks throughout.

        $("a.nolink", menu).on("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
        })
        $("li", menu).on("mouseenter", addActiveClassCallback);
        $("li", menu).on("mouseleave", removeActiveClassCallback);
        $("a", menu).on("focus", (event) => {
          const $parent = $(event.currentTarget).parent();
          if ($parent.data("skipFocusOpen")) {
            $parent.removeData("skipFocusOpen");
            return;
          }
          const isTopLevel = $parent.parent().is(menu);
          if (isTopLevel) {
            addActiveClass($parent, true);
            // Close all other items.
            removeActiveClass($parent.siblings("li.open"), true);
          }
        })
        $("a", menu).on("blur", (event) => {
          const link = $(event.currentTarget)
          const parentLi = link.parent();
          // Make sure menu items are closed when we leave them. This might be
          // redundant with the "focus" closer above, but just in case we leave
          // the menu itself, we need to double-check.
          if (!link.hasClass("menuparent")) {
            removeActiveClass(parentLi, true);
          }
        });
        $("#main-nav-toggle", this).on("click", (event) => {
          event.stopPropagation();
          event.preventDefault();
          $(event.currentTarget).toggleClass("open");
          menu.toggleClass("accordion--open");
        });
        $(".menu-item-expand", this).on("click", (event) => {
          event.stopPropagation();
          event.preventDefault();
          const parent = $(event.currentTarget).parent();
          toggleDropdown(parent);
        });
        $("a", menu).on("keydown", (event) => {
          handleMenuKeydown(event, menu);
        });
        window.addEventListener("resize", () => {
          if (lastSize == "size-mobile" && $("body").hasClass("size-desk")) {
            $("li", menu).removeClass("open").each(function () {
              syncDropdownAria($(this));
            }).find("ul").hide(0).attr("style", "");
            lastSize = "size-desk";
          }
          else if (lastSize == "size-desk" && $("body").hasClass("size-mobile")) {
            $("li", menu).each(function () {
              syncDropdownAria($(this));
            });
            lastSize = "size-mobile";
          }
        });
      });

      function addActiveClass($element, noDelay = false) {
        if ($("body").hasClass("size-desk")) {
          // Find the list this element is displaying for later visibility
          // check.
          const childList = $element.children("ul");
          window.setTimeout(() => {
            $element.addClass(activeClass);
            syncDropdownAria($element);
            if (childList.length > 0) {
              // If the list is going to run off the side of the page, apply a
              // class that aligns it to the right side of the hovered element,
              // instead of the left.
              const childElement = childList.get(0);
              if (childElement) {
                const childRect = childElement.getBoundingClientRect();
                const viewportWidth = document.documentElement.clientWidth;

                if (childRect.right > viewportWidth) {
                  childList.addClass(rtlClass);
                }
                else {
                  // If screen resolution has changed we need to remove the RTL
                  // class.
                  childList.removeClass(rtlClass);
                }
              }
            }
          }, noDelay ? 0 : hoverDelay);
        }
      }
      function removeActiveClass($element, noDelay = false) {
        if ($("body").hasClass("size-desk")) {
          const childList = $element.children("ul");
          window.setTimeout(() => {
              $element.removeClass(activeClass);
              syncDropdownAria($element);
              if (childList.length > 0) {
                // If the RTL class has been applied, be sure to remove it so it
                // can be re-checked when the parent element is hovered again.
                childList.removeClass(rtlClass);
              }
          }, noDelay ? 0 : hoverDelay);
        }
      }

      function addActiveClassCallback(event) {
        addActiveClass($(event.currentTarget));
      }
      function removeActiveClassCallback(event) {
        removeActiveClass($(event.currentTarget))
      }
      function handleMenuKeydown(event, $menu) {
        const key = event.key;
        const $target = $(event.currentTarget);
        const $item = $target.closest("li");
        if ($item.length === 0) {
          return;
        }
        const isToggle = $target.hasClass("menu-item-expand");
        if (key === " " && isToggle && $item.hasClass(activeClass)) {
          if (focusFirstChild($item)) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        if ((key === "Enter" || key === " ") && isToggle) {
          event.preventDefault();
          event.stopPropagation();
          toggleDropdown($item);
          return;
        }
        if (key === "Escape" || key === "Esc") {
          if (closeClosestDropdown($item)) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        if (key === "Tab") {
          if (focusAdjacentTopLevel($menu, $item, !event.shiftKey)) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        if (key === "ArrowDown" || key === "Down") {
          if (handleVerticalNavigation($menu, $item, true)) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        if (key === "ArrowUp" || key === "Up") {
          if (handleVerticalNavigation($menu, $item, false)) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        if (key === "ArrowRight" || key === "Right") {
          if (openNestedSubmenu($item)) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
        if (key === "ArrowLeft" || key === "Left") {
          if (focusParentFromThirdLevel($item)) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
      function initializeDropdownAria($menu) {
        $menu.find(".menu-item-expand").each(function () {
          const parent = $(this).parent("li");
          syncDropdownAria(parent);
        });
      }
      function syncDropdownAria($listItem) {
        if (!$listItem || $listItem.length === 0) {
          return;
        }
        const $submenu = $listItem.children("ul").first();
        const hasSubmenu = $submenu.length > 0;
        const isOpen = $listItem.hasClass(activeClass);
        const $mobileToggle = $listItem.children(".menu-item-expand").first();
        const $desktopToggle = $listItem.children("a.menuparent").first();
        const isDesktop = $("body").hasClass("size-desk");
        const $activeControl = isDesktop ? $desktopToggle : $mobileToggle;
        const $inactiveControl = isDesktop ? $mobileToggle : $desktopToggle;

        if ($inactiveControl.length > 0) {
          $inactiveControl.removeAttr("aria-haspopup");
          $inactiveControl.removeAttr("aria-expanded");
        }

        if ($activeControl.length > 0 && hasSubmenu) {
          $activeControl.attr("aria-haspopup", "true");
          $activeControl.attr("aria-expanded", isOpen ? "true" : "false");
        }

        if (hasSubmenu) {
          $submenu.attr("aria-hidden", isOpen ? "false" : "true");
        }
        else {
          if ($activeControl.length > 0) {
            $activeControl.removeAttr("aria-haspopup");
            $activeControl.removeAttr("aria-expanded");
          }
          $submenu.removeAttr("aria-hidden");
        }
      }
      function focusAdjacentTopLevel($menu, $currentItem, moveForward = true) {
        const $topLevelItems = $menu.children("li");
        if ($topLevelItems.length === 0) {
          return false;
        }
        const $topLevel = getTopLevelParent($currentItem, $menu);
        if ($topLevel.length === 0) {
          return false;
        }
        const currentIndex = $topLevelItems.index($topLevel);
        if (currentIndex < 0) {
          return false;
        }
        if (moveForward && currentIndex === $topLevelItems.length - 1) {
          return false;
        }
        if (!moveForward && currentIndex === 0) {
          return false;
        }
        const nextIndex = currentIndex + (moveForward ? 1 : -1);
        return focusItemLink($topLevelItems.eq(nextIndex));
      }
      function handleVerticalNavigation($menu, $currentItem, moveForward = true) {
        const $currentList = $currentItem.parent("ul");
        if ($currentList.length === 0) {
          return false;
        }
        if ($currentList.is($menu)) {
          if (!moveForward) {
            return false;
          }
          return focusFirstChild($currentItem);
        }
        const $items = $currentList.children("li");
        if ($items.length === 0) {
          return false;
        }
        const currentIndex = $items.index($currentItem);
        const nextIndex = currentIndex + (moveForward ? 1 : -1);
        if (nextIndex >= 0 && nextIndex < $items.length) {
          return focusItemLink($items.eq(nextIndex));
        }
        if (!moveForward && currentIndex === 0) {
          const $parentItem = $currentList.parent("li");
          return focusItemLink($parentItem);
        }
        return false;
      }
      function openNestedSubmenu($item) {
        if (!$item.hasClass("item-level-2")) {
          return false;
        }
        return focusFirstChild($item);
      }
      function focusParentFromThirdLevel($item) {
        const $parentList = $item.parent("ul");
        if ($parentList.length === 0) {
          return false;
        }
        const $parentItem = $parentList.parent("li");
        if ($parentItem.length === 0 || !$parentItem.hasClass("item-level-2")) {
          return false;
        }
        return focusItemLink($parentItem);
      }
      function focusFirstChild($item) {
        const $submenu = $item.children("ul");
        if ($submenu.length === 0) {
          return false;
        }
        openDropdown($item);
        const $firstChild = $submenu.children("li").first();
        return focusItemLink($firstChild);
      }
      function focusItemLink($item) {
        if ($item.length === 0) {
          return false;
        }
        const $link = $item.children("a, .menu-item-expand").first();
        if ($link.length === 0) {
          return false;
        }
        const linkNode = $link.get(0);
        if (linkNode && typeof linkNode.focus === "function") {
          linkNode.focus();
        }
        else {
          $link.trigger("focus");
        }
        return true;
      }
      function toggleDropdown($item) {
        if ($item.hasClass(activeClass)) {
          closeDropdown($item);
        }
        else {
          openDropdown($item);
        }
      }
      function openDropdown($item) {
        if ($item.hasClass(activeClass)) {
          return false;
        }
        $item.addClass(activeClass);
        syncDropdownAria($item);
        const $submenu = $item.children("ul");
        if ($submenu.length > 0) {
          if ($("body").hasClass("size-mobile")) {
            $submenu.stop(true, true).slideDown(200);
          }
          else {
            $submenu.attr("style", "");
          }
        }
        return true;
      }
      function closeDropdown($item) {
        if (!$item.hasClass(activeClass)) {
          return false;
        }
        $item.removeClass(activeClass);
        syncDropdownAria($item);
        const $submenu = $item.children("ul");
        if ($submenu.length > 0) {
          if ($("body").hasClass("size-mobile")) {
            $submenu.stop(true, true).slideUp(200);
          }
          else {
            $submenu.attr("style", "");
          }
        }
        return true;
      }
      function closeClosestDropdown($item) {
        const $openAncestor = $item.hasClass(activeClass) ? $item : $item.parents("li." + activeClass).first();
        if ($openAncestor.length === 0) {
          return false;
        }
        closeDropdown($openAncestor);
        $openAncestor.data("skipFocusOpen", true);
        focusItemLink($openAncestor);
        return true;
      }
      function getTopLevelParent($item, $menu) {
        const $ancestors = $item.parentsUntil($menu, "li");
        if ($ancestors.length === 0) {
          return $item;
        }
        return $ancestors.last();
      }
    },
  }
})(jQuery, Drupal, once)
