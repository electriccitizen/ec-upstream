
(function($, Drupal, once) {

  // NOTE: Need Jquery because both the libraries called are jquery

	//Swipebox script for lightbox images.
	Drupal.behaviors.gallery = {
		attach: function (context, settings) {
			//Featherlight
			$(once('lightboxes', '.gallery-type.lightbox', context)).each(function(){
				$(document).ready(function(){
					$('.featherlight-gal', this).featherlightGallery({
						previousIcon: '<',
						nextIcon: '>',
						galleryFadeIn: 300,
						openSpeed: 300
					});
				});
			});// end once light boxes
			//Slider
			$(once('slider', '.gallery-type.slider', context)).each(function(){
				$(document).ready(function(){
					$('.field-gallery-items', this).slick({
						adaptiveHeight: true,
						autoplay: true,
						autoplaySpeed: 5000
					});
					$('button.slick-prev').addClass('material-icons');
					$('button.slick-next').addClass('material-icons');
				});
			});//end once slider
		}
	}

})(jQuery, Drupal, once);
