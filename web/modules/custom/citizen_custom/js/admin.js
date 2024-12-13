(function ($, Drupal, once) {

  /* CONTENT PLACER PARAGRAPH SELECT LIST FUNCTIONALITY
  ----------------------- */
  Drupal.behaviors.contentPlacer = {
    attach: function (context) {
      once('isContentPlacer', '.field--name-field-content-type', context).forEach(contentTypeField => {
        // Hide select and limit fields that are not the content type (taxonomy)
        // field. These get displayed later depending on which content type is
        // selected.
        hideAllBut('.field--widget-options-select, .field--name-field-limit-list, .field--name-field-department', contentTypeField, context);
        const contentTypeSelect = contentTypeField.querySelector("select");
        // Store the "machine name" of the currently selected Content type.
        let typeName = getTypeString(contentTypeSelect);

        // If the Content Placer has already had options set, make sure the
        // appropriate fields are shown.
        if (typeName && contentTypeSelect.selectedIndex != "_none") {
          context.querySelectorAll('.field--name-field-' + typeName + '-list-type').forEach(taxonomyListType => {
            taxonomyListType.style.display = 'block';
            taxonomyListSelect = taxonomyListType.querySelector("select");
            if (taxonomyListSelect.selectedIndex != "_none" && getTypeString(taxonomyListSelect) == 'custom') {
              context.querySelectorAll('.field--name-field-' + typeName + '-category, .field--name-field-limit-list, .field--name-field-department').forEach(element => {
                element.style.display = 'block';
              });
            }
          });
        }

        // Assign onchange events to various fields to hide and show related
        // fields.
        contentTypeField.addEventListener("change", event => {
          // Re-hide any fields that may have been unhidden since the last
          // change.
          hideAllBut('.field--widget-options-select, .field--name-field-limit-list', contentTypeField, context, true);

          typeName = getTypeString(event.target);
          if (typeName) {
            context.querySelector('.field--name-field-' + typeName + '-list-type').style.display = 'block';
          }
        });

        // Show or hide additional options when "Custom" is selected.
        context.querySelectorAll("div[class*='-list-type']").forEach((taxonomyListType) => {
          //when one of the list type fields selects are changed
          taxonomyListType.querySelector('select').addEventListener("change", event => {

            if (typeName) {
              // If the list type is custom, show the matching category field.
              if (getTypeString(event.target) == 'custom') {
                context.querySelectorAll('.field--name-field-' + typeName + '-category, .field--name-field-limit-list, .field--name-field-department').forEach(element => {
                  element.style.display = 'block';
                });
              }
              else {
                context.querySelectorAll('.field--name-field-' + typeName + '-category, .field--name-field-limit-list, .field--name-field-department').forEach(element => {
                  element.style.display = 'none';
                });
              }
            }
          });
        });
      });
    }
  };

  /* EVENT FIELD CONTROLS
  ----------------------- */
  Drupal.behaviors.eventFields = {
    attach: function (context) {
      once('isEvent', '.field--name-field-event-type', context).forEach(eventTypeField => {
        let typeFields = $('.field--name-field-speakers,.field--name-field-registration');
        let locationFields = $('.field--name-field-address');

        typeFields.hide();
        locationFields.hide();

        const selectedType = $('.field--name-field-event-type option:selected').text().toLowerCase().replace(/_/g, '-');
        const selectedLocation = $('.field--name-field-event-location option:selected').text().toLowerCase().replace(/_/g, '-');
        console.log(selectedLocation);
        if (selectedType == 'registration required') {
          $('.field--name-field-registration').show();
        } else if (selectedType == 'internal training') {
          $('.field--name-field-speakers').show();
        } 
        if ((selectedLocation == 'on site') || (selectedLocation == 'hybrid')) {
          $('.field--name-field-address').show();
        }

        $('.field--name-field-event-type select').change(function () {
          const choice = $(this).find("option:selected").text().toLowerCase().replace(/_/g, '-');
          if (choice == 'registration required') {
            typeFields.hide();
            locationFields.hide();
            $('.field--name-field-registration').show();
          } else if (choice == 'internal training') {
            typeFields.hide();
            locationFields.hide();
            $('.field--name-field-speakers').show();
          } else {
            typeFields.hide();
            locationFields.hide();
          }
        });

        $('.field--name-field-event-location select').change(function () {
          const choice = $(this).find("option:selected").text().toLowerCase().replace(/_/g, '-');
          if ((choice == 'on site') || (choice == 'hybrid')) {
            typeFields.hide();
            locationFields.hide();
            $('.field--name-field-address').show();
          } else {
            typeFields.hide();
            locationFields.hide();
          }
        });

      });
    }
  };

  /* Add paragraph preview labels
  ----------------------- */
  Drupal.behaviors.previewLabel = {
    attach: function (context) {
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

  /**
   * Generates a machine name based on the selected option in a select element.
   * @param {HTMLSelectElement} selectTarget
   * @returns {string}
   */
  function getTypeString(selectTarget) {
    let returnString = null;
    if (selectTarget?.options && selectTarget.options[selectTarget.selectedIndex]) {
      returnString = selectTarget.options[selectTarget.selectedIndex].text.toLowerCase().replace(/_/g, '-');
    }
    return returnString;
  }

  /**
   * Hides all Nodes meeting hideSelector within a context, except for keepNode.
   * @param {string} hideSelector: a jQuery-style selector of HTMLNodes to hide.
   * @param {HTMLElement} keepNode: a Node that should not be hidden.
   * @param {Document} context: a DOM Node that the query is restricted to.
   * @param {boolean} unset: set all select boxes to the "_none" option as well.
   **/
  function hideAllBut(hideSelector, keepNode, context, unset = false) {
    context.querySelectorAll(hideSelector).forEach(hideNode => {
      if (hideNode !== keepNode) {
        // Reset selected options to the default value, if unset is selected.
        if (unset) {
          const select = hideNode.querySelector("select");
          if (select) {
            select.selectedIndex = "_none";
          }
        }
        hideNode.style.display = 'none';
      }
    });
  }

})(jQuery, Drupal, once);
