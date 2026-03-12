---
name: refresh-local
description: Refresh the local ddev environment with latest code and database from Pantheon. Use when the user wants to pull a fresh local, reset their environment, or start a new task.
allowed-tools: Bash
---

Refresh the local development environment by running the following steps in order. Run each command one at a time and confirm it succeeds before moving to the next. If any step fails, stop and report the error.

## Steps

1. Make sure we are in the project root directory (where .ddev/ lives)
2. Check out the main branch and pull the latest code:
```
git checkout main
git pull
```
3. Start ddev and install dependencies:
```
ddev start
ddev composer install
```
4. Pull a fresh database from the dev environment:
```
ddev drush @ec-upstream.dev sql-dump > database.sql
ddev import-db --file=database.sql
```
5. Clear cache, import config, and generate a login URL:
```
ddev drush cr
ddev drush cim -y
ddev drush uli
```
6. Open the generated login URL in the browser automatically.

## Important
- Run each command sequentially — do not batch them into a single shell command.
- If `ddev start` fails, try `ddev restart` instead.
- If `ddev auth ssh` fails, let me know — I may need to re-authenticate my Pantheon SSH key.
- The `ddev drush cim -y` flag auto-confirms the config import. If there are config conflicts, stop and report them to me before proceeding.
- After all steps complete, give me a brief summary: whether the DB was imported successfully, if config import had any changes, and the login URL.
