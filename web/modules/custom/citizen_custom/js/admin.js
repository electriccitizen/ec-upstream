(function ($, Drupal, once) {

  /* CONTENT PLACER PARAGRAPH SELECT LIST FUNCTIONALITY
  ----------------------- */
  Drupal.behaviors.contentPlacer = {
    attach: function (context, settings) {
    	once('isContentPlacer', '.field--name-field-content-type', context).forEach(contentTypeField => {
        // Hide select fields that are not the content type (taxonomy) field.
        // These get displayed later depending on which content type is
        // selected.
        hideAllBut('.field--widget-options-select', contentTypeField, context);
        // Hide limit field.
        context.querySelector('.field--name-field-limit-list').style.display = 'none';

        contentTypeField.addEventListener("change", event => {
          // Re-hide any fields that may have been unhidden since the last
          // change.
          hideAllBut('.field--widget-options-select', contentTypeField, context);
          console.log(event.target.options);

          const typeName = event.target.options[event.target.selectedIndex].text.toLowerCase().replace(/_/g, '-');
          context.querySelector('.field--name-field-' + typeName + '-list-type').style.display = 'block';
          context.querySelector('.field--name-field-limit-list').style.display = 'none';

        });

        // for each selected display show or hide the categories and limit list fields if a custom field is used
        $( "div[class*='-list-type']").each(function () {
            //when one of the list type fields selects are changed
            $(this).find('select').change(function () {
                //get the content type again
                var chosen = $('.field--name-field-content-type select').find("option:selected").text().toLowerCase().replace(/_/g, '-');
                //get the list type
                var typeChosen = $(this).find("option:selected").val().replace(/_/g, '-');

                //if the list type is custom, show the category field for that content type
                if(typeChosen == 'custom') {
                    $('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').show();
                    $('.field--name-field-limit-list').show();
                } else {
                    $('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').hide();
                    $('.field--name-field-limit-list').hide();
                }
            });
        });
        //when an existing content placer is opened, if the content type select has a value, show the appropriate field and if a custom display is selected show those related fields
        if($('.field--name-field-content-type select').val()){
            var chosen = $('.field--name-field-content-type select').find("option:selected").text().toLowerCase().replace(/_/g, '-');
            $('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-list-type').show();
            if($('.field--name-field-' + chosen + '-list-type select').val()){
                var typeChosen = $('.field--name-field-' + chosen + '-list-type select').val().replace(/_/g, '-');
            }
            if(typeChosen == 'custom') {
                $('.field--name-field-content-type').siblings('.field--name-field-' + chosen + '-category').show();
                $('.field--name-field-limit-list').show();
            }
        }
      });
    }
  };

  /* Add paragraph preview labels
  ----------------------- */
  Drupal.behaviors.previewLabel = {
    attach: function (context, settings) {
      once('isParaPreview', '.lp-builder .paragraph--view-mode--preview', context).forEach((element) => {
        if (typeof element.dataset.type !== 'undefined') {
          const label = document.createElement('div');
          label.className = "para-preview-label";
          label.innerHTML = element.dataset.type.replace(/_/g, ' ') + " widget";
          element.prepend(label);
        }
      });
    }
  };

})(jQuery, Drupal, once);

/**
 * Hides all Nodes meeting hideSelector within a context, except for keepNode.
 * @params:
 *   hideSelector (string): a jQuery-style selector of HTMLNodes to hide.
 *   keepNode (HTMLNode): a Node that should not be hidden.
 *   context (Document): a DOM Node that the query is restricted to.
 **/
function hideAllBut(hideSelector, keepNode, context) {
  context.querySelectorAll(hideSelector).forEach(hideNode => {
    if (hideNode !== keepNode) {
      hideNode.style.display = 'none';
    }
  });
}
