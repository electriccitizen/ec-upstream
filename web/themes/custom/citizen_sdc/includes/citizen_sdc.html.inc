<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to HTML and pages.
 */

use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\TermInterface;

/**
 * Implements hook_preprocess_html().
 */
function citizen_sdc_preprocess_html(&$variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');
  // On revision pages the `node` parameter arrives as an integer; resolve
  // it to the entity so everything downstream can treat it uniformly.
  if ($node && !$node instanceof NodeInterface && $node_revision) {
    $node = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadRevision($node_revision->getRevisionId());
  }
  if (!$node instanceof NodeInterface) {
    return;
  }

  // Flag unpublished nodes for admin-visible styling. Published state is
  // implicit (no class) — only the off-state needs targeting.
  if ($node->status[0]->value != '1') {
    $variables['attributes']['class'][] = 'unpublished';
  }

  // Most content types use field_image as their main / social-sharing image;
  // bios use field_headshot (and have their own Metatag override pointing at
  // it). Extend this list for any future content type that introduces its
  // own main-image field.
  $has_main_image = FALSE;
  foreach (['field_image', 'field_headshot'] as $field) {
    if ($node->hasField($field) && !$node->get($field)->isEmpty()) {
      $has_main_image = TRUE;
      break;
    }
  }

  // Flag the body when the node has a main image so layout CSS can adjust.
  if ($has_main_image) {
    $variables['attributes']['class'][] = 'has-main-image';
  }

  // Social-sharing image fallback.
  //
  // When a main-image field is populated, the Metatag module emits og:image
  // / twitter:image via its token defaults (global node token uses
  // field_image; the node__bios override uses field_headshot). When every
  // known main-image field is empty or absent — support_book, alert, etc.
  // — inject the theme-level fallback so shares always render something
  // branded instead of no preview image at all.
  if (!$has_main_image) {
    $fallback = Url::fromUri('internal:/themes/custom/citizen_sdc/logo-social.jpg', ['absolute' => TRUE])->toString();
    // Open Graph uses `property=`; Twitter Cards uses `name=` per spec (and
    // matches how the Metatag module emits twitter:image when field_image
    // is populated, so the pair stays consistent).
    $tags = [
      'og:image' => 'property',
      'twitter:image' => 'name',
    ];
    foreach ($tags as $value => $attr) {
      $variables['#attached']['html_head'][] = [
        [
          '#tag' => 'meta',
          '#attributes' => [
            $attr => $value,
            'content' => $fallback,
          ],
        ],
        $value,
      ];
    }
  }
}

/**
 * Implements hook_preprocess_page().
 */
function citizen_sdc_preprocess_page(&$variables) {
  // Expose is_elevated on support_book pages so page--support-book.html.twig
  // can show the friendly "no permission" message without each template
  // re-implementing the role check. Source of truth is
  // citizen_custom.support_book_access.
  $node = $variables['node'] ?? NULL;
  if ($node instanceof NodeInterface && $node->bundle() === 'support_book') {
    $variables['is_elevated'] = \Drupal::service('citizen_custom.support_book_access')
      ->isElevated(\Drupal::currentUser());
    // Output varies per role — tag the render so the page cache splits.
    $variables['#cache']['contexts'][] = 'user.roles';
  }
}

/**
 * Implements hook_theme_suggestions_page_alter().
 */
function citizen_sdc_theme_suggestions_page_alter(array &$suggestions, array $variables, $hook) {
  $route_match = \Drupal::routeMatch();

  // Node page — add `page__{bundle}` suggestion (e.g. page__support_book).
  $node = $route_match->getParameter('node');
  $node_revision = $route_match->getParameter('node_revision');
  if ($node && !$node instanceof NodeInterface && $node_revision) {
    $node = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadRevision($node_revision->getRevisionId());
  }
  if ($node instanceof NodeInterface) {
    $suggestions[] = 'page__' . $node->getType();
  }

  // Taxonomy term page — add `page__taxonomy__{vocab}` suggestion.
  if ($route_match->getRouteName() === 'entity.taxonomy_term.canonical') {
    $term = $route_match->getParameter('taxonomy_term');
    if ($term instanceof TermInterface) {
      $suggestions[] = 'page__taxonomy__' . $term->bundle();
    }
  }
}
