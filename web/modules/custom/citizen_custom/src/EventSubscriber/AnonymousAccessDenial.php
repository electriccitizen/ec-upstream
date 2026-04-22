<?php

declare(strict_types=1);

namespace Drupal\citizen_custom\EventSubscriber;

use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Blocks anonymous users from restricted entity canonical pages.
 *
 * Covers canonical routes for media, taxonomy_term, webform, and nodes of
 * bundle `alert` or `support_book`. Anonymous visitors get a 403 — same
 * behavior as any other Drupal access denial, so response codes stay
 * consistent sitewide. Drupal renders the site's 403 page (including the
 * standard "sign in" link anonymous users see there). Replaces the
 * page-template-based anonymous gating that used to live in
 * `page--webform.html.twig` et al.
 *
 * Role-based access (e.g. the support_book `site_management` type) is
 * intentionally out of scope for this subscriber and is handled
 * separately by entity access rules.
 */
class AnonymousAccessDenial implements EventSubscriberInterface {

  /**
   * Routes that are always restricted to authenticated users.
   */
  private const RESTRICTED_ROUTES = [
    'entity.media.canonical',
    'entity.taxonomy_term.canonical',
    'entity.webform.canonical',
  ];

  /**
   * Node bundles whose canonical routes are restricted.
   */
  private const RESTRICTED_NODE_BUNDLES = [
    'alert',
    'support_book',
  ];

  public function __construct(
    private readonly AccountInterface $currentUser,
    private readonly RouteMatchInterface $routeMatch,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    // Priority 30: after Symfony's RouterListener (32) so the route and
    // its parameters are resolved, and after Drupal's authentication
    // subscriber (300) so `currentUser` reflects the real identity.
    return [
      KernelEvents::REQUEST => ['onRequest', 30],
    ];
  }

  /**
   * Throws 403 for anonymous users on restricted routes.
   */
  public function onRequest(RequestEvent $event): void {
    // Ignore sub-requests (inline block rendering, ajax fragments, etc.)
    // so internal renders for authenticated contexts aren't intercepted.
    if ($event->getRequestType() !== HttpKernelInterface::MAIN_REQUEST) {
      return;
    }

    if ($this->currentUser->isAuthenticated()) {
      return;
    }

    $route_name = $this->routeMatch->getRouteName();
    if ($route_name === NULL) {
      return;
    }

    if (!$this->isRestricted($route_name)) {
      return;
    }

    // Throw the HTTP-level exception — Drupal's ExceptionHtmlSubscriber
    // picks it up and renders the site's configured 403 page. Matches
    // core's access-denied behavior for any other restricted route.
    throw new AccessDeniedHttpException();
  }

  /**
   * Whether the current route should block anonymous users.
   */
  private function isRestricted(string $route_name): bool {
    if (in_array($route_name, self::RESTRICTED_ROUTES, TRUE)) {
      return TRUE;
    }

    if ($route_name === 'entity.node.canonical') {
      $node = $this->routeMatch->getParameter('node');
      if ($node && in_array($node->bundle(), self::RESTRICTED_NODE_BUNDLES, TRUE)) {
        return TRUE;
      }
    }

    return FALSE;
  }

}
