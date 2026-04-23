<?php

namespace Drupal\citizen_custom\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * AJAX endpoint that returns currently-active alert teasers.
 */
class Alert extends ControllerBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * Constructs the controller.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, RendererInterface $renderer) {
    $this->entityTypeManager = $entity_type_manager;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('renderer')
    );
  }

  /**
   * Returns rendered teasers for all currently-active alerts.
   */
  public function ajax() {
    $response = new Response();
    $response->headers->set('X-Robots-Tag', 'noindex');
    $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

    $storage = $this->entityTypeManager->getStorage('node');
    $nids = $this->getActiveAlertNids();
    if (empty($nids)) {
      return $response;
    }

    // loadMultiple returns nodes keyed by nid, not in query-sort order. Rebuild
    // the render array by iterating the sorted nids so newest-start-first is
    // preserved.
    $loaded = $storage->loadMultiple($nids);
    $view_builder = $this->entityTypeManager->getViewBuilder('node');
    $build = [];
    foreach ($nids as $nid) {
      if (isset($loaded[$nid])) {
        $build[$nid] = $view_builder->view($loaded[$nid], 'teaser');
      }
    }
    $html = (string) $this->renderer->renderRoot($build);
    $response->setContent($html);

    return $response;
  }

  /**
   * Returns nids of published alert nodes whose display range includes now.
   *
   * Smart Date stores values as unix timestamps on field_display_range.value /
   * .end_value — we query against the current timestamp.
   */
  private function getActiveAlertNids(): array {
    $now = (new DrupalDateTime('now'))->format('U');

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'alert')
      ->condition('status', 1)
      ->condition('field_display_range.value', $now, '<=')
      ->condition('field_display_range.end_value', $now, '>=')
      ->sort('field_display_range.value', 'DESC');

    return array_values($query->execute());
  }

}
