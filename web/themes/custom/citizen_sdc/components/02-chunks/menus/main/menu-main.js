(function (Drupal, once) {
  Drupal.behaviors.mainNavigation = {
    attach: function (context, settings) {
      once('mainNav', '#block-menu-main', context).forEach(mainNavBlock => {
        
      });
    }
  };
})(Drupal, once)
