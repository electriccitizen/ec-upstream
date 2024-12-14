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

  if ($view->id() == 'events') {
    foreach ($view->result as $index => $row) {
      if (isset($row->node__field_dates_delta)) {
        // Store which date in the multivalue date field this views row refers
        // to, for rendering in the results.
        $variables['rows'][$index]['content']['#date_delta'] = $row->node__field_dates_delta;
        // Add a key to the cache so that each rendered version of this node is
        // rendered separately.
        $variables['rows'][$index]['content']['#cache']['keys'][] = $row->node__field_dates_delta;
      }
    }
  }

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
