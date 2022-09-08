(function ($, Drupal) {

/* PREVIEW ACTION & FIXED
----------------------- */
Drupal.behaviors.previewAction = {
    attach: function (context, settings) {
    $('#edit-citizen-preview--2', context).once('has-preview').each(function () {
            //trigger preview
          $(this).on('click',function (e) {
            e.preventDefault();
            $('.responsive-preview-icon-active').trigger('click');
          });
        });
  }
};

})(jQuery, Drupal, drupalSettings);
