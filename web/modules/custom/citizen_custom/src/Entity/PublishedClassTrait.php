<?php

namespace Drupal\citizen_custom\Entity;

trait PublishedClassTrait {

  public function getPublishedClass(): string {
    if ($this->isPublished()) {
      return 'published';
    } else {
      return 'unpublished';
    }
  }
}