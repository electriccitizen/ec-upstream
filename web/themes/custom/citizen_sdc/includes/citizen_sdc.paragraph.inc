<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to paragraphs.
 */

/**
 * Implements hook_preprocess_paragraph__PARAGRAPH_ID().
 */
function citizen_sdc_preprocess_paragraph__form_placer(&$variables) {
  // Flag the webform entity so the webform SDC suppresses its own H1. The
  // placer SDC renders its own H2 (gated on field_form_title) above the
  // form. We only need the boolean placer-context flag here; per-instance
  // title visibility lives on the paragraph and is handled in the placer
  // template — avoids the shared-state bleed that happens with multiple
  // placers referencing the same webform.
  $webform = $variables['elements']['field_form'][0]['#webform'] ?? NULL;
  if ($webform) {
    $webform->set('webform_placer', TRUE);
  }
}

/**
 * Implements hook_theme_suggestions_paragraph_alter().
 */
function citizen_sdc_theme_suggestions_paragraph_alter(array &$suggestions, array $variables) {
  $paragraph = $variables['elements']['#paragraph'];
  $id = $paragraph->id();
  array_push($suggestions, 'paragraph__' . $paragraph->getType() . '__' . $id);
}
