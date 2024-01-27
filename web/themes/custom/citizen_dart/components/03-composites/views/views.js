(function($, Drupal, once) {

/* Scroll to results if an exposed filter was used & set placeholders for select 2
------------------------------------ */
Drupal.behaviors.viewsScroll = {
  attach: function (context, settings) {
    $(once('wasSearched', '#view-scroll-anchor', context)).each(function(){
      //check if searched
      var urlCurrent = window.location.href;
      if((urlCurrent.indexOf("?f") > -1) || (urlCurrent.indexOf("?c") > -1) || (urlCurrent.indexOf("?s") > -1)){
				$(document).ready(function(){
					setTimeout(function() {
			   			$('html, body').animate({
							scrollTop: $('#view-scroll-anchor').offset().top - 10
			   			});
		   			}, 300);
		 		});
      }
    });
  }
};

//highlight search results
Drupal.behaviors.searchHighlight = {
	attach: function (context, settings) {
	 	$(once('tSearch', '#views-exposed-form-site-search-site-search-block', context)).each(function(){
      //find searched value if not null and highlight each word
      if($('#edit-site-search-api-fulltext', this).val()){
        var searchString = $('#edit-site-search-api-fulltext', this).val().split(' ');
        $.fn.wrapInTag = function(opts) {

          var tag = opts.tag
            , words = opts.words || []
            , regex = RegExp(words.join('|'), 'gi') // case insensitive
            , replacement = '<'+ tag +'>$&</'+ tag +'>';

          return this.html(function() {
            return $(this).text().replace(regex, replacement);
          });
        };
        $('.views-field-body').wrapInTag({
          tag: 'mark class="search-highlight"',
          words: searchString
        });
      }
		});
	}
}

})(jQuery, Drupal, once);
