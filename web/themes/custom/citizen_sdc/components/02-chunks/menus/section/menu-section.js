((Drupal, once) => {

  Drupal.behaviors.sectionNav = {
    attach: function (context, settings) {
      once('sectionNavigation', '#block-menu-section', context).forEach(sectionMenu => {
   
      });
    }
  }   

})(Drupal, once);
