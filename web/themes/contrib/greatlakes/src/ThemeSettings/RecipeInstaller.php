<?php

namespace Drupal\greatlakes\ThemeSettings;

use Drupal\dripyard_base\ThemeSettings\RecipeInstaller as RecipeInstallerBase;

class RecipeInstaller extends RecipeInstallerBase {

  /**
   * {@inheritdoc}
   *
   * @return array<string, array<string, mixed>>
   *   Array of available recipes.
   */
  protected function getAvailableRecipes(): array {
    return [
      'dripyard_greatlakes_blocks' => [
        'machine_name' => 'dripyard_greatlakes_blocks',
        'title' => t('Great Lakes Blocks'),
        'description' => t('This recipe provides a set of block types based on the single directory components of this theme. These work well with layout builder, but can be used with other page layout modules.'),
        'extended_by' => ['dripyard_greatlakes_demo_content', 'dripyard_greatlakes_landing_pages'],
      ],
      'dripyard_greatlakes_nodes' => [
        'machine_name' => 'dripyard_greatlakes_nodes',
        'title' => t('Great Lakes Nodes'),
        'description' => t('This recipe provides configurations and view modes for the article node type. These provide examples how how to theme nodes with the theme single directory components.'),
        'extended_by' => ['dripyard_greatlakes_demo_content'],
      ],
      'dripyard_greatlakes_demo_content' => [
        'machine_name' => 'dripyard_greatlakes_demo_content',
        'title' => t('Great Lakes Demo Content'),
        'description' => t('This recipe provides the demo content for GreatLakes use to build <a href="https://greatlakes.dripyard.com" target="_blank">https://greatlakes.dripyard.com</a> including article nodes, and block content.'),
        'extended_by' => ['dripyard_greatlakes_layout_builder_demo', 'dripyard_greatlakes_canvas_demo'],
      ],
      'dripyard_greatlakes_landing_pages' => [
        'machine_name' => 'dripyard_greatlakes_landing_pages',
        'title' => t('Great Lakes Landing Pages'),
        'description' => t('This recipe provides a landing page content type based on layout builder. It will allow you to place the GreatLakes blocks from the recipe above in page layouts.'),
        'extended_by' => ['dripyard_greatlakes_layout_builder_demo'],
      ],
      'dripyard_greatlakes_layout_builder_demo' => [
        'machine_name' => 'dripyard_greatlakes_layout_builder_demo',
        'title' => t('Great Lakes Layout Builder Demo'),
        'description' => t('This recipe provides a <em>Layout Builder</em> based install of <a href="https://greatlakes.dripyard.com" target="_blank">https://greatlakes.dripyard.com</a>. It includes a landing page with various blocks and configurations.<br><strong>This is a content demo and will add entities to your site.</strong>'),
        'extended_by' => [],
      ],
      'dripyard_greatlakes_canvas_demo' => [
        'machine_name' => 'dripyard_greatlakes_canvas_demo',
        'title' => t('Great Lakes Drupal Canvas Demo'),
        'description' => t('This recipe provides a <em>Drupal Canvas</strong> based install of <a href="https://greatlakes.dripyard.com" target="_blank">https://greatlakes.dripyard.com</a>. It includes a canvas page with various components and configurations.<br><strong>This is a content demo and will add entities to your site.</strong>'),
        'extended_by' => [],
        'dependencies' => ['canvas'],
      ],
      'dripyard_greatlakes_canvas_patterns' => [
        'machine_name' => 'dripyard_greatlakes_canvas_patterns',
        'title' => t('Great Lakes Drupal Canvas Patterns'),
        'description' => t('This recipe provides component patterns to be used with <em>Drupal Canvas</em>.'),
        'extended_by' => [],
        'dependencies' => ['canvas'],
      ],

    ];
  }

}
