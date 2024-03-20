(function(Drupal, once) {

/* DRAWERS (SHOW MORE)
------------------------------------ */

Drupal.behaviors.drawerBelow = {
  attach: function (context, settings) {
    once('drawer', '.drawer-toggle', context).forEach(drawer => {
      drawer.addEventListener('click', function (e) {
		    e.preventDefault();

		    const closestField = findClosestField(this);
		    const toggleText = closestField.classList.contains('field-dates') ? 'dates' : 'links';

		    if (!this.classList.contains('active-drawer')) {
					this.nextElementSibling.setAttribute('aria-hidden', 'false');
					this.nextElementSibling.classList.add('show-content');
          this.textContent = Drupal.t('See fewer @toggle', {'@toggle': toggleText});
					this.classList.add('active-drawer');
					this.setAttribute('aria-expanded', 'true');
		    } else {
					this.nextElementSibling.setAttribute('aria-hidden', 'true');
					this.nextElementSibling.classList.remove('show-content');
          this.textContent = Drupal.t('See all @toggle', {'@toggle': toggleText});
					this.classList.remove('active-drawer');
					this.setAttribute('aria-expanded', 'false');
		    }
			});//end drawer click

			function findClosestField(element) {
				while (element && !element.classList.contains('field')) {
					element = element.parentElement;
				}
				return element;
			}
    });//end once drawers
  }
};

})(Drupal, once);
