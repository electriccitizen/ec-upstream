<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to menus.
 */

/**
 * Implements template_preprocess_menu().
 */
function citizen_dart_preprocess_menu(&$variables) {
  switch ($variables['menu_name']) {
    case 'main':
      foreach ($variables['items'] as &$item) {
        $item['link_classes'] = [];
        if ($item['url']->getRouteName() === '<nolink>') {
          $item['link_classes'][] = 'nolink';
        }
        if (!empty($item['below'])) {
          $item['link_classes'][] = 'menuparent';
        }
      }

      break;
  }
}
