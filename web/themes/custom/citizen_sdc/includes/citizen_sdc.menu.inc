<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to menus.
 */

/**
 * Implements template_preprocess_menu().
 */
function citizen_sdc_preprocess_menu(&$variables) {
  _menu_item_classes_recursive($variables['items']);  
}

/**
 * Recursively looks through menu tree and distributes identifying classes.
 *
 * @param array $items
 *   A Drupal array of menu items.
 */
function _menu_item_classes_recursive(array &$items) {
  foreach ($items as &$item) {
    // Base class for all menu links.
    $item['link_classes'] = ['menu-item__link'];
    $url = $item['url'];

    // If the link is not a link, add that as a class.
    if (!$url->isExternal() && $url->isRouted()) {
      if ($url->getRouteName() === '<nolink>') {
        $item['link_classes'][] = 'menu-item__link--no-link';
      }
    }

    // Treat menu links that use "#" as their URL as intentional dummy links.
    if (!$url->isExternal()) {
      $url_string = $url->toString();
      if ($url->getRouteName() != '<nolink>' && ($url_string === '' || $url_string === '#')) {
        $item['link_classes'][] = 'menu-item__link--hash-link';
        $item['href'] = '#';
      }
    }

    // Add a class for menu parents.
    if (!empty($item['below'])) {
      $item['link_classes'][] = 'menu-item__link--menu-parent';
      _menu_item_classes_recursive($item['below']);
    }

    // Add an active class.
    if ($item['url']->toString() === \Drupal::request()->getRequestUri()) {
      $item['link_classes'][] = 'menu-item__link--active';
    }
  }
}

/**
 * Implements template_preprocess_menu__support_book().
 *
 * Two passes over the tree:
 *   1. Strip `site_management` items (and their descendants) for non-elevated
 *      users so the markup never contains links editors can't access — no
 *      more CSS display:none leaking them into view-source.
 *   2. Add `menu-item--support-type--{type}` BEM modifier classes to the
 *      items that remain, so CSS/JS can target by type.
 */
function citizen_sdc_preprocess_menu__support_book(&$variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');

  // On node revision pages the 'node' route parameter may be an integer
  // rather than a NodeInterface object, which can cause fatal errors when
  // entity operations are attempted. Bail early on any revision context,
  // consistent with the guard in citizen_sdc_preprocess_breadcrumb().
  if ($node_revision || ($node && !$node instanceof \Drupal\node\NodeInterface)) {
    return;
  }

  $is_elevated = \Drupal::service('citizen_custom.support_book_access')
    ->isElevated(\Drupal::currentUser());

  if (!$is_elevated) {
    _support_book_filter_site_management($variables['items']);
  }

  _support_book_add_type_classes($variables['items']);

  // Output varies per role when the filter runs — tag cache accordingly.
  $variables['#cache']['contexts'][] = 'user.roles';
}

/**
 * Drops menu items pointing at site_management support_book nodes.
 *
 * Walks the tree and removes any item whose URL resolves to a support_book
 * node of type `site_management`. Runs recursively so descendants under a
 * removed parent are also dropped.
 *
 * @param array $items
 *   Menu items array from template_preprocess_menu().
 */
function _support_book_filter_site_management(array &$items): void {
  foreach ($items as $key => &$item) {
    $type = _support_book_item_type($item);
    if ($type === 'site_management') {
      unset($items[$key]);
      continue;
    }
    if (!empty($item['below'])) {
      _support_book_filter_site_management($item['below']);
    }
  }
}

/**
 * Recursively adds support type classes to support book menu item attributes.
 *
 * Loads the node referenced by each menu item URL, reads the
 * field_support_type list field key, and adds a sanitized BEM modifier class
 * (e.g. menu-item--support-type--content) to the item's <li> attributes.
 *
 * @param array $items
 *   Menu items array from template_preprocess_menu().
 */
function _support_book_add_type_classes(array &$items): void {
  foreach ($items as &$item) {
    $type = _support_book_item_type($item);
    if ($type !== NULL) {
      $class = 'menu-item--support-type--'
        . \Drupal\Component\Utility\Html::cleanCssIdentifier($type);
      $item['attributes']->addClass($class);
    }

    if (!empty($item['below'])) {
      _support_book_add_type_classes($item['below']);
    }
  }
}

/**
 * Returns the support_book field_support_type for a menu item, or NULL.
 */
function _support_book_item_type(array $item): ?string {
  $url = $item['url'] ?? NULL;
  if (!$url || $url->isExternal() || !$url->isRouted()
    || $url->getRouteName() !== 'entity.node.canonical') {
    return NULL;
  }
  $params = $url->getRouteParameters();
  if (empty($params['node'])) {
    return NULL;
  }
  $node = \Drupal::entityTypeManager()->getStorage('node')->load($params['node']);
  if (!$node || !$node->hasField('field_support_type')
    || $node->get('field_support_type')->isEmpty()) {
    return NULL;
  }
  return $node->get('field_support_type')->value;
}
