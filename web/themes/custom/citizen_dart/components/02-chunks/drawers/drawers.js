(function (Drupal, once) {

  /* DRAWERS (SHOW MORE)
  ------------------------------------ */

  Drupal.behaviors.drawerBelow = {
    attach: function (context, settings) {
      once('drawer', '.drawer-toggle', context).forEach(drawer => {
        const drawerID = drawer.getAttribute('aria-controls');
        if (drawer.classList.contains('pre-hide-toggle') ) {
          //find the matching drawer content and if there is one, do something
          const drawerContent = document.getElementById(drawerID);
          if (drawerContent && drawerContent.innerHTML.trim() !== '') {
            drawer.classList.add('visible-drawer');
          } else{
            drawer.remove();
            drawerContent.remove();
          }
        }
        

        drawer.addEventListener('click', function (e) {
          e.preventDefault();

          let toggleText = findToggleType(this);
          if (toggleText = 'Search') {
            toggleText = 'filters';
          } 
          
          if (this.classList.contains('drawer-below')) {
            if (!this.classList.contains('active-drawer')) {
              this.nextElementSibling.setAttribute('aria-hidden', 'false');
              this.nextElementSibling.classList.add('show-content');
              this.textContent = Drupal.t('See fewer @toggle', { '@toggle': toggleText });
              this.classList.add('active-drawer');
              this.setAttribute('aria-expanded', 'true');
            } else {
              this.textContent = Drupal.t('See all @toggle', { '@toggle': toggleText });
              this.classList.remove('active-drawer');
              this.setAttribute('aria-expanded', 'false');
              this.nextElementSibling.setAttribute('aria-hidden', 'true');
              this.nextElementSibling.classList.remove('show-content');
            }
          } else {
            if (!this.classList.contains('active-drawer')) {
              this.previousElementSibling.setAttribute('aria-hidden', 'false');
              this.previousElementSibling.classList.add('show-content');
              this.textContent = Drupal.t('See fewer @toggle', { '@toggle': toggleText });
              this.classList.add('active-drawer');
              this.setAttribute('aria-expanded', 'true');
            } else {
              this.textContent = Drupal.t('See all @toggle', { '@toggle': toggleText });
              this.classList.remove('active-drawer');
              this.setAttribute('aria-expanded', 'false');
              this.previousElementSibling.setAttribute('aria-hidden', 'true');
              this.previousElementSibling.classList.remove('show-content');
            }
          }
        });

        function findToggleType(element) {
          const n = element.textContent.split(' ');
          return n[n.length - 1];
        }
      });
    }
  };

})(Drupal, once);
