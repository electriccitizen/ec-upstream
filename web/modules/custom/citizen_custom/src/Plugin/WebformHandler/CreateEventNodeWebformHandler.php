<?php

namespace Drupal\citizen_custom\Plugin\WebformHandler;

use Drupal\node\Entity\Node;
use Drupal\webform\Plugin\WebformHandlerBase;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Create a new Event node entity from a webform submission.
 *
 * @WebformHandler(
 *   id = "create_event_node",
 *   label = @Translation("Create Event node"),
 *   category = @Translation("Entity Creation"),
 *   description = @Translation("Creates a new unpublished Event node from Webform Submissions."),
 *   cardinality = \Drupal\webform\Plugin\WebformHandlerInterface::CARDINALITY_UNLIMITED,
 *   results = \Drupal\webform\Plugin\WebformHandlerInterface::RESULTS_PROCESSED,
 *   submission = \Drupal\webform\Plugin\WebformHandlerInterface::SUBMISSION_REQUIRED,
 * )
 */
class CreateEventNodeWebformHandler extends WebformHandlerBase {

  /**
   * Creates an unpublished Event node upon submission of the webform.
   *
   * @param \Drupal\webform\WebformSubmissionInterface $webform_submission
   *   The webform submission entity.
   * @param bool $update
   *   Whether the submission is an update or a new submission.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function postSave(WebformSubmissionInterface $webform_submission, $update = TRUE) {
    // Get all submitted values.
    $values = $webform_submission->getData();

    // Process the datetime fields for the event start and end date.
    // The webform datetime field returns a timestamp or ISO 8601 string.
    $event_date = NULL;
    $event_end = NULL;

    if (!empty($values['event_date_time'])) {
      try {
        // Handle datetime field - could be timestamp or ISO string.
        if (is_numeric($values['event_date_time'])) {
          $event_date = \DateTime::createFromFormat('U', $values['event_date_time']);
        }
        else {
          // Remove timezone if present in ISO format.
          $date_string = strtok($values['event_date_time'], '+');
          $event_date = new \DateTime($date_string);
        }
      }
      catch (\Exception $e) {
        \Drupal::logger('citizen_custom')->error('Error parsing event start date: @message', [
          '@message' => $e->getMessage(),
        ]);
      }
    }

    if (!empty($values['event_end'])) {
      try {
        // Handle datetime field - could be timestamp or ISO string.
        if (is_numeric($values['event_end'])) {
          $event_end = \DateTime::createFromFormat('U', $values['event_end']);
        }
        else {
          // Remove timezone if present in ISO format.
          $date_string = strtok($values['event_end'], '+');
          $event_end = new \DateTime($date_string);
        }
      }
      catch (\Exception $e) {
        \Drupal::logger('citizen_custom')->error('Error parsing event end date: @message', [
          '@message' => $e->getMessage(),
        ]);
      }
    }

    // Build node arguments.
    $node_args = [
      'type' => 'event',
      'langcode' => 'en',
      'created' => time(),
      'changed' => time(),
      'uid' => 1,  // Assign to admin user.
      'status' => 0,  // UNPUBLISHED - nodes require editorial review.
      'title' => $values['event_title'] ?? 'Untitled Event',
    ];

    // Set event category to "Advising Center" (TID: 39).
    $node_args['field_category'] = [
      'target_id' => 39,
    ];

    // Add event date/time using smart date field.
    if ($event_date) {
      // Use event_end if provided, otherwise default to 60 minutes after start.
      if ($event_end) {
        $end_timestamp = $event_end->getTimestamp();
        // Calculate duration in minutes.
        $duration = (int) round(($end_timestamp - $event_date->getTimestamp()) / 60);
      }
      else {
        // Default to 60 minutes if no end time provided.
        $duration = 60;
        $end_date = clone $event_date;
        $end_date->modify("+{$duration} minutes");
        $end_timestamp = $end_date->getTimestamp();
      }

      $node_args['field_dates'] = [
        'value' => $event_date->getTimestamp(),
        'end_value' => $end_timestamp,
        'duration' => $duration,
      ];
    }

    // Add event description/body.
    if (!empty($values['event_description'])) {
      $node_args['body'] = [
        'value' => $values['event_description'],
        'format' => 'basic_html',
      ];
    }

    // Add contact information.
    if (!empty($values['contact_name'])) {
      $node_args['field_contact_name'] = $values['contact_name'];
    }

    if (!empty($values['contact_email'])) {
      $node_args['field_contact_email'] = $values['contact_email'];
    }

    // Add registration link.
    if (!empty($values['registration_link'])) {
      $node_args['field_registration'] = [
        'uri' => $values['registration_link'],
      ];
    }

    // Add virtual event link (demo focuses on virtual events only).
    if (!empty($values['virtual_event_link'])) {
      $node_args['field_meeting_link'] = [
        'uri' => $values['virtual_event_link'],
      ];
    }

    // Create and save the node with error handling.
    try {
      $node = Node::create($node_args);
      $node->save();

      \Drupal::logger('citizen_custom')->notice('Created unpublished Event node "@title" (nid: @nid) from webform submission.', [
        '@title' => $node->getTitle(),
        '@nid' => $node->id(),
      ]);
    }
    catch (\Exception $e) {
      \Drupal::logger('citizen_custom')->error('Unable to save Event node from webform submission "@title": @message', [
        '@message' => $e->getMessage(),
        '@title' => $values['event_title'] ?? 'Unknown',
      ]);
    }
  }

}
