EC-Upstream Local Development
=============================
Reviewed by Adam, 2025-04-04

# Project Details
- **NAME:** ec-upstream
- **URL:** https://dev-ec-upstream.pantheonsite.io/
- **LOCAL URL:** https://ec-upstream.ddev.site
- **BRANCH:** main
- **HOSTING:** [Pantheon Dashboard](https://dashboard.pantheon.io/sites/b043b678-2567-403a-aafc-947c7d9a76de#dev/code)
)
- **CIRCLE CI:** [Logs](https://app.circleci.com/pipelines/github/electriccitizen/ec-upstream)

## Requirements and platform docs

- [EC: Local development requirements](https://docs.google.com/document/d/1_yeISu5bW5637TCeXByi82LUUfD1jeeSDHh5IeiPz4o/edit?usp=sharing)
- [EC: Developing on Pantheon](https://docs.google.com/document/d/1oTBHep57WENbf8PnM4LSn2Zx6x5EKA1rSYDEMvBEsUY/edit)


# Local Development Setup

Follow these steps to install a local development environment with DDev.

```
cd ~/Projects
git clone git@github.com:electriccitizen/ec-upstream.git ec-upstream
cd ec-upstream
ddev start
ddev composer install
ddev sniffon
ddev auth ssh
```

## Download and import the database

```
ddev drush @ec-upstream.dev sql-dump > database.sql
ddev import-db --file=database.sql
ddev drush cr
ddev drush cim
ddev drush uli
```

Open the generated login URL and you should be set to go.

# Refreshing your local environment with Docksal
Whenever you start a new task, you'll want to refresh your local environment to pull in the latest changes from other developers.

```
cd ~/Projects/ec-upstream
git checkout main
git pull
ddev start
ddev composer install
ddev auth ssh
```

DB Pull - Optional
```
ddev drush @ec-upstream.dev sql-dump > database.sql
ddev import-db database.sql
```
End DB Pull

```
ddev drush cr
ddev drush cim
ddev drush uli
```

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

`ddev composer run code-sniff`

To manually disable code sniffing, run:

`ddev sniffoff`

To re-enable it again, run the command that enabled it during installation:

`ddev sniffon`

# Theming
The active theme for this project is **citizen_patterns**:
`~/Projects/ec-upstream/web/themes/citizen_patterns`

See the THEME-INSTALL.md file inside of the theme root for install instructions.
[THEME-INSTALL.md](/web/themes/citizen_patterns/THEME-INSTALL.md)

# Drush aliases

To interact with Pantheon via drush, you can use the Drush aliases that are auto-generated for each environment. For example:

**DEV**

* There is no LIVE or TEST environment for the EC-Upstream site.

These aliases are always available via:

```
@ec-upstream.dev
```
Note that not all projects will have all environments enabled.

**PR-NNN** (Multidevs)

Whenever you create a Github pull request, a new Pantheon multidev is created in the format `PR-NNN`  (e.g. PR-123) You can interact with this environment via:

```
@ec-upstream.pr-123
```

# Project Legend

## DDev
php_version: "8.3"
webserver_type: nginx-fpm
database:
    type: mariadb
    version: "10.6"
See `~/Projects/ec-upstream/.ddev/config.yaml`

# XDebug

Enable xdebug by running `ddev xdebug`. It will remain enabled for the entirety of your session and you can re-enable when needed. This should remain off in the DDEV config.  

Auto Configuration for PHPStorm:

1. Turn on the listener in PHPStorm
2. Add a breakpoint at the top of web/index.php
3. Visit a page on the
4. This should prompt a dialog that sets up your server
5. The defaults should work

For other platforms and documentation see:

[DDEV DOCS](https://ddev.readthedocs.io/en/stable/users/debugging-profiling/step-debugging/)

# Backstop Testing

Refer to [EC-BACKSTOP.md](/tests/backstop/EC-BACKSTOP.md) for complete instructions for Visual Regression Testing using Backstop JS.
