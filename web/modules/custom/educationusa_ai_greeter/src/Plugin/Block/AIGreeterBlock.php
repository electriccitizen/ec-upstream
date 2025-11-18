<?php

namespace Drupal\educationusa_ai_greeter\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Plugin\PluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides the EducationUSA AI Greeter block.
 *
 * @Block(
 *   id = "educationusa_ai_greeter_block",
 *   admin_label = @Translation("EducationUSA AI Greeter"),
 *   category = @Translation("Custom")
 * )
 */
class AIGreeterBlock extends BlockBase implements ContainerFactoryPluginInterface {

  protected ConfigFactoryInterface $configFactory;

  /** @inheritdoc */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = new static($configuration, $plugin_id, $plugin_definition);
    $instance->configFactory = $container->get('config.factory');
    return $instance;
  }

  /** @inheritdoc */
  public function build() {
    $config = $this->configFactory->get('educationusa_ai_greeter.settings');
    $enabled = (bool) ($config->get('enabled') ?? TRUE);
    if (!$enabled) {
      return [];
    }

    // Optionally limit to front page only.
    $front_only = (bool) ($config->get('front_only') ?? FALSE);
    if ($front_only && !\Drupal::service('path.matcher')->isFrontPage()) {
      return [];
    }

    $assistant = $config->get('assistant');
    if (empty($assistant)) {
      return [
        '#markup' => $this->t('AI Greeter is not configured. Please select an AI Assistant in the settings.'),
      ];
    }

    // Prepare audience and CTA definitions (hard-coded POC, labels configurable).
    $audiences = [
      'student' => [
        'label' => $config->get('label_student') ?? $this->t("I’m a student"),
        'buttons' => [
          [ 'id' => 'student_steps', 'label' => $this->t('Learn about U.S. study steps') ],
          [ 'id' => 'student_aid', 'label' => $this->t('Find financial aid info') ],
          [ 'id' => 'student_advising', 'label' => $this->t('Find a local advising center') ],
        ],
      ],
      'hei' => [
        'label' => $config->get('label_hei') ?? $this->t('I’m from a higher education institution'),
        'buttons' => [
          [ 'id' => 'hei_events', 'label' => $this->t('View EducationUSA events') ],
          [ 'id' => 'hei_connect', 'label' => $this->t('Connect with advisers') ],
          [ 'id' => 'hei_recruit', 'label' => $this->t('Learn how to recruit students') ],
        ],
      ],
      'counselor' => [
        'label' => $config->get('label_counselor') ?? $this->t('I’m a high school counselor'),
        'buttons' => [
          [ 'id' => 'counselor_resources', 'label' => $this->t('Counselor resources') ],
          [ 'id' => 'counselor_connect', 'label' => $this->t('Connect with EducationUSA center') ],
          [ 'id' => 'counselor_admissions', 'label' => $this->t('Admissions basics for advising students') ],
        ],
      ],
    ];

    // CTA prompt mapping used by JS when clicked.
    $cta_prompts = [
      'student_steps' => (string) $this->t('I’m a student. Please explain the 5 steps to studying in the U.S.'),
      'student_aid' => (string) $this->t('I’m a student seeking financial aid information.'),
      'student_advising' => (string) $this->t('I’m a student – help me find a local EducationUSA advising center.'),
      'hei_events' => (string) $this->t('I represent a higher education institution and want to learn about EducationUSA events.'),
      'hei_connect' => (string) $this->t('I represent a higher education institution and want to connect with advisers.'),
      'hei_recruit' => (string) $this->t('I represent a higher education institution. Explain how to recruit international students using EducationUSA resources.'),
      'counselor_resources' => (string) $this->t('I’m a high school counselor looking for resources for my students.'),
      'counselor_connect' => (string) $this->t('I’m a high school counselor – help me connect with an EducationUSA center.'),
      'counselor_admissions' => (string) $this->t('I’m a high school counselor. Give me admissions basics to advise students.'),
    ];

    // Role messages by audience.
    $role_messages = [
      'student' => (string) $this->t('My role is: student looking for financial aid and admissions information.'),
      'hei' => (string) $this->t('My role is: higher education institution representative.'),
      'counselor' => (string) $this->t('My role is: high school counselor supporting students applying to U.S. colleges.'),
    ];

    // Build the inner DeepChat block programmatically using selected assistant.
    $block_manager = \Drupal::service('plugin.manager.block');
    $configuration = [
      'id' => 'ai_deepchat_block',
      'label' => $this->t('AI DeepChat'),
      'provider' => 'ai_chatbot',
      'ai_assistant' => $assistant,
      'bot_name' => 'EducationUSA AI',
      'first_message' => $this->t('Welcome! Select your role to get tailored help.'),
      'placement' => 'bottom-right',
      'style_file' => 'module:ai_chatbot:bard.yml',
      'collapse_minimal' => TRUE,
    ];
    $deepchat_instance = $block_manager->createInstance('ai_deepchat_block', $configuration);
    $deepchat_render = $deepchat_instance->build();

    // Unique wrapper id to scope JS to this block instance.
    $wrapper_id = 'ai-greeter-' . substr(hash('sha256', serialize($this->getConfiguration()) . microtime()), 0, 8);

    $build = [
      '#theme' => 'educationusa_ai_greeter',
      '#audiences' => $audiences,
      '#deepchat' => $deepchat_render,
      '#wrapper_id' => $wrapper_id,
      '#attached' => [
        'library' => [
          'educationusa_ai_greeter/greeter',
        ],
        'drupalSettings' => [
          'educationusa_ai_greeter' => [
            'wrapperId' => $wrapper_id,
            'audiences' => $audiences,
            'prompts' => $cta_prompts,
            'roles' => $role_messages,
          ],
        ],
      ],
    ];

    return $build;
  }
}
