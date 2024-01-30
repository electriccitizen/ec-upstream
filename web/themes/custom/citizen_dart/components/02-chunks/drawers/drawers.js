(function($, Drupal, once) {

/* DRAWERS (SHOW MORE)
------------------------------------ */

Drupal.behaviors.drawerBelow = {
  attach: function (context, settings) {
    $(once('modal_window', '.drawer-toggle', context)).each(function(){
      this.addEventListener('click', function (e) {
		    e.preventDefault();

		    const closestField = findClosestField(this);
		    const toggleText = closestField.classList.contains('field-dates') ? 'dates' : 'links';

		    if (!this.classList.contains('active-drawer')) {
					this.nextElementSibling.setAttribute('aria-hidden', 'false');
					this.nextElementSibling.classList.add('show-content');
					this.textContent = `See fewer ${toggleText}`;
					this.classList.add('active-drawer');
					this.setAttribute('aria-expanded', 'true');
		    } else {
					this.nextElementSibling.setAttribute('aria-hidden', 'true');
					this.nextElementSibling.classList.remove('show-content');
					this.textContent = `See all ${toggleText}`;
					this.classList.remove('active-drawer');
					this.setAttribute('aria-expanded', 'false');
		    }
			});

			function findClosestField(element) {
				while (element && !element.classList.contains('field')) {
					element = element.parentElement;
				}
				return element;
			}
    });
  }
};

})(jQuery, Drupal, once);
