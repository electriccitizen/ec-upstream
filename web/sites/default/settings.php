<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all environments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to ensure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

/**
 * Skipping permissions hardening will make scaffolding
 * work better, but will also raise a warning when you
 * install Drupal.
 *
 * https://www.drupal.org/project/drupal/issues/3091285
 */
// $settings['skip_permissions_hardening'] = TRUE;

/**
 * Place the config directory outside of the Drupal root.
 */
$settings['config_sync_directory'] = "../config/sync";

$settings['state_cache'] = TRUE;

/**
 * Set up config splits
 */
if (isset($_ENV['PANTHEON_ENVIRONMENT'])) {
  $settings['file_temp_path'] = '/tmp';

  switch ($_ENV['PANTHEON_ENVIRONMENT']) {
    case 'live':
      $config['config_split.config_split.live']['status'] = TRUE;
      break;

    case 'test':
      $config['config_split.config_split.test']['status'] = TRUE;
      break;

    default:
      $config['config_split.config_split.dev']['status'] = TRUE;
      break;

  }
} else {
    // LOCAL

  $config['config_split.config_split.local']['status'] = TRUE;

  // ddev settings we installed here!
  $ddev_settings = __DIR__ . '/settings.ddev.php';
  if (getenv('IS_DDEV_PROJECT') == 'true' && is_readable($ddev_settings)) {
    require $ddev_settings;
  } else {

  /**
   * If it's not DDEV, we use docksal settings file
   */
  $docksal_settings = __DIR__ . "/settings.docksal.php";
    if (is_readable($docksal_settings)) {
        include $docksal_settings;
    }
  }

  /**
   * If there is a local settings file, then include it
   */
  $local_settings = __DIR__ . "/settings.local.php";
  if (file_exists($local_settings)) {
      include $local_settings;
  }
}
