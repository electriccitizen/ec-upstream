<?php

namespace Drupal\citizen_custom\Entity;

use Drupal\citizen_custom\Form\Entity\NewsForm;
use Drupal\citizen_custom\Form\Entity\CitizenNodeForm;
use Drupal\citizen_custom\Form\FormOverrideInterface;

class News extends CitizenNode implements FormOverrideInterface {

  /**
   * A bundle class for the News content type.
   */
  public function getFormClass(): CitizenNodeForm {
    return new NewsForm();
  }

}