# THEME-INSTALL.md

## ABOUT CITIZEN SDC THEME

For Drupal 11, Citizen SDC (single directory component) uses the Stable9 theme starting place, and is meant to expand on that to theme this website.

This theme is compiled using SDC Sass via the SDC VM. This is the fastest, cleanest, most modern way of using Sass. All Sass for SDC components (01-parts thru 03-composites) is written in .scss files compiled directly in each SDC folder (SDC folders can be identified by having a .components.yml). 00-base holds all the non-SDC base styles for the site (variables, mixins, form elements, global non-SDC styles, etc). 00-base files are included in SDC .scss files via @use as needed and some are also forwarded to the main style.scss that outputs global non-SDC CSS.

## GETTING STARTED

Working with Citizen SDC requires a few things:

To get started:
(a) get a local site instance spun up following the instructions in the project root.
(b) Make sure you have SDC Sass installed globally.  On Macs and Linux you can install it with a single command using Homebrew.  From your root ./~ folder, run
```
brew install sass/sass/sass
```
(d) cd into the folder for Citizen SDC and you are ready to start running the theme. The theme can be ran in multiple different ways from the theme root:
(d1) Create a .bash_profile or .zshrc alias for the sass watch command:
```
sass --watch components  --style compressed
```
(d2) or just run the command manually from the command line while in the theme root.

## WORKING

(a) cd into the Citizen SDC folder
(b) run your alias command or the full command above.

## ADDITIONAL

All preprocess hooks should be put into a relevant include file, located in the /includes folder, as opposed to directly into citizen_sdc.theme.

## Code Standards

Citizen SDC follows the [Drupal Coding Standards](https://www.drupal.org/docs/develop/standards),
specifically applying to the [CSS formatting guidelines](https://www.drupal.org/docs/develop/standards/css/css-formatting-guidelines)
and [Twig coding standards](https://www.drupal.org/docs/develop/coding-standards/twig-coding-standards).

## File Structure

Citizen SDC applies a variation of the atmoic design structure. All mixins and variables are kept in folders in 00-Base. All non-SDC form element and global styles are also kept in 00-base and are compiled into styles.css.

Site building elements scale up from there in 01-Parts, 02-Chunks, and 03-Composites. These folders all hold SDC components. If you are adding non-SDC files/folders to these parent folders you are likely incorrect.

SDC component folders should all have a .component.yml outlining the structure of the component (props and slots) and a .twig file that has the component's HTML structure with variables/blocks drawn from the props and slots of the .component.yml file that will be replaced either when the SDC component is inherited into other SDC components or into Drupal.

SDC components can optionally have .scss and JS files. Any .scss file in an SDC component *must not start with _* so that it compiles its .css into its SDC folder so Drupal can correctly attach it to the component when rendered.

If the SDC component is going to be rendered in Drupal, there must be a Drupal .html.twig template in /templates that inherits the .twig template from the SDC component and changes its variables into Drupal output variables.
