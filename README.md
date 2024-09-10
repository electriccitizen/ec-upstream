# ec-upstream

[![CircleCI](https://circleci.com/gh/electriccitizen/ec-upstream.svg?style=shield)](https://circleci.com/gh/electriccitizen/ec-upstream)
[![Dashboard ec-upstream](https://img.shields.io/badge/dashboard-ec_upstream-yellow.svg)](https://dashboard.pantheon.io/sites/b043b678-2567-403a-aafc-947c7d9a76de#dev/code)
[![Dev Site ec-upstream](https://img.shields.io/badge/site-ec_upstream-blue.svg)](http://dev-ec-upstream.pantheonsite.io/)

Ec-upstream is a Composer-based Drupal application hosted on [Pantheon](http://dashboard.getpantheon.com).

## Onboarding

* Refer to [EC-INSTALL.md](/EC-INSTALL.md) for local development instructions.

* Refer to [THEME-INSTALL.md](/web/themes/citizen_patterns/THEME-INSTALL.md) for Theme Building instructions.

* Refer to [EC-BACKSTOP.md](/tests/backstop/EC-BACKSTOP.md) for complete instructions for Visual Regression Testing using Backstop JS.

## Important notes

## Search Demo

To test the new Search components, do the following:

1. Ensure you've run a composer install and a config import since switching to this branch.
2. Create a new Landing Page titled "Search Demo" or something similar.
3. Edit the Layout of the page and add a Section.
4. Pick one of the new Search Layouts. I normally go with the Two Column. Using one of these layouts is necessary in order for the web components to render properly.
5. Add the "Results" block to this new Search section.
6. Add the "Search Input" block to this new Search section.
7. Save the page.
8. Enter a query into the Search Input field and hit Enter.
9. See the results appear (unthemed and kind of gross looking) immediately!
