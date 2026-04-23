<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to views.
 */

/**
 * Implements hook_preprocess_views_view_unformatted().
 */
function citizen_sdc_preprocess_views_view_unformatted(&$variables) {
  $view = $variables['view'];
  if (($view->id() == 'events') || ($view->id() == 'content_list')) {
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

  // Expose an is_elevated flag for the support-search results template so the
  // `site-management` row filter has a reliable signal. The default `user`
  // twig variable isn't populated in the view-template render context.
  // Delegates the role check to citizen_custom.support_book_access so the
  // definition of "elevated" stays in one place.
  if ($view->id() === 'support_search' && $view->current_display === 'search_results') {
    $variables['is_elevated'] = \Drupal::service('citizen_custom.support_book_access')
      ->isElevated(\Drupal::currentUser());
    // Cache by user since the output varies per role.
    $variables['#cache']['contexts'][] = 'user.roles';
  }
}
