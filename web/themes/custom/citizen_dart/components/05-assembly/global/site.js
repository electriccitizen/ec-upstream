(function($, Drupal, once) {

/* LAYOUT 
------------------ */
Drupal.behaviors.removeEmptyRegions = {
  attach: function (context, settings) {
    $(once('removeEmpty', '.layout > .layout__region:not(.layout-builder__region)', context)).each(function(){
      if(!$(this).children().length){
        $(this).remove();
      }
    });
  }
}

/* BACK TO TOP
------------------ */
Drupal.behaviors.backToTop = {
  attach: function (context, settings) {
  	$(once('backTop', 'html.js', context)).each(function() {
      $(window).scroll(function() {
        var back = $(window).height() * .8;
        if ($(this).scrollTop() > back ) {
          $('.back-anchor').fadeIn(200);
        }else{
          $('.back-anchor').fadeOut(200);
        }
      });
      //scroll to toc
      $('.back-anchor a').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $('body').offset().top - 10
        });
      });
    });
  }
}

/* TOOLBAR POSITION
------------------ */
Drupal.behaviors.toolbarPosition = {
  attach: function (context, settings) {
    $(once('toolbar-position', '[id=block-toolbarposition]', context)).each( () => {
      
      const toolbar = $("[id=block-toolbarposition]");
      const layout = $(".main-page-content");
      const overflow = $(".overflow-guard");
      const key = $(toolbar).find(".field-toolbar-position").html();
      const tasks = ("[id=block-citizen-dart-local-tasks]");
      const message = $(".drupal-message");

      function runToolbar() {
        if ( $(toolbar).length ) {
          if ( key != 1 ) {
            $(layout).addClass('toolbar-bottom');
            $(overflow).addClass('toolbar-bottom-push');

            if ( $(message).length ) {
              $(overflow).css({
                'padding-bottom' : $(tasks).outerHeight() + $(message).outerHeight() + 'px',
              });
            } else {
              $(overflow).css({
                'padding-bottom' : $(tasks).outerHeight() + 'px',
              });
            }
          }
        }
      }

      $(window).on('load', runToolbar);

    });
  }
}

})(jQuery, Drupal, once);
