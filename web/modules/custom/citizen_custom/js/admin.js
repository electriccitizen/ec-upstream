(function (Drupal, once) {

  // Mapping from select option values (machine names) to the category field
  // name fragment. Example: value "event" -> field name "field_events_category".
  var typeToCategoryPrefix = {
    event: 'events',
    news: 'news'
  };

  /* CONTENT LIST PARAGRAPH SELECT LIST FUNCTIONALITY
  ----------------------- */
  Drupal.behaviors.contentList = {
    attach: function (context) {
      once('isContentPlacer', '.field--name-field-content-list-type', context).forEach(contentTypeField => {

        // Hide select and limit fields that are not the content type field.
        // These get displayed later depending on which content type is selected.
        hideAllBut('.field--widget-options-select, .field--name-field-limit-list', contentTypeField, context);
        const contentTypeSelect = contentTypeField.querySelector("select");
        let typeValue = getTypeValue(contentTypeSelect);

        // If the Content List has already had options set, show appropriate fields.
        if (typeValue) {
          showFieldsForType(typeValue, context);
        }

        // Assign onchange events to hide and show related fields.
        contentTypeField.addEventListener("change", event => {
          // Re-hide any fields that may have been unhidden since the last change.
          hideAllBut('.field--widget-options-select, .field--name-field-limit-list', contentTypeField, context, true);

          typeValue = getTypeValue(event.target);
          if (typeValue) {
            showFieldsForType(typeValue, context);
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
   * Gets the selected option value (machine name) from a select element.
   * @param {HTMLSelectElement} selectTarget
   * @returns {string|null}
   */
  function getTypeValue(selectTarget) {
    if (selectTarget && selectTarget.value && selectTarget.value !== '_none') {
      return selectTarget.value;
    }
    return null;
  }

  /**
   * Shows the category and limit fields for the given content type value.
   * @param {string} typeValue - The machine name value (e.g., "event", "news").
   * @param {Document} context - The DOM context.
   */
  function showFieldsForType(typeValue, context) {
    var prefix = typeToCategoryPrefix[typeValue];
    if (prefix) {
      var categories = '.field--name-field-' + prefix + '-category';
      context.querySelectorAll(categories).forEach(function (element) {
        element.style.display = 'block';
      });
    }
    // Show limit field whenever any content type is selected.
    context.querySelectorAll('.field--name-field-limit-list').forEach(function (limit) {
      limit.style.display = 'block';
    });
  }

  /**
   * Hides all Nodes meeting hideSelector within a context, except for keepNode.
   * @param {string} hideSelector: a jQuery-style selector of HTMLNodes to hide.
   * @param {HTMLElement} keepNode: a Node that should not be hidden.
   * @param {Document} context: a DOM Node that the query is restricted to.
   * @param {boolean} unset: set all select boxes to the "_none" option as well.
   **/
  function hideAllBut(hideSelector, keepNode, context, unset) {
    if (typeof unset === 'undefined') unset = false;
    context.querySelectorAll(hideSelector).forEach(function (hideNode) {
      if (hideNode !== keepNode) {
        // Reset selected options to the default value, if unset is selected.
        if (unset) {
          var select = hideNode.querySelector("select");
          if (select) {
            select.value = '_none';
          }
        }
        hideNode.style.display = 'none';
      }
    });
  }

})(Drupal, once);
