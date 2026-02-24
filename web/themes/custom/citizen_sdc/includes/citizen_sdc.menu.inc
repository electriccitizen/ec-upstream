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
