<?php

namespace Drupal\citizen_custom\Form;

use Drupal\citizen_custom\Form\Entity\CitizenNodeForm;

/**
 * Interface for a Node that needs to alter its forms via CitizenNodeForm class
 */
interface FormOverrideInterface {

  /**
   * Declare a CitizenNodeForm class that a bundle type will use to alter
   * its forms
   *
   * @return \Drupal\citizen_custom\Form\ENtity\CitizenNodeForm
   */
  public function getFormClass(): CitizenNodeForm;

}