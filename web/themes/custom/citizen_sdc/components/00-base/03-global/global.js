
// Modern vanilla JS behaviors (no jQuery dependency).
(function (Drupal, once) {
  
  Drupal.behaviors.widthCheck = {
    attach: function (context, settings) {
      once('desktopSizing', 'body', context).forEach(() => {
        // Get desktop width from CSS vars set in 00-base/00-variables/_units.scss.
        const rootStyles = window.getComputedStyle(document.documentElement);
        const cssDeskWidth = rootStyles.getPropertyValue('--desk-size');
        const fallbackDeskWidth = '984px';
        const deskWidth = Number.parseInt(cssDeskWidth || fallbackDeskWidth, 10);
        let currentSize = '';

        const widthCheck = () => {
          const oldSize = currentSize;
          const bodyWidth = document.documentElement.clientWidth;
          currentSize = bodyWidth >= deskWidth ? 'desk' : 'mobile';

          if (oldSize !== currentSize) {
            document.body.classList.remove(`size-${oldSize}`);
            document.body.classList.add(`size-${currentSize}`);
          }
        };

        widthCheck();
        window.addEventListener('resize', widthCheck);
      });
    }
  }

})(Drupal, once);
