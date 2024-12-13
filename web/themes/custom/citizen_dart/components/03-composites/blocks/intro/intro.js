(function($, Drupal, once) {

	// jump links (i want to)
	Drupal.behaviors.jumpLinks = {
		attach: function (context, settings) {
			once('jumpLinks', '.block-intro', context).forEach(jumpLinks => {
        
				const jumpTrigger = jumpLinks.querySelector(".select-jump");
        jumpTrigger.onchange = (event) => {
          const destination = event.target.value;
          window.location.href = destination;
	      }

        // Target video and control button
      const video = $(context).find('.field-video-background video').get(0);
      const toggleButton = $(once('videoControlBehavior', context.querySelectorAll('.video-motion-toggle')));

      // Helper to check localStorage
      const videoStateKey = 'videoPlaybackState';
      const savedState = localStorage.getItem(videoStateKey);

      // Apply saved state (if exists)
      if (savedState === 'paused' && video) {
        video.pause();
        once('buttonClicked', toggleButton, context).forEach(buttonClicked => {
          buttonClicked.textContent = 'Play Video';
          buttonClicked.setAttribute('state', 'paused');
        });
      }

      // Handle click event on toggle button
      once('buttonClick', toggleButton, context).forEach(button => {
        button.addEventListener('click', function (e) {
          e.preventDefault();

          if (video.paused) {
            video.play();
            button.textContent = 'Pause Video';
            button.setAttribute('state', 'playing');
            localStorage.setItem(videoStateKey, 'playing');
          } else {
            video.pause();
            button.textContent = 'Play Video';
            button.setAttribute('state', 'paused');
            localStorage.setItem(videoStateKey, 'paused');
          }
        });
      });

			});//end once intro
      
		}
	}

})(jQuery, Drupal, once);

