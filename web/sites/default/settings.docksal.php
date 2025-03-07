<?php
# Docksal DB connection settings.
$databases['default']['default'] = array (
  'database' => 'default',
  'username' => 'user',
  'password' => 'user',
  'host' => 'db',
  'driver' => 'mysql',
  'init_commands' => [
    'isolation_level' => 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED',
  ],
);
$settings['hash_salt'] = 'I wish i were a boy in France.';

$settings['trusted_host_patterns'] = array('^ec-upstream\.ddev\.site', '^ec-upstream\.docksal\.site');

$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

$config['system.logging']['error_level'] = 'verbose';

// $settings['rebuild_access'] = TRUE;

$settings['skip_permissions_hardening'] = TRUE;

$settings['file_temporary_path'] = '/tmp';
$settings['file_public_path'] = 'sites/default/files';
$settings['file_private_path'] = 'sites/default/files/private';
