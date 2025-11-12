
(function ($, Drupal, once) {

  Drupal.behaviors.nodeGallery = {
    attach: function (context, settings) {
      $(once('nodeSlider', '.field-fair-images', context)).each(function () {
        $(document).ready(function () {
          $('.field-fair-images', this).slick({
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 5000,
          });
          $('button.slick-prev, button.slick-next').addClass('material-icons');
        });
      });
    }
  }

})(jQuery, Drupal, once);
