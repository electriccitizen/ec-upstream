<?php

namespace Drupal\citizen_fm\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Returns the Media ID using either the UUID or filename passed from the URL.
 */
class CitizenFM extends ControllerBase {

  /**
   * Returns the Media ID using its UUID as the parameter.
   *
   * @param string $uuid
   *   The UUID pulled from the data-entity-uuid <a> tag attribute.
   *
   * @return Symfony\Component\HttpFoundation\Response
   *   The Media ID.
   */
  public function midFromUuid($uuid): Response {
    // Get the database connection.
    $db = \Drupal::service('database');

    // Query for the Media ID via UUID.
    $mid = $db->select('media', 'm')
      ->fields('m', ['mid'])
      ->condition('uuid', $uuid, '=')
      ->execute()
      ->fetchField();

    return new Response($mid);
  }

  /**
   * Returns the Media ID using the file name as the parameter.
   *
   * @param string $filename
   *   The filename isolated from the <a> href attribute.
   *
   * @return Symfony\Component\HttpFoundation\Response
   *   The Media ID.
   */
  public function midFromFilename($filename): Response {
    // Get the database connection.
    $db = \Drupal::service('database');

    // Construct the query to get the File ID using the file name.
    $fid = $db->select('file_managed', 'f')
      ->fields('f', ['fid'])
      ->condition('f.filename', $filename, '=');

    // Query for the Media ID using the result of File ID query.
    $mid = $db->select('media__field_media_file', 'mfmf')
      ->fields('mfmf', ['entity_id'])
      ->condition('mfmf.field_media_file_target_id', $fid, '=')
      ->execute()
      ->fetchField();

    return new Response($mid);
  }

}
