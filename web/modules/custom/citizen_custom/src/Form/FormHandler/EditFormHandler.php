<?php

namespace Drupal\citizen_custom\Form\FormHandler;

use Drupal\citizen_custom\Form\FormOverrideInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\NodeForm;

/**
 * Connects a bundle class specified form class with entity edit
 * form building logic
 */
class EditFormHandler extends NodeForm {

  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    if ($this->entity instanceof FormOverrideInterface) {
      $entityFormClass = $this->entity->getFormClass();
      $form = $entityFormClass->editFormAlter($form, $form_state);
    }

    return $form;
  }
}