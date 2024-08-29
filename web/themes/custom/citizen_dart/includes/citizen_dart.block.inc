<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to blocks.
 */

/**
 * Implements hook_preprocess_block().
 */
function citizen_dart_preprocess_block(&$variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');
  if (isset($node_revision)) {
    $vid = $node_revision->getRevisionId();
  }
  if ($node) {
    if ((!$node instanceof NodeInterface) && (isset($vid))) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($vid);
    }
    // Check for microsite.
    if (!empty($node->field_microsite[0])) {
      $microsite = $node->field_microsite[0]->entity->name->value;
      $micrositeClean = str_replace(' ', '-', $microsite);
      $variables['microsite'] = strtolower($micrositeClean);
    }
  }
}

/**
 * Implements hook_theme_suggestions_block_alter().
 */
function citizen_dart_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  // Block suggestions for custom block bundles.
  if (isset($variables['elements']['content']['#block_content'])) {
    $block_name = str_replace(' ', '_', strtolower($variables['elements']['content']['#block_content']->label()));
    array_splice($suggestions, 1, 0, 'block__' . $variables['elements']['content']['#block_content']->bundle());
    array_splice($suggestions, 2, 0, 'block__' . $block_name);
    array_splice($suggestions, 3, 0, 'block__' . $variables['elements']['content']['#block_content']->id());
  }
}
