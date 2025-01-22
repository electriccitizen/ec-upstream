EC-Upstream Local Development
=============================
Reviewed by Wilbur, 2025-01-21

# Project Details
- **NAME:** ec-upstream
- **URL:** http://dev-ec-upstream.pantheonsite.io/
- **LOCAL URL:** http://ec-upstream.docksal.site
- **BRANCH:** main
- **HOSTING:** [Pantheon Dashboard](https://dashboard.pantheon.io/sites/b043b678-2567-403a-aafc-947c7d9a76de#dev/code)
)
- **CIRCLE CI:** [Logs](https://app.circleci.com/pipelines/github/electriccitizen/ec-upstream)

## Requirements and platform docs

- [EC: Local development requirements](https://docs.google.com/document/d/1_yeISu5bW5637TCeXByi82LUUfD1jeeSDHh5IeiPz4o/edit?usp=sharing)
- [EC: Developing on Pantheon](https://docs.google.com/document/d/1oTBHep57WENbf8PnM4LSn2Zx6x5EKA1rSYDEMvBEsUY/edit)

# Local Development Setup

Follow these steps to install a local development environment.

`cd ~/Projects`

`git clone git@github.com:electriccitizen/ec-upstream.git ec-upstream`

```
cd ec-upstream
fin hosts add
fin cert
fin composer install
fin composer run sniff-enable
```

## Download and import the database

`fin drush @ec-upstream.dev sql-dump > database.sql`

`fin db import database.sql`

`fin drush cr`

## Import local configuration

`fin drush cim`

## Log into website as admin

`fin drush uli`

Open the generated login URL and you should be set to go.

# Refreshing your local environment
Whenever you start a new task, you'll want to refresh your local environment to pull in the latest changes from other developers.

```
cd ~/Projects/ec-upstream
git checkout main
git pull
fin restart
fin composer install
```

DB Pull - Optional
`fin drush @ec-upstream.dev sql-dump > database.sql`
`fin db import database.sql`
End DB Pull

`fin drush cr`

`fin drush cim`

`fin drush uli`

Open the generated login URL and you should be set to go.

# Code Standards
This project will automatically check any committed code to ensure that it
aligns with [Drupal Coding Standards](https://www.drupal.org/docs/develop/standards/php/php-coding-standards)
and will reject any commit that does not follow these standards.

There are many ways to configure your IDE to hint, format, and detect errors in
your Drupal code:

* [VSCode](https://marketplace.visualstudio.com/items?itemName=Stanislav.vscode-drupal)
* [PHPStorm](https://www.jetbrains.com/help/phpstorm/drupal-support.html)
* [Sublime Text](https://github.com/enzolutions/sublime-drupal)

To manually check from the command line, run the following command:

`composer run code-sniff`

To manually disable code sniffing, run:

`composer run sniff-disable`

To re-enable it again, run the command that enabled it during installation:

`composer run sniff-enable`

# Theming
The active theme for this project is **citizen_patterns**:
`~/Projects/ec-upstream/web/themes/citizen_patterns`

See the THEME-INSTALL.md file inside of the theme root for install instructions.
[THEME-INSTALL.md](/web/themes/citizen_patterns/THEME-INSTALL.md)

# Drush aliases

To interact with Pantheon via drush, you can use the Drush aliases that are auto-generated for each environment. For example:

**DEV, TEST**

* There is no LIVE environment for the EC-Upstream site.

These aliases are always available via:

```
@ec-upstream.dev
@ec-upstream.test
```
Note that not all projects will have all environments enabled.

**PR-NNN** (Multidevs)

Whenever you create a Github pull request, a new Pantheon multidev is created in the format `PR-NNN`  (e.g. PR-123) You can interact with this environment via:

```
@ec-upstream.pr-123
```

# Project Legend

## Docksal Images
- DB - docksal/mariadb:10.6
- CLI - docksal/cli:stable-php8.3
- SOLR - docksal/solr:1.0-solr3

See `~/Projects/ec-upstream/.docksal/docksal.yml`

## settings.docksal.php
- database connection
- hash_salt
- base_url
- development services
- error level
- CSS/JS aggregation
- rebuild_access
- permissions_hardening
- trusted_host_pattern
- file paths

See `/Projects/ec-upstream/web/sites/default/settings.docksal.php`

# Enabling Xdebug

Copy the `.docksal/docksal-local.yml.default` file to the .docksal folder as `docksal-local.yml` and ensure that `XDEBUG_ENABLED=1`

Open `.docksal/etc/php/php.ini` and uncomment the three lines of code directly under [xdebug]:

```
[xdebug]
xdebug.mode=debug
xdebug.discover_client_host=1
xdebug.client_host=192.168.64.100
```

Run `fin restart` to restart the Docksal project.

# Backstop Testing

Refer to [EC-BACKSTOP.md](/tests/backstop/EC-BACKSTOP.md) for complete instructions for Visual Regression Testing using Backstop JS.
