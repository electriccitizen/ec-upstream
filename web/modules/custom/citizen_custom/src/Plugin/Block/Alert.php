<?php

namespace Drupal\citizen_custom\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;

/**
 * Provides an 'Alert' block.
 *
 * Renders an empty placeholder div on every page. The citizen_custom/alert
 * library fetches /ajax/alert on load and injects rendered teasers inside.
 * This lets the block itself be page-cached while alert content stays fresh.
 *
 * @Block(
 *   id = "alert",
 *   admin_label = @Translation("Alert"),
 *   category = @Translation("Alert")
 * )
 */
class Alert extends BlockBase {

  /**
   * {@inheritdoc}
   *
   * The placeholder markup AND the citizen_custom/alert library attachment are
   * both supplied by the theme's block--alert.html.twig override, which
   * delegates to the citizen_sdc:block-alert SDC. Returning an empty render
   * array here intentionally — the plugin's #attached doesn't bubble through
   * the template override since {{ content }} is never printed.
   */
  public function build() {
    // Non-empty render array so Drupal renders the block wrapper. The
    // block--alert.html.twig override ignores {{ content }} and delegates to
    // the SDC, which in turn calls attach_library() for citizen_custom/alert.
    return ['#markup' => ''];
  }

  /**
   * {@inheritdoc}
   *
   * Placeholder markup is identical on every request — no per-page cache
   * variation needed. Alert freshness is handled by the AJAX endpoint.
   */
  public function getCacheMaxAge() {
    return Cache::PERMANENT;
  }

}
