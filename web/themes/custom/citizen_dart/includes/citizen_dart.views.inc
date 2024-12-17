<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to views.
 */

/**
 * Implements hook_preprocess_views_view_unformatted().
 */
function citizen_dart_preprocess_views_view_unformatted(&$variables) {
  $view = $variables['view'];

  if ($view->id() === 'alerts' && $view->current_display === 'block_1') {
    // Get the current path alias.
    $current_path = \Drupal::service('path_alias.manager')->getAliasByPath(\Drupal::service('path.current')->getPath());
    // Explode the alias into segments.
    $path_segments = explode('/', trim($current_path, '/'));
    // Get the starting segment or return an empty string if not present.
    $starting_segment = isset($path_segments[0]) ? '/' . $path_segments[0] : '';
    // Pass the starting segment to the template.
    $variables['starting_segment'] = $starting_segment . '/';
  }

}
