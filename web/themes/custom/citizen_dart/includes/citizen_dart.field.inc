<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to fields.
 */

/**
 * Implements hook_preprocess_field().
 */
function citizen_dart_preprocess_field(&$variables) {
  switch ($variables['element']['#field_name']) {
    case 'field_dates':
      if (isset($variables['element']['#date_delta'])) {
        // Only render the delta stored from the view results.
        $delta = $variables['element']['#date_delta'];
        $date = $variables['items'][$delta];
        $variables['items'] = [$date];
      }
      break;
  }

  // Remove HTML tags from summary/trimmed WYSIWYG fields.
  if (isset($variables['element']['#formatter']) && $variables['element']['#formatter'] == 'text_summary_or_trimmed') {
    foreach ($variables['items'] as &$item) {
      $item['content']['#text'] = strip_tags($item['content']['#text']);
    }
  }

  // Flag landing page fields when rendered on the front page for Twig checks.
  if (!empty($variables['element']['#entity_type']) && $variables['element']['#entity_type'] === 'node'
    && !empty($variables['element']['#bundle']) && $variables['element']['#bundle'] === 'landing_page'
    && \Drupal::service('path.matcher')->isFrontPage()) {
    $variables['is_front'] = TRUE;
  }
}

/**
 * Implements hook_theme_suggestions_field_alter().
 */
function citizen_dart_theme_suggestions_field_alter(array &$suggestions, array $variables) {
  // Field suggestions based on node view modes.
  if (isset($variables['element']['#view_mode'])) {
    $suggestions[] = 'field__' . $variables['element']['#field_name'] . '__' . $variables['element']['#view_mode'];
  }
}
