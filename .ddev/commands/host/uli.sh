#!/usr/bin/env bash

## Description: ddev drush uli - User login substitute
## Usage: ddev uli

# Abort if anything fails
set -e
ddev exec drush uli "$@" --uri=${DDEV_SITENAME}.${DDEV_TLD}