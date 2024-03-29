
(function($, Drupal, once) {

  // NOTE: Need Jquery because slick is called with jquery

	Drupal.behaviors.stats = {
		attach: function (context, settings) {
			$(once('stats', '.paragraph--type--stats', context)).each(function(){
				$(document).ready(function(){
					$('.paragraph--type--stats .field-stats').slick({
						adaptiveHeight: false,
						autoplay: true,
						autoplaySpeed: 5000,
            slidesToShow: 3,
            slidesToScroll: 3,
            settings: "slick",
            responsive: [
              {
                breakpoint: 1264,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                }
              },
              {
                breakpoint: 800,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]
					});
				});//end doc ready
			});//end once stats
		}
	}//end stats

})(jQuery, Drupal, once);
