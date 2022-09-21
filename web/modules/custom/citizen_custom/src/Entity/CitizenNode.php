<?php

namespace Drupal\citizen_custom\Entity;

use Drupal\node\Entity\Node;

/**
 * The base class for all nodes.
 */
class CitizenNode extends Node implements CitizenNodeInterface {

  use PublishedClassTrait;
  use HasMainImageTrait;
}