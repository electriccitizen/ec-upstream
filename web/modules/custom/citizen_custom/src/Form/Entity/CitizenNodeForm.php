<?php

namespace Drupal\citizen_custom\Form\Entity;

use Drupal\Core\Form\FormStateInterface;

/**
 * Defines alteration functions required for node form classes
 * The functions take in and return the same set of values as hook_form_alter
 *
 * The handlers are automatically called by FormHandlers defined in the
 * FormHandler folder if the entities bundle class implements
 * FormOverrideInterface
 */
class CitizenNodeForm {

  /**
   * Alter the default form for a node
   */
  public function defaultFormAlter(array $form, FormStateInterface $form_state): array {
    return $form;
  }

  /**
   * Alter the edit form for a node
   */
  public function editFormAlter(array $form, FormStateInterface $form_state): array {
    return $form;
  }

}