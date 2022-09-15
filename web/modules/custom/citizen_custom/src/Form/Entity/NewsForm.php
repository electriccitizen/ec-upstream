<?php

namespace Drupal\citizen_custom\Form\Entity;

use Drupal\Core\Form\FormStateInterface;

/**
 * Provides alterations for News forms
 *
 * NOTE: This class is currently used as an example. If a bundle class
 * form isn't doing any alterations - like this one is currently - it does
 * not need this setup.
 *
 * @todo Remove the above comment after adding custom alter logic
 */
class NewsForm extends CitizenNodeForm {

  /**
   * Alter the edit form for a News node
   */
  public function editFormAlter(array $form, FormStateInterface $form_state): array {
    $this->newsFormAlter($form);
    return $form;
  }

  private function newsFormAlter(array &$form) {
    $form['promote']['widget']['value']['#title'] = 'Add to Featured Events';
    $form['promote']['widget']['value']['#description'] = 'Should have a news image.';
    return $form;
  }
}