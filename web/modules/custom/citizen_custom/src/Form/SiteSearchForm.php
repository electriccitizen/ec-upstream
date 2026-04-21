<?php

namespace Drupal\citizen_custom\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\Routing\RouteProvider;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Builds the search form for the search block.
 *
 * @internal
 */
class SiteSearchForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  protected $routeProvider;

  /**
   * Class constructor.
   */
  public function __construct(RouteProvider $routeProvider) {
    $this->routeProvider = $routeProvider;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    // Instantiates this form class.
    return new static(
      // Load the service required to construct this class.
      $container->get('router.route_provider')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'site_search_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $route_match = $this->routeProvider->getRoutesByNames(['view.site_search.search_results']);

    if (count($route_match)) {
      $route = 'view.site_search.search_results';
      $form['#action'] = Url::fromRoute($route)->toString();
    }
    else {
      $form['#action'] = '/site-search';
    }
    $form['#method'] = 'get';

    $form['site_search_api_fulltext'] = [
      '#type' => 'textfield',
      '#label' => 'Search',
      '#title' => $this->t('Search'),
      '#title_display' => 'invisible',
      '#name' => 'site_search_api_fulltext',
      '#size' => 30,
      '#default_value' => '',
      '#placeholder' => 'Enter keyword(s)',
      '#attributes' => [
        'class' => ['site-search--fulltext'],
      ],
    ];

    $form['actions'] = [
      '#type' => 'actions',
      '#id' => 'edit-site-search-actions',
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#id' => 'edit-site-search-submit',
      '#value' => $this->t('Search'),
      // Prevent op from showing up in the query string.
      '#name' => '',
    ];

    // Decorative search icon rendered as a sibling of the submit button.
    // Wrapped in Markup::create() because the render pipeline XSS-filters
    // plain strings (which strips <svg>/<path>).
    // Mirrors components/03-composites/blocks/search/search-icon.svg.
    $form['actions']['search_icon'] = [
      '#markup' => Markup::create('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M8.33333 7.33333H7.80667L7.62 7.15333C8.27333 6.39333 8.66667 5.40667 8.66667 4.33333C8.66667 1.94 6.72667 0 4.33333 0C1.94 0 0 1.94 0 4.33333C0 6.72667 1.94 8.66667 4.33333 8.66667C5.40667 8.66667 6.39333 8.27333 7.15333 7.62L7.33333 7.80667V8.33333L10.6667 11.66L11.66 10.6667L8.33333 7.33333ZM4.33333 7.33333C2.67333 7.33333 1.33333 5.99333 1.33333 4.33333C1.33333 2.67333 2.67333 1.33333 4.33333 1.33333C5.99333 1.33333 7.33333 2.67333 7.33333 4.33333C7.33333 5.99333 5.99333 7.33333 4.33333 7.33333Z" fill="currentColor"/></svg>'),
      '#weight' => 10,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

}
