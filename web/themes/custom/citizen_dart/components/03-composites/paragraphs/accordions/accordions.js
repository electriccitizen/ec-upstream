(function (Drupal, once) {

  Drupal.behaviors.accordion = {
    attach: function (context, settings) {
      once('accordion', '.field-accordion-items', context).forEach(accord => {
        accord.querySelectorAll('.accordion-header a').forEach(function (link) {
          link.addEventListener('click', function (e) {
            e.preventDefault();

            const activeHeader = this.parentElement;
            const currentActiveAccordion = document.querySelector('.accordion-item.accord-active');

            if (currentActiveAccordion) {
              const activeLongText = currentActiveAccordion.querySelector('.field-long-text');
              activeLongText.classList.remove('show-content');
              activeLongText.setAttribute('aria-hidden', 'true');
              currentActiveAccordion.querySelector('.accordion-header a').setAttribute('aria-expanded', 'false');
              currentActiveAccordion.classList.remove('accord-active');
              // If the clicked header is the currently open accordion, close it
              // and return.
              if (activeHeader === currentActiveAccordion.querySelector('.accordion-header')) {
                return;
              }
            }

            const openAccordion = activeHeader.closest('.accordion-item');
            const openLongText = openAccordion.querySelector('.field-long-text');
            const openHeader = openAccordion.querySelector('.accordion-header a');

            openLongText.classList.add('show-content');
            openLongText.setAttribute('aria-hidden', 'false');
            openHeader.setAttribute('aria-expanded', 'true');
            openAccordion.classList.add('accord-active');

            setTimeout(function () {
              const windowTop = window.scrollY;
              const currentAccordionTop = openAccordion.getBoundingClientRect().top + windowTop;

              if (windowTop > currentAccordionTop) {
                window.scrollTo({
                  top: currentAccordionTop - 100,
                  behavior: 'smooth'
                });
              }
            }, 510);

          });
        });
      });
    }
  }

})(Drupal, once);
