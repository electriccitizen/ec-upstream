<?php

namespace Drupal\citizen_custom\Entity;

use Drupal\citizen_custom\Form\Entity\EventForm;
use Drupal\citizen_custom\Form\Entity\CitizenNodeForm;
use Drupal\citizen_custom\Form\FormOverrideInterface;

class Event extends CitizenNode implements FormOverrideInterface {

  /**
   * A bundle class for the Event content type.
   */
  public function getFormClass(): CitizenNodeForm {
    return new EventForm();
  }

}