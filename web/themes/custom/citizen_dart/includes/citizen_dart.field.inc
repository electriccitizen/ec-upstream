<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to fields.
 */

/**
 * Implements hook_preprocess_field().
 */
function citizen_dart_preprocess_field(&$variables) {

  // Check if this is the AddToCalendar field for the Event content type.
  if ($variables['field_name'] === 'field_add_to_calendar' && $variables['entity_type'] === 'node') {
    $node = $variables['element']['#object'];
    // Ensure the node has the Smart Date field.
    if ($node->hasField('field_dates')) {
      // Retrieve the Smart Date values.
      $dates = $node->get('field_dates')->getValue();

      // Initialize empty arrays for start and end dates.
      $start_dates = [];
      $end_dates = [];

      // Iterate over all date values in the Smart Date field.
      foreach ($dates as $date) {

        // Get start and end values from the Smart Date field.
        $start_date = $date['value']; // Start date in ISO 8601 format.
        $end_date = $date['end_value']; // End date in ISO 8601 format.

        // Ensure both start and end dates are available before adding.
        if ($start_date && $end_date) {
          $utc_timezone = new \DateTimeZone('UTC');

          // Create a DateTime object from the Unix timestamp in UTC
          $start_datetime = (new \DateTime('@' . $start_date, $utc_timezone));

          $end_datetime = \DateTime::createFromFormat('U', $end_date, new \DateTimeZone('UTC'));

          // Format the date to match Google Calendar's format
          $start_date_formatted = $start_datetime->format('Ymd\THis\Z'); // Google Calendar format
          $end_date_formatted = $end_datetime->format('Ymd\THis\Z'); // Google Calendar format

          // Format the dates for AddToCalendar.
          $start_dates[] = $start_date_formatted;
          $end_dates[] = $end_date_formatted;

        }
      }

      // Pass the start and end dates to the template.
      $variables['start_dates'] = $start_dates;
      $variables['end_dates'] = $end_dates;
    }
  }

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
