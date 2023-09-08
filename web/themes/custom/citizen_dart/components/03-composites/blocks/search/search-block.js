
(function($, Drupal, once) {

	// search toggle
	Drupal.behaviors.searchToggle = {
		attach: function (context, settings) {
			$(once('tSearch', '.block-site-search', context)).each( () => {

				const openTrigger = $(".t-search"),
					  closeTrigger = $(".close-search"),
					  target = $(".t-search-close");

				// open search
				const openSearchBlock = (e) => {
					e.preventDefault();
					$("#search-form-wrapper").slideDown('fast').attr('aria-hidden', 'false');
					$(target).delay(300).fadeIn('fast');

					// close main menu if open when search is clicked
					$("#superfish-main-accordion.sf-expanded").slideUp(200);
					setTimeout( () => {
						$("#superfish-main-toggle, #superfish-main-accordion").removeClass('sf-expanded');
					}, 200);
				}
				$(openTrigger).on('click', openSearchBlock);

				// close search
				const closeSearchBlock = (e) => {
					e.preventDefault();
					$(target).fadeOut('fast');
					$("#search-form-wrapper").delay(200).slideUp('fast').attr('aria-hidden', 'true');
				}
				$(closeTrigger).on('click', closeSearchBlock);

			});
		}
	}

})(jQuery, Drupal, once);

