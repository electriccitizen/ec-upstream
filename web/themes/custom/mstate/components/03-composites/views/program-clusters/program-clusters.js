
(function($, Drupal, once) {

  // NOTE: Need Jquery because slick is called with Jquery

	Drupal.behaviors.featuredClusters = {
		attach: function (context, settings) {
			$(once('clusters', '.program-clusters.featured-clusters', context)).each(function(){
        console.log('clusters');
				$(document).ready(function(){
					$('.program-clusters.featured-clusters .view-content').slick({
						adaptiveHeight: false,
						autoplay: true,
						autoplaySpeed: 5000,
            slidesToShow: 4,
            slidesToScroll: 1,
            settings: "slick",
            responsive: [
              {
                breakpoint: 1440,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
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
