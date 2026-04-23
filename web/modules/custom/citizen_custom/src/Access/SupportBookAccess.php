<?php

declare(strict_types=1);

namespace Drupal\citizen_custom\Access;

use Drupal\Core\Session\AccountInterface;

/**
 * Central role helper for support_book visibility decisions.
 *
 * One definition of "elevated" so the access handler, exception subscriber,
 * views preprocess, and theme code can't drift. An elevated user is allowed
 * to see `site_management`-typed support_book nodes; everyone else is
 * restricted to `content`-typed ones.
 */
class SupportBookAccess {

  /**
   * Roles that grant elevated access to support_book site_management content.
   */
  private const ELEVATED_ROLES = [
    'administrator',
    'site_manager',
  ];

  /**
   * Whether the given account may view site_management support pages.
   */
  public function isElevated(AccountInterface $account): bool {
    if ((int) $account->id() === 1) {
      return TRUE;
    }
    return (bool) array_intersect(self::ELEVATED_ROLES, $account->getRoles());
  }

}
