(function(Drupal, once) {


/* BACK TO TOP
------------------ */
Drupal.behaviors.backToTop = {
  attach: function (context, settings) {
  	once('backTop', 'html.js', context).forEach(backTop => {
      window.addEventListener('scroll', function() {
        var back = window.innerHeight * 0.8;
        if (window.scrollY > back) {
          document.querySelector('.back-anchor').style.display = 'block';
        } else {
          document.querySelector('.back-anchor').style.display = 'none';
        }
      });
      document.querySelector('.back-anchor a').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: document.body.offsetTop - 10,
          behavior: 'smooth'
        });
      });
    });
  }
}

})(Drupal, once);
