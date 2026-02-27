# Webform Component 

## Custom Variables
The webform component uses a few custom Twig variables in both webform.twig and the webform.html.twig that inherits it.  These custom variables are:
- webformPlacer
- showFormTitle

The webform placer and show form title variables come from the /includes/citizen_sdc.form.inc proprocess. That preprocess fetches the same two variables (but in snake case: webform_placer and show_form_title) from the /includes/citizen_sdc.paragraph.inc form placer paragraph preprocess hook. This ensures that the form placer paragraph controls the rendering of the webform title and renders it as a widget-title div instead of an H1 in the form placer.