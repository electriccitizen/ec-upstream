(function (Drupal, once) {

  /* HERO VIDEO PLAY/PAUSE
  ---------------------------- */
  const STORAGE_KEY = 'heroVideoPaused';
  const TTL_MS = 30 * 24 * 60 * 60 * 1000;

  function readPreference() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.paused !== 'boolean' || !parsed.expires) return null;
      if (Date.now() > parsed.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed.paused;
    } catch (e) {
      return null;
    }
  }

  function writePreference(paused) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        paused: paused,
        expires: Date.now() + TTL_MS,
      }));
    } catch (e) {
      // Ignore quota / privacy-mode failures.
    }
  }

  Drupal.behaviors.heroPlayPause = {
    attach: function (context, settings) {
      once('heroPlayPause', '[data-hero-playpause]', context).forEach(button => {
        const hero = button.closest('.block--hero');
        const video = hero ? hero.querySelector('.hero__video') : null;
        if (!video) return;

        const setState = (paused) => {
          button.classList.toggle('is-paused', paused);
          button.setAttribute('aria-label', paused
            ? Drupal.t('Play background video')
            : Drupal.t('Pause background video'));
        };

        // Restore stored preference (if any, and not expired).
        const stored = readPreference();
        if (stored === true) {
          video.pause();
          setState(true);
        } else {
          setState(false);
        }

        button.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            setState(false);
            writePreference(false);
          } else {
            video.pause();
            setState(true);
            writePreference(true);
          }
        });
      });
    }
  };
})(Drupal, once);
