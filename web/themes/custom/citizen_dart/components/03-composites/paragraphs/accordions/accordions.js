(function (Drupal, once) {

  Drupal.behaviors.accordion = {
    attach: function (context, settings) {
      once('accordion', '.field-accordion-items', context).forEach(accord => {
        accord.querySelectorAll('.accordion-header a').forEach(function (link) {
          link.addEventListener('click', function (e) {
            e.preventDefault();

            console.log(this);

            //expand/collapse
            if (this.classList.contains('collapsed')) {
              this.classList.remove('collapsed');
              this.classList.add('expanded');
              this.setAttribute('aria-expanded', 'true');

              const content = this.parentElement.nextElementSibling;
              content.classList.remove('collapse');
              content.classList.add('expand');
              content.setAttribute('aria-hidden', 'false');

              // Set max-height to 0 initially, then to scrollHeight after a tiny delay
              content.style.maxHeight = '0px';
              setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
              }, 10); // Small delay to trigger the transition
            } else {
              this.classList.remove('expanded');
              this.classList.add('collapsed');
              this.setAttribute('aria-expanded', 'false');

              const content = this.parentElement.nextElementSibling;
              content.style.maxHeight = content.scrollHeight + 'px'; // Set current height

              content.classList.remove('expand');
              content.classList.add('collapse');
              content.setAttribute('aria-hidden', 'true');

              // Ensure smooth transition by setting initial max-height if expanded on load
              setTimeout(() => {
                content.style.maxHeight = '0px'; // Collapse to 0px
              }, 10);
            }

          });
        });
      });
    }
  }

})(Drupal, once);
