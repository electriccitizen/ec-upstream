(function(Drupal, once) {

  Drupal.behaviors.cta = {
    attach: function (context, settings) {
      once('cta','.paragraph--type--call-to-action', context).forEach(cta => {
        const target = document.querySelector('.paragraph--type--call-to-action');
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('cta-visible');
            } else {
              entry.target.classList.remove('cta-visible');
            }
          });
        });
        observer.observe(target);
      });//end once cta
    }
  }
  
  })(Drupal, once);
  