(function($, Drupal, once) {


	Drupal.behaviors.alerts = {
		attach: function (context, settings) {
			once('alerts', '.alerts.block-1 .views-row', context).forEach(alertRow => {
        const $alertRow = $(alertRow); // Reference the current alert row
        const alertId = $alertRow.data('id'); // Assume each row has a unique data-id
        const closeButton = $alertRow.find('a.close-x'); // Find the close button inside the alert row
        const alertStateKey = `alertState-${alertId}`; // Unique key for this alert
        const savedState = localStorage.getItem(alertStateKey);

        // If the alert is marked as closed in local storage, remove it
        if (savedState === 'closed') {
          $alertRow.remove();
          return; // Skip further processing for this alert
        }

        // Handle the click event on the close button
        once('buttonClick', closeButton, context).forEach(button => {
          button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default link behavior
            $alertRow.remove(); // Remove the alert row
            localStorage.setItem(alertStateKey, 'closed'); // Save state in local storage
          });
        });
      });
      
		}
	}

})(jQuery, Drupal, once);