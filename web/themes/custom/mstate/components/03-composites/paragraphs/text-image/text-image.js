
(function(Drupal, once) {

	Drupal.behaviors.textImage = {
		attach: function (context, settings) {
			once('textImage','.paragraph--type--text-image', context).forEach(textImage => {

        function handleIntersection(entries, observer) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              //add class when target is visible
              entry.target.classList.add('ti-visible');
              observer.unobserve(entry.target); // Stop observing once the class is added
            }
          });
        }
        // Create an intersection observer
        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.15 });
        // Select the target element
        // Start observing the target element
        observer.observe(textImage);

      });//end once text-image
		}
	}//end stats

})(Drupal, once);
