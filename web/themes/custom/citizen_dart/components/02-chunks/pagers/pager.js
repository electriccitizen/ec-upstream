(function($, Drupal, once) {
Drupal.behaviors.pager = {
	attach: function (context, settings) {
		$(once('page-menu', '.count-shim', context)).each(function(){
			//add pager counter to results
			var countElement = document.querySelector('.count-shim');
			var pageTotalElement = document.querySelector('.page-total');

			if (countElement) {
		    var count = countElement.innerHTML;
		    if (pageTotalElement) {
	        pageTotalElement.innerHTML = count;
		    }

		    if (count > 7) {
	        var pagerNav = document.querySelector('nav.pager');
	        if (pagerNav) {
            pagerNav.classList.add('results-pager');
            var resultsCount = document.querySelector('.results-count');
            if (resultsCount) {
              resultsCount.parentNode.removeChild(resultsCount);
              var pager = document.querySelector('.pager');
              if (pager) {
                var resultsCountWrapper = document.createElement('div');
                resultsCountWrapper.classList.add('results-count-wrapper');
                pager.insertBefore(resultsCountWrapper, pager.firstChild);
                resultsCountWrapper.appendChild(resultsCount);
              }
            }

            var pagerNumbers = document.querySelectorAll('.pager__number');
            var resultsCountElement = document.querySelector('.results-count');
            if (pagerNumbers && resultsCountElement) {
              pagerNumbers.forEach(function (number) {
                  number.style.display = 'block';
              });
              resultsCountElement.style.display = 'block';
            }
	        }
		    } else {
	        var pagerCurrent = document.querySelector('.pager__current');
	        if (pagerCurrent) {
            pagerCurrent.style.display = 'block';
	        }
		    }
			}//end count element
		});
	}
}//end page menu function

})(jQuery, Drupal, once);
