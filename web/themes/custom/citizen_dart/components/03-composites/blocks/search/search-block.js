
(function($, Drupal, once) {

	// search toggle
	Drupal.behaviors.searchToggle = {
		attach: function (context, settings) {
			$(once('tSearch', '.block-site-search', context)).each( () => {

				const openTrigger = document.querySelector(".t-search");
				const closeTrigger = document.querySelector(".close-search");
				const target = document.querySelector(".t-search-close");

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
				}

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
				}

				closeTrigger.addEventListener('click', closeSearchBlock);


			});
		}
	}

})(jQuery, Drupal, once);

