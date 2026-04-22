/**
 * @file
 * Gallery paragraph behaviors.
 *
 * Phase A port — kept on jQuery / slick / featherlight to match the dart
 * implementation 1:1. Phase B will replace both libraries with vanilla JS.
 */
(function ($, Drupal, once) {

  Drupal.behaviors.citizenSdcGallery = {
    attach: function (context) {
      // Lightbox — featherlightGallery groups by the `rel=` attribute.
      once('gallery-lightbox', '.paragraph--gallery--lightbox', context).forEach(function (el) {
        $('.featherlight-gal', el).featherlightGallery({
          previousIcon: '<',
          nextIcon: '>',
          galleryFadeIn: 300,
          openSpeed: 300,
        });
      });

      // Slider — slick-wraps the items container.
      once('gallery-slider', '.paragraph--gallery--slider', context).forEach(function (el) {
        $('.paragraph--gallery__wrap', el).slick({
          adaptiveHeight: true,
          autoplay: true,
          autoplaySpeed: 5000,
        });
        $('button.slick-prev, button.slick-next', el).addClass('material-icons');
      });
    }
  };

})(jQuery, Drupal, once);
