(function ($, Drupal, once) {
  Drupal.behaviors.main_navigation = {
    attach: function (context, settings) {
      const activeClass = "open";
      const hoverDelay = 200;

      $(once('main-navigation', '#block-main-menu', context)).each(function () {
        const menu = $('.menu-main-navigation', this);

        // Behavior depends on if we're mobile or not. To track this, we set a
        // single class in the body in 04-assembly/global/site.js.
        // "size-desk" indicates desktop size (> 986px wide) and "size-mobile"
        // indicates smaller than that.
        // The menu has two different designs based on which width the screen
        // currently is, and you'll see those checks throughout.

        $("li", menu).on("mouseenter", addActiveClassCallback);
        $("li", menu).on("mouseleave", removeActiveClassCallback);
        $("a, span.nolink", menu).on("focus", (event) => {
          addActiveClass($(event.currentTarget).parent(), true);
        })
        $("a, span.nolink", menu).on("blur", (event) => {
          // Some extra logic to determine if we need to move into the child
          // link tree if we're tabbing past a menu item.
          const link = $(event.currentTarget)
          const parentLi = link.parent();
          if (link.hasClass("menuparent")) {
            event.stopPropagation();
            $("li", parentLi).get(0).focus();
          }
          else {
            if (!parentLi.hasClass("item-level-1") && parentLi.is(":last-child")) {
              // Find the parent LI of the parent and move to that.
              const grandparentLi = parentLi.parent().parent();
              event.stopPropagation();
              removeActiveClass(parentLi, true);
              removeActiveClass(grandparentLi, true);
              grandparentLi.next().focus();
            }
            removeActiveClass(parentLi, true);
          }
        });
        $("#main-nav-toggle", this).on("click", (event) => {
          event.stopPropagation();
          $(event.currentTarget).toggleClass("open");
          menu.toggleClass("accordion-open");
        })
      });

      function addActiveClass($element, noDelay = false) {
        if ($("body").hasClass("size-desk")) {
          window.setTimeout(() => {
            $element.addClass(activeClass);
          }, noDelay ? 0 : hoverDelay);
        }
      }
      function removeActiveClass($element, noDelay = false) {
        if ($("body").hasClass("size-desk")) {
          window.setTimeout(() => {
              $element.removeClass(activeClass);
          }, noDelay ? 0 : hoverDelay);
        }
      }

      function addActiveClassCallback(event) {
        addActiveClass($(event.currentTarget));
      }
      function removeActiveClassCallback(event) {
        removeActiveClass($(event.currentTarget))
      }
    },
  }
})(jQuery, Drupal, once)
