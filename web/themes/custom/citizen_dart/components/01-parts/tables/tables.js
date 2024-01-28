(function($, Drupal, once) {

/* RESPONSIVE TABLES WITH BASIC TABLE
------------------------------------ */
Drupal.behaviors.basicTable = {
	attach: function (context, settings) {
		$(once('responsive_table', '.layout-container table:not(.ui-datepicker-calendar)', context)).each(function(){
			$(this).basictable({breakpoint: 760,});
			
			var theadElements = this.getElementsByTagName('thead');

			if (theadElements.length === 0) {
			  this.classList.add('no-header');
			}
		});
	}
};

})(jQuery, Drupal, once);
