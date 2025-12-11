<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to HTML and pages.
 */

use Drupal\Core\Url;

/**
 * Implements hook_preprocess_html().
 */
function citizen_sdc_preprocess_html(&$variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');
  if (isset($node_revision)) {
    $vid = $node_revision->getRevisionId();
  }
  if ($node) {
    if ((!$node instanceof NodeInterface) && (isset($vid))) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($vid);
    }
    // Set published or unpublished.
    if ($node->status[0]->value == '1') {
      $variables['attributes']['class'][] = 'published';
    }
    else {
      $variables['attributes']['class'][] = 'unpublished';
    }
    // Check for main image.
    if ($node->hasField('field_image') && !$node->get('field_image')->isEmpty()) {
      $variables['attributes']['class'][] = 'has-main-image';
    }
  }

  // Define the fallback image URL.
  $fallback_image = Url::fromUri('internal:/themes/custom/citizen_sdc/logo-social.jpg', ['absolute' => TRUE])->toString();

  // Make sure we're on a node.
  $node = Drupal::request()->attributes->get('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');
  if ($node_revision) {
    $vid = $node_revision->getRevisionId();
  }
  if ($node) {
    if ((!$node instanceof NodeInterface) && (isset($vid))) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($vid);
    }
    if ($node->hasField('field_image') && !$node->get('field_image')->isEmpty()) {

      // Set Open Graph and Twitter image meta tags.
      $variables['#attached']['html_head'][] = [
        [
          '#tag' => 'meta',
          '#attributes' => [
            'property' => 'og:image',
            'content' => $fallback_image,
          ],
        ],
        'og:image',
      ];
      $variables['#attached']['html_head'][] = [
        [
          '#tag' => 'meta',
          '#attributes' => [
            'property' => 'twitter:image',
            'content' => $fallback_image,
          ],
        ],
        'twitter:image',
      ];
    }
  }
}

/**
 * Implements hook_theme_suggestions_page_alter().
 */
function citizen_sdc_theme_suggestions_page_alter(array &$suggestions, array $variables, $hook) {
  // Try to get the node, so we can check if we're on the node page.
  $node = Drupal::request()->attributes->get('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');
  if ($node_revision) {
    $vid = $node_revision->getRevisionId();
  }
  if ($node) {
    if ((!$node instanceof NodeInterface) && (isset($vid))) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($vid);
    }
    $suggestions[] = 'page__' . $node->getTYpe();
  }
  if (\Drupal::routeMatch()->getRouteName() == 'entity.taxonomy_term.canonical' && $tid = \Drupal::routeMatch()->getRawParameter('taxonomy_term')) {
    $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);
    $suggestions[] = 'page__taxonomy__' . $term->bundle();
  }
}
