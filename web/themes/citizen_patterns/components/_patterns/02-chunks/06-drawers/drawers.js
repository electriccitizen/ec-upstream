(function($, Drupal) {

/* DRAWERS (SHOW MORE)
------------------------------------ */
Drupal.behaviors.drawerAbove = {
	attach: function (context, settings) {
		$('.drawer-toggle.drawer-above', context).once('modal_window').each(function(){
      $(this).click(function(e){
        e.preventDefault();
        if($(this).closest('.field').hasClass('field-dates')){
          var toggleText = 'dates';
        }else{
          var toggleText = 'links';
        }
        if(!$(this).is('.active-drawer')){
          $(this).prev('.drawer-content').slideDown(300).attr('aria-hidden','false').addClass('open-drawer').end().text('See fewer ' + toggleText).addClass('active-drawer').attr('aria-expanded', 'true');
        }else{
          $(this).prev('.drawer-content').slideUp(300).attr('aria-hidden','true').removeClass('open-drawer').end().text('See all ' + toggleText).removeClass('active-drawer').attr('aria-expanded', 'false');
        }
      });
		});
	}
};

Drupal.behaviors.drawerBelow = {
  attach: function (context, settings) {
    $('.drawer-toggle.drawer-below', context).once('modal_window').each(function(){
      $(this).click(function(e){
        e.preventDefault();
        if($(this).closest('.field').hasClass('field-dates')){
          var toggleText = 'dates';
        }else{
          var toggleText = 'links';
        }
        if(!$(this).is('.active-drawer')){
          $(this).next('.drawer-content').slideDown(300).attr('aria-hidden','false').addClass('open-drawer').end().text('See fewer ' + toggleText).addClass('active-drawer').attr('aria-expanded', 'true');
        }else{
          $(this).next('.drawer-content').slideUp(300).attr('aria-hidden','true').removeClass('open-drawer').end().text('See all ' + toggleText).removeClass('active-drawer').attr('aria-expanded', 'false');
        }
      });
    });
  }
};

})(jQuery, Drupal);
