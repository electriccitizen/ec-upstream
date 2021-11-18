<?php

/**
 * @file
 * Provides a social search block 
 */

namespace Drupal\citizen_custom\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 *
 * @Block(
 *   id = "social_share",
 *   admin_label = @Translation("Social Share"),
 *   category = @Translation("Social Share"),
 * )
 */
class SocialShare extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $node = \Drupal::routeMatch()->getParameter('node');
        if ($node instanceof \Drupal\node\NodeInterface) {
            //You can get nid and anything else you need from the node object.
            $base_url = $GLOBALS['base_url'];
            $full_url = $base_url . $node->toUrl()->toString();
            $title = $node->getTitle();
        }

        return [
        '#theme' => 'social_share_block',
        '#data' => ['url' => $full_url, 'title' => $title, 'base_url' => $base_url],
        ];
    }
}
