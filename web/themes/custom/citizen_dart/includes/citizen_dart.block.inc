<?php

/**
 * @file citizen_dart.block.inc
 * Includes all preprocess and alter hooks related to blocks.
 */

/**
 * Implements hook_theme_suggestions_block_alter().
 */
function citizen_dart_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  // Block suggestions for custom block bundles.
  if (isset($variables['elements']['content']['#block_content'])) {
    $block_name = str_replace(' ','_',strtolower($variables['elements']['content']['#block_content']->label()));
    array_splice($suggestions, 1, 0, 'block__' . $variables['elements']['content']['#block_content']->bundle());
    array_splice($suggestions, 2, 0, 'block__' . $block_name);
    array_splice($suggestions, 3, 0, 'block__' . $variables['elements']['content']['#block_content']->id());
  }
}
