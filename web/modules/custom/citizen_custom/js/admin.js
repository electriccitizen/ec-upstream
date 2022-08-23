(function($, Drupal) {

	/* CONTENT PLACER PARAGRAPH SELECT LIST FUNCTIONALITY
	----------------------- */
	Drupal.behaviors.contentPlacer = {
	  attach: function (context, settings) {
		$('.field--name-field-content-type .js-form-type-select', context).once('isContentPlacer').each(function(){
		//hide fields after the content type field  
		$('.field--name-field-content-type').nextAll('.field--widget-options-select').hide();
		  $(document).ajaxComplete(function() {
			$('.field--name-field-content-type .js-form-type-select').each(function(){
				//when the content type select is changed
				$(this).find('select').change(function(){
					//get the option
					var chosen = $(this).find("option:selected").text().toLowerCase().replace(/_/g, '-');
					//hide any options that are showing
					$('.field--name-field-content-type').nextAll('.field--widget-options-select').hide();
					//and show the list type field for the selected content type
					$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-list-type').show();
				});
			});
			$( "div[class*='-list-type']").each(function(){
				//when one of the list type fields selects are changed
				$(this).find('select').change(function(){
					//get the content type again
					var chosen = $('.field--name-field-content-type select').find("option:selected").text().toLowerCase().replace(/_/g, '-');
					//get the list type
					var typeChosen = $(this).find("option:selected").val().replace(/_/g, '-');
					
					//if the list type is custom, show the category field for that content type
					if(typeChosen == 'custom') {
						$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').show();
					} else {
						$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').hide();
					}
				});
			});
			//on page load, if the content type select has a value, show the appropriate field
			if($('.field--name-field-content-type select').val()){
				var chosen = $('.field--name-field-content-type select').find("option:selected").text().toLowerCase().replace(/_/g, '-');
				$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-list-type').show();
				if($('.field--name-field-' + chosen + '-list-type select').val()){
					var typeChosen = $('.field--name-field-' + chosen + '-list-type select').val().replace(/_/g, '-');
				}
				if(typeChosen == 'custom') {
					$('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').show();
				}
			}
		  });
		});
	  }
	};


})(jQuery, Drupal);
