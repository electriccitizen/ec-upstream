(function (Drupal, once) {

  Drupal.behaviors.cta = {
    attach: function (context, settings) {
      once('callToAction', '.paragraph--type--cta', context).forEach(cta => {
        console.log('cta-ing');
      });
    }
  }

})(Drupal, once);
