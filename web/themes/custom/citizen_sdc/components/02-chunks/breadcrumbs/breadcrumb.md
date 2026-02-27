# Breadcrumb Component 

## Custom Variables
The bredcrumb component uses a custom Twig variables some Drupal breadcrumb--content-type.html.twig templates to make data from the current node accessible from the breadcrumb template level.  This custom variable is:
- currentNode

It makes all Twig variables from the node available to breadcrumbs and is used to set the current node title breadcrumb for content types not in the menu breadcrumb system. It can also be used to pull logic from the node if you need to set breadcrumbs based on certain field out (like catgory specific breadcrumbs).