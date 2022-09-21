<?php

namespace Drupal\citizen_custom\Entity;

trait HasMainImageTrait {

  public function hasMainImage(): bool {
    if ($this->get('field_image')->isEmpty()){
      return FALSE;
    }
    return TRUE;
  }
}