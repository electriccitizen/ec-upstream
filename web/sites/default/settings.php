<?php

/**
 * @file
 * Load services definition file.
 */

use Pantheon\Integrations\Assets;

$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Determine whether this is a preproduction or production environment.
 */
$pantheon_services_file = __DIR__ . '/services.pantheon.preproduction.yml';
if (
  isset($_ENV['PANTHEON_ENVIRONMENT']) &&
  (($_ENV['PANTHEON_ENVIRONMENT'] == 'live') || ($_ENV['PANTHEON_ENVIRONMENT'] == 'test'))
) {
  $pantheon_services_file = __DIR__ . '/services.pantheon.production.yml';
}

if (file_exists($pantheon_services_file)) {
  $settings['container_yamls'][] = $pantheon_services_file;
}

include Assets::dir() . "/settings.pantheon.php";

/**
 * Place the config directory outside of the Drupal root.
 */
$settings['config_sync_directory'] = "../config/sync";

$settings['state_cache'] = TRUE;

/**
 * Set up config splits.
 */
if (isset($_ENV['PANTHEON_ENVIRONMENT'])) {
  $settings['file_temp_path'] = '/tmp';

  switch ($_ENV['PANTHEON_ENVIRONMENT']) {
    case 'live':
      $config['config_split.config_split.live']['status'] = TRUE;
      $config['system.logging']['error_level'] = 'hide';
      break;

    case 'test':
      $config['config_split.config_split.test']['status'] = TRUE;
      $config['system.logging']['error_level'] = 'hide';
      break;

    default:
      $config['config_split.config_split.dev']['status'] = TRUE;
      $config['system.logging']['error_level'] = 'verbose';
      break;

  }
}
else {
  // LOCAL.
  $config['config_split.config_split.local']['status'] = TRUE;
  $config['system.logging']['error_level'] = 'hide';
}

// Automatically generated include for settings managed by ddev.
$ddev_settings = __DIR__ . '/settings.ddev.php';
if (getenv('IS_DDEV_PROJECT') == 'true' && is_readable($ddev_settings)) {
  include $ddev_settings;
}

/**
 * If there is a local settings file, then include it.
 */
$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}
