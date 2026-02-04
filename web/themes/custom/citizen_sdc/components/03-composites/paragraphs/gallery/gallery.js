(function ($, Drupal, once) {

  // NOTE: Need jQuery for both slider libraries.

  Drupal.behaviors.gallery = {
    attach: function (context, settings) {
      // Featherlight.
      $(once('lightboxes', '.gallery-type.lightbox', context)).each(function () {
        $(document).ready(function () {
          $('.featherlight-gal', this).featherlightGallery({
            previousIcon: '<',
            nextIcon: '>',
            galleryFadeIn: 300,
            openSpeed: 300,
          });
        });
      });
      // Slider.
      $(once('slider', '.field-gallery-items', context)).each(function () {
        $(document).ready(() => {
          $(this).slick({
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 5000,
          });
          $('button.slick-prev, button.slick-next', this.closest('.gallery')).addClass('material-icons');
        });
      });
    }
  }

})(jQuery, Drupal, once);
