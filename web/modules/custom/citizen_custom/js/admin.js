(function($, Drupal) {

	/* CONTENT PLACER SELECT LIST FUNCTIONALITY
	----------------------- */
	Drupal.behaviors.contentPlacer = {
	  attach: function (context, settings) {
		$('.field--name-field-content-type .js-form-type-select', context).once('isContentPlacer').each(function(){
		  $('.field--name-field-content-type').nextAll('.field--widget-options-select').hide();
		  $(document).ajaxComplete(function() {
			$('.field--name-field-content-type .js-form-type-select').each(function(){
				$(this).find('select').change(function(){
					var chosen = $(this).find("option:selected").val().replace(/_/g, '-');
					$('.field--name-field-content-type').nextAll('.field--widget-options-select').hide();
					$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-list-type').show();
				});
			});
			$('.field--name-field-content-type .js-form-type-select').each(function(){
				$(this).find('select').change(function(){
					var chosen = $(this).find("option:selected").val().replace(/_/g, '-');
					$('.field--name-field-content-type').nextAll('.field--widget-options-select').hide();
					$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-list-type').show();
				});
			});
			$( "div[class*='-list-type']").each(function(){
				$(this).find('select').change(function(){
					var typeChosen = $(this).find("option:selected").val().replace(/_/g, '-');
					var chosen = $('.field--name-field-content-type select').find("option:selected").val().replace(/_/g, '-');
		
					if(typeChosen == 'custom') {
						$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').show();
					}
				});
			});
		  });
		});
	  }
	};


})(jQuery, Drupal);
