(function($, Drupal, once) {

Drupal.behaviors.sectionMenu = {
	attach: function (context, settings) {
		$(once('section-menu', '#block-section-menu', context)).each(function(){
			//mobile toggle
			$('.section-menu-toggle').on('click', function(e){
				e.preventDefault();
		      if ( $(window).outerWidth() < 980 ) {
		        if ( $(this).is('.active-nav') ) {
		          $(this).attr('aria-expanded', 'false').removeClass('active-nav').find('.material-icons').html('menu').closest('#section-menu-title').next('#section-menu-wrapper').attr('aria-hidden', 'true').slideUp('fast');
		        } else {
		          $(this).attr('aria-expanded', 'true').addClass('active-nav').find('.material-icons').html('close').closest('#section-menu-title').next('#section-menu-wrapper').attr('aria-hidden', 'false').slideDown('fast');
		        }
		      }
			});

			$(window).on('resize', Drupal.debounce(mobileSectionNav, 150, false));

			//need doc ready because active-class script fires after theme scripts
			$(document).ready(function(){
				$('#section-menu-wrapper ul li').each(function(){
					//find nested lists and set their parents and expanders
					if (($('ul', this).length) && (!$('.expander:first', this).length) ) {
					  $(this).addClass('parent').prepend('<a href="#" class="expander" aria-expanded="false" role="button" aria-label="Section Submenu Expander"></a>').find(' > a:not(.expander)').next('ul').attr('aria-hidden', 'true');
					}

					//find active links and set the active trail
					$('.is-active', this).removeAttr('href').siblings('ul').slideDown('fast').attr('aria-hidden', 'false').end().parentsUntil('#section-menu-wrapper > ul').addClass('active-trail expanded');

					//find active-trail li and add aria expanded role to the expander
					$('li.active-trail > .expander').attr('aria-expanded', "true").siblings('ul').attr('aria-hidden', 'false');
				});

				//set button roles, tab indexes and key presses on sidebar links
				$(document).on('click','#section-menu-wrapper .expander',function(e){
					e.preventDefault();
          if ( $(this).attr('aria-expanded') == 'false' ) {
            $(this).attr('aria-expanded', "true").siblings('ul').slideDown('fast').attr('aria-hidden', 'false').end().closest('li').addClass('expanded');
          } else {
            $(this).attr('aria-expanded', "false").siblings('ul').slideUp('fast').attr('aria-hidden', 'true').end().closest('li').removeClass('expanded');
          }
				});
			});
		});
	}
}//end section menu function

function mobileSectionNav() {

  let width = $(window).outerWidth();
  const sectionMenuToggle = $(".section-menu-toggle");
  const sectionMenuWrapper = $("#section-menu-wrapper");

  if (width < 980) {
  	$(sectionMenuToggle).attr('href','#');
    //add aria roles to menu title and wrapper if not already set by click above
    if ( !$(sectionMenuToggle).attr('aria-controls') ) {
      $(sectionMenuToggle).attr({
        'aria-controls': 'section-menu-wrapper',
        'aria-expanded': 'false'
      });
      $(sectionMenuWrapper).attr('aria-hidden', 'true');
    }
  } else {
  	console.log('desk');
    //strip all aria roles & prevent click
    $(sectionMenuToggle).removeAttr('aria-controls aria-expanded role href');
    $(sectionMenuWrapper).removeAttr('aria-hidden');
  }
}

})(jQuery, Drupal, once);
