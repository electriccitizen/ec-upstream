<?php

namespace Drupal\citizen_custom\Plugin\views\argument;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\views\Plugin\views\argument\NumericArgument;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Contextual filter that loads a content_list paragraph and filters by type.
 *
 * Accepts a paragraph ID, loads the paragraph, reads the content type value,
 * and adds a node type WHERE condition. Replaces the old 2-hop taxonomy
 * relationship chain (node -> list_widget term -> paragraph).
 *
 * @ViewsArgument("content_list_paragraph")
 */
class ContentListParagraph extends NumericArgument {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->entityTypeManager = $container->get('entity_type.manager');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function query($group_by = FALSE) {
    // Do NOT call parent::query() — parent would filter on paragraph table,
    // but our base table is node_field_data.
    $this->ensureMyTable();

    $paragraph_id = $this->argument;
    if (!is_numeric($paragraph_id)) {
      $this->query->addWhereExpression(0, '1 = 0');
      $this->view->build_info['fail'] = TRUE;
      return;
    }

    $paragraph = $this->entityTypeManager
      ->getStorage('paragraph')
      ->load($paragraph_id);

    if (!$paragraph) {
      $this->query->addWhereExpression(0, '1 = 0');
      $this->view->build_info['fail'] = TRUE;
      return;
    }

    $content_type = NULL;

    if ($paragraph->hasField('field_content_list_type') && !$paragraph->get('field_content_list_type')->isEmpty()) {
      $content_type = $paragraph->get('field_content_list_type')->value;
    }

    if (empty($content_type)) {
      $this->query->addWhereExpression(0, '1 = 0');
      $this->view->build_info['fail'] = TRUE;
      return;
    }

    $this->query->addWhere(0, 'node_field_data.type', $content_type, '=');
  }

}
