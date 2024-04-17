(function($, Drupal, once) {

/* add secondary and search to mobile menu
--------------------- */
Drupal.behaviors.mobileMenu = {
  attach: function (context, settings) {
    $(once('insertHeaderElements', '.block-superfishmain', context)).each(function() {
      $(document).ready(function() {
        $(window).on('resize', debounce(mobileMenuInsert, 10)).trigger('resize');
      });
    });
  }
};

//function to move blocks to mobile menu
function mobileMenuInsert() {
	var wwidth = $(window).outerWidth();
	if (wwidth < 1161) {
		//if not in desktop or higher, clone the search and secondary menu and move them to the mobile menu
		if(!$('.sf-accordion > li.mobile-search-container').length){
			const $searchContainer = $('.site-header #site-search-form');
      
			// Continue with cloning and moving
			$searchContainer.clone(true)
				.prependTo('.sf-accordion')
				.wrap('<li class="mobile-search-container"></li>')
				.addClass('mobile-search');

      const $quickLinksMenu = $('.site-header #block-quicklinks-menu > .quicklinks-drawer > ul');
      // Continue with cloning and moving
			$quickLinksMenu.clone(true)
				.appendTo('.sf-accordion')
				.wrap('<li class="mobile-quicklinks-container"></li>')
				.addClass('mobile-quicklinks');
		}
	}
}//end mobile menu function

Drupal.behaviors.quickLinks = {
  attach: function (context, settings) {
    once('quicklinks', '.quicklinks-trigger', context).forEach(quicklinks => {
      quicklinks.addEventListener('click', function (e) {
		    e.preventDefault();
		    if (!this.classList.contains('active-drawer')) {
					this.nextElementSibling.setAttribute('aria-hidden', 'false');
					this.nextElementSibling.classList.add('show-content');
					this.classList.add('active-drawer');
					this.setAttribute('aria-expanded', 'true');
		    } else {
					this.nextElementSibling.setAttribute('aria-hidden', 'true');
					this.nextElementSibling.classList.remove('show-content');
					this.classList.remove('active-drawer');
					this.setAttribute('aria-expanded', 'false');
		    }
			});//end trigger click
    });//end once quicklinks
  }
};

/* BACK TO TOP
------------------ */
Drupal.behaviors.backToTop = {
  attach: function (context, settings) {
  	once('backTop', 'html.js', context).forEach(backTop => {
      window.addEventListener('scroll', function() {
        var back = window.innerHeight * 0.8;
        if (window.scrollY > back) {
          document.querySelector('.back-anchor').style.display = 'block';
        } else {
          document.querySelector('.back-anchor').style.display = 'none';
        }
      });
      document.querySelector('.back-anchor a').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: document.body.offsetTop - 10,
          behavior: 'smooth'
        });
      });
    });
  }
}

Drupal.behaviors.footerAnimate = {
  attach: function (context, settings) {
    once('footerAnimate','footer.site-footer', context).forEach(footerAnimate => {
      function handleIntersection(entries, observer) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            //add class when target is visible
            entry.target.classList.add('footer-visible');
            observer.unobserve(entry.target); 
          }
        });
      }
      const observer = new IntersectionObserver(handleIntersection, { threshold: 0.15 });
      observer.observe(footerAnimate);

    });//end once footerAnimate
  }
}

})(jQuery, Drupal, once);
