
(function($, Drupal, once) {

  // NOTE: Need Jquery because slick is called with Jquery

	Drupal.behaviors.featuredClusters = {
		attach: function (context, settings) {
			$(once('clusters', '.program-clusters.featured-clusters', context)).each(function(){
				$(document).ready(function(){
          console.log('slicking');
					// $('.featured-clusters .view-content').slick({
					// 	adaptiveHeight: false,
					// 	autoplay: true,
					// 	autoplaySpeed: 5000,
          //   slidesToShow: 3,
          //   slidesToScroll: 3,
          //   settings: "slick",
          //   responsive: [
          //     {
          //       breakpoint: 985,
          //       settings: "unslick",
          //     }
          //   ]
					// });
				});//end doc ready
			});//end once stats
		}
	}//end stats

})(jQuery, Drupal, once);
