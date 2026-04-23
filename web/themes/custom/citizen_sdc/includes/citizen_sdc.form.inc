<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to forms.
 */

use Drupal\webform\Entity\Webform;

/**
 * Implements hook_preprocess_webform().
 *
 * Exposes the webform title + placer-context flag as Twig variables. Per-
 * instance title visibility is owned by the form-placer SDC, not here.
 */
function citizen_sdc_preprocess_webform(&$variables) {
  $webform_id = $variables["element"]["#webform_id"];
  $webform = Webform::load($webform_id);
  if ($webform->get('webform_placer')) {
    $variables['webform_placer'] = TRUE;
  }
  $variables['title'] = $webform->label();
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function citizen_sdc_theme_suggestions_form_alter(array &$suggestions, array $variables) {
  if (!empty($variables['element']['#form_id'])) {
    $suggestions[] = 'form__' . $variables['element']['#form_id'];
  }
}
