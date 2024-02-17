(function ($, Drupal, once) {

  /* Add paragraph preview labels
  ----------------------- */
  Drupal.behaviors.previewLabel = {
    attach: function (context, settings) {
    	$(once('isParaPreview', '.lp-builder .paragraph--view-mode--preview', context)).each(function(){
    		var label = $(this).attr('data-type');
    		if (typeof label !== 'undefined') {
	    		$(this).prepend('<div class="para-preview-label">' + label.replace(/_/g, ' ') + ' widget</div>');
	    	}
    	});
    }
  };

})(jQuery, Drupal, once);
