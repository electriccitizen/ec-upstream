(function($, Drupal) {

	/* LAYOUT
	------------------ */
	Drupal.behaviors.removeEmptyThings = {
	  attach: function (context, settings) {
	    $(".layout > .layout__region:not(.ui-sortable)", context).once('removeEmpty').each(function(){
	      if(!$(this).children().length){
	        $(this).remove();
	      }
	    });
	  }
	}

	/* COPYRIGHT
	------------------ */
	Drupal.behaviors.mobileCopyright = {
	  attach: function (context, settings) {
	    $(".block-4", context).once('makeClone').each(function(){
	      $(this).clone(true).appendTo('footer > .footer-inner').addClass('mobile-copy');
	    });
	  }
	}

})(jQuery, Drupal);
