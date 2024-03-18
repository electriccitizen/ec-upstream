
(function($, Drupal, once) {

  // NOTE: Need Jquery because both the libraries called are with jquery

	Drupal.behaviors.stats = {
		attach: function (context, settings) {
			$(once('stats', '.paragraph--type--stats', context)).each(function(){
				$(document).ready(function(){
          console.log('slicking');
					$('.paragraph--type--stats .field-stats').slick({
						adaptiveHeight: false,
						autoplay: true,
						autoplaySpeed: 5000,
            slidesToShow: 3,
            slidesToScroll: 3,
            settings: "slick",
            responsive: [
              {
                breakpoint: 985,
                settings: "unslick",
              }
            ]
					});
				});//end doc ready
			});//end once stats
		}
	}//end stats

})(jQuery, Drupal, once);
