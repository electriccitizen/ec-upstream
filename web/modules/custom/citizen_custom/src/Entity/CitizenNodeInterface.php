<?php

namespace Drupal\citizen_custom\Entity;

/**
 * Specifies methods to be implemented by CitizenNode class and its subclasses
 */
interface CitizenNodeInterface {
//or make this bool and add class in template?
  public function getPublishedClass(): string;

  public function hasMainImage(): bool;

}
