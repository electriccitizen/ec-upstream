<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to HTML and pages.
 */

/**
 * Implements hook_preprocess_html().
 */
function citizen_dart_preprocess_html(&$variables) {
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
    if (!empty($node->field_image[0])) {
      $variables['attributes']['class'][] = 'has-main-image';
    }
  }
}

/**
 * Implements hook_theme_suggestions_page_alter().
 */
function citizen_dart_theme_suggestions_page_alter(array &$suggestions, array $variables, $hook) {
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
