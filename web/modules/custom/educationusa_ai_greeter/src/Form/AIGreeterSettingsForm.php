<?php

namespace Drupal\educationusa_ai_greeter\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Settings form for the EducationUSA AI Greeter.
 */
class AIGreeterSettingsForm extends ConfigFormBase {

  /** @inheritdoc */
  protected function getEditableConfigNames() {
    return ['educationusa_ai_greeter.settings'];
  }

  /** @inheritdoc */
  public function getFormId() {
    return 'educationusa_ai_greeter_settings_form';
  }

  /** @inheritdoc */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('educationusa_ai_greeter.settings');

    $form['enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable AI greeter'),
      '#default_value' => $config->get('enabled') ?? TRUE,
    ];

    $form['front_only'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show on front page only'),
      '#default_value' => $config->get('front_only') ?? FALSE,
    ];

    // Load ai_assistant entities to select which DeepChat assistant to use.
    $assistants = [];
    $storage = \Drupal::entityTypeManager()->getStorage('ai_assistant');
    foreach ($storage->loadMultiple() as $id => $entity) {
      $assistants[$id] = $entity->label();
    }

    $form['assistant'] = [
      '#type' => 'select',
      '#title' => $this->t('AI Assistant'),
      '#description' => $this->t('Select the AI assistant used by the embedded DeepChat chatbot.'),
      '#options' => $assistants,
      '#default_value' => $config->get('assistant') ?? '',
      '#required' => TRUE,
    ];

    $form['audiences'] = [
      '#type' => 'details',
      '#title' => $this->t('Audience labels'),
      '#open' => TRUE,
    ];

    $form['audiences']['label_student'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Student label'),
      '#default_value' => $config->get('label_student') ?? $this->t("I’m a student"),
    ];
    $form['audiences']['label_hei'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Higher Education Institution label'),
      '#default_value' => $config->get('label_hei') ?? $this->t('I’m from a higher education institution'),
    ];
    $form['audiences']['label_counselor'] = [
      '#type' => 'textfield',
      '#title' => $this->t('High School Counselor label'),
      '#default_value' => $config->get('label_counselor') ?? $this->t('I’m a high school counselor'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /** @inheritdoc */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $this->configFactory()->getEditable('educationusa_ai_greeter.settings')
      ->set('enabled', (bool) $form_state->getValue('enabled'))
      ->set('front_only', (bool) $form_state->getValue('front_only'))
      ->set('assistant', $form_state->getValue('assistant'))
      ->set('label_student', $form_state->getValue(['audiences', 'label_student']))
      ->set('label_hei', $form_state->getValue(['audiences', 'label_hei']))
      ->set('label_counselor', $form_state->getValue(['audiences', 'label_counselor']))
      ->save();
  }
}
