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
    $item['link_classes'] = [];
    $url = $item['url'];

    if (!$url->isExternal() && $url->isRouted()) {
      if ($url->getRouteName() === '<nolink>') {
        $item['link_classes'][] = 'nolink';
      }
    }

    // Treat menu links that use "#" as their URL as intentional dummy links.
    // toString() is safe here and avoids getUri() which can throw on routed URLs.
    if (!$url->isExternal()) {
      $url_string = $url->toString();
      if ($url_string === '' || $url_string === '#') {
        $item['link_classes'][] = 'hash-link';
        $item['href'] = '#';
      }
    }

    if (!empty($item['below'])) {
      $item['link_classes'][] = 'menuparent';
      _menu_item_classes_recursive($item['below']);
    }
    if ($item['url']->toString() === \Drupal::request()->getRequestUri()) {
      $item['link_classes'][] = 'is-active';
    }
  }
}
