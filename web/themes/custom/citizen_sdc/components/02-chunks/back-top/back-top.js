(function (Drupal, once) {

  /* BACK TO TOP
  ------------------ */
  Drupal.behaviors.backToTop = {
    attach: function (context, settings) {
      once('backTop', '#back-to-top', context).forEach(backTop => {
        const toggleVisibility = () => {
          const shouldShow = window.scrollY > 400;
          backTop.classList.toggle('back-top-button--visible', shouldShow);
        };

        // Run once on attach in case the page is already scrolled.
        toggleVisibility();

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        backTop.addEventListener('click', (event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
  }
})(Drupal, once);
