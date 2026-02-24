(function (Drupal, once) {
  Drupal.behaviors.mainNavigation = {
    attach: function (context, settings) {
      once('mainNav', '#main-menu', context).forEach(mainNav => {
        
      });
    }
  };
})(Drupal, once)
