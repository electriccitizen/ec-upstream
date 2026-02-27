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
 * Adds the field_support_type key value as a BEM modifier class to each
 * support book menu item's <li> element. This allows CSS/JS to target items
 * by support type without altering the shared menu macro or Twig templates.
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

  _support_book_add_type_classes($variables['items']);
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
    $url = $item['url'];

    if (
      !$url->isExternal()
      && $url->isRouted()
      && $url->getRouteName() === 'entity.node.canonical'
    ) {
      $params = $url->getRouteParameters();

      if (!empty($params['node'])) {
        $node = \Drupal::entityTypeManager()
          ->getStorage('node')
          ->load($params['node']);

        if (
          $node
          && $node->hasField('field_support_type')
          && !$node->get('field_support_type')->isEmpty()
        ) {
          $support_type = $node->get('field_support_type')->value;
          $class = 'menu-item--support-type--'
            . \Drupal\Component\Utility\Html::cleanCssIdentifier($support_type);
          $item['attributes']->addClass($class);
        }
      }
    }

    if (!empty($item['below'])) {
      _support_book_add_type_classes($item['below']);
    }
  }
}
