
(function(Drupal, once) {

	// search toggle
	Drupal.behaviors.searchToggle = {
		attach: function (context, settings) {
			once('tSearch', '.block-site-search', context).forEach(search => {

				const openTrigger = search.querySelector(".t-search");
				const closeTrigger = search.querySelector(".close-search");
				const target = search.querySelector(".t-search-close");
  
				// open search
				const openSearchBlock = (e) => {
			    e.preventDefault();
			    const searchFormWrapper = document.getElementById("search-form-wrapper");

			    if (searchFormWrapper) {
		        searchFormWrapper.classList.add('show-content');
		        searchFormWrapper.setAttribute('aria-hidden', 'false');
			    }

			    if (target) {
		        setTimeout(() => {
		          target.style.display = 'block';
		        }, 300);
			    }

			    // close main menu if open when search is clicked
			    const superfishMainAccordion = document.getElementById("superfish-main-accordion");
			    const superfishMainToggle = document.getElementById("superfish-main-toggle");

			    if (superfishMainAccordion && superfishMainAccordion.classList.contains('sf-expanded')) {
		        superfishMainAccordion.style.display = 'none';
		        setTimeout(() => {
	            superfishMainAccordion.classList.remove('sf-expanded');
	            superfishMainToggle.classList.remove('sf-expanded');
		        }, 200);
				  }
				}//end open search block event

				openTrigger.addEventListener('click', openSearchBlock);

				// close search
				const closeSearchBlock = (e) => {
			    e.preventDefault();
			    if (target) {
			      target.style.display = 'none';
			    }

			    const searchFormWrapper = document.getElementById("search-form-wrapper");

			    if (searchFormWrapper) {
		        setTimeout(() => {
	            searchFormWrapper.classList.remove('show-content');
	            searchFormWrapper.setAttribute('aria-hidden', 'true');
		        }, 200);
			    }
				}//end close search block event

				closeTrigger.addEventListener('click', closeSearchBlock);

			});//end once search
		}
	}

})(Drupal, once);

