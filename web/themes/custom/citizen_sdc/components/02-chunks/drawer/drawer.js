(function (Drupal, once) {

  /* DRAWERS (SHOW MORE)
  ------------------------------------ */
  Drupal.behaviors.drawer = {
    attach: function (context, settings) {
      once('drawer', '.drawer-toggle', context).forEach(drawer => {
        
      });
    }
  };

})(Drupal, once);
