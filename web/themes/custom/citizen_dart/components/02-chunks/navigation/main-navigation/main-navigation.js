(function ($, Drupal, once) {
  Drupal.behaviors.main_navigation = {
    attach: function (context, settings) {
      const activeClass = "open";
      const hoverDelay = 200;

      $(once('main-navigation', '#block-main-menu', context)).each(function () {
        const menu = $('.menu-main-navigation', this);
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
        window.setTimeout(() => {
          $element.addClass(activeClass);
        }, noDelay ? 0 : hoverDelay);
      }
      function removeActiveClass($element, noDelay = false) {
        window.setTimeout(() => {
            $element.removeClass(activeClass);
        }, noDelay ? 0 : hoverDelay);
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
