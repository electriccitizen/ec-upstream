<?php

namespace Drupal\citizen_custom\Plugin\Block;

use Drupal\node\NodeInterface;
use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Social Share' block.
 *
 * @Block(
 *   id = "social_share",
 *   admin_label = @Translation("Social Share"),
 *   category = @Translation("Social Share"),
 * )
 */
class SocialShare extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    // Set defaults. If $node is not set, this block is either improperly placed
    // or is being previewed.
    $data = [
      'url' => 'example_url',
      'title' => $this->t("Example Node Title"),
      'base_url' => $GLOBALS['base_url'],
    ];

    // Get the current node.
    $node = \Drupal::routeMatch()->getParameter('node');

    if ($node instanceof NodeInterface) {
      // Get the variables we need to pass to twig.
      $data['url'] = $node->toUrl()->toString();
      $data['title'] = $node->getTitle();
    }

    return [
      '#theme' => 'social_share_block',
      '#data' => $data,
    ];
  }

}
