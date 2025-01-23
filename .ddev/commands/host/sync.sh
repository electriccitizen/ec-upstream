#!/usr/bin/env bash

## Description: Sync your local environment with fresh data and code from Pantheon development environment.
## Usage: ddev sync

# Project Settings
REPO_BRANCH=main
SITEDIR_PATH=${DDEV_DOCROOT}/sites/default

# Abort if anything fails
set -e

start=$SECONDS

# Console colors
red=`tput setaf 1`
green=`tput setaf 2`
green_bg=`tput setaf 1; tput setab 2`
yellow=`tput setaf 3; tput setab 234`
NC=`tput sgr0`

echo-red () { echo -e "${red}$1${NC}"; }
echo-green () { echo -e "${green}$1${NC}"; }
echo-green-bg () { echo -e "${green_bg}$1${NC}"; }
echo-yellow () { echo -e "${yellow}$1${NC}"; }

cd ${DDEV_DOCROOT}

# Check for a clean repository
if ! [ -z "$(git status --untracked-files=no --porcelain)" ]; then
  # Uncommitted changes in tracked files
  echo -e
  echo -e  "${red}WARNING: You have uncommitted changes in your branch.${NC}"
  echo
  git status
  echo -e
  read -p "Continue (y/n)?" choice
    case "$choice" in 
      y|Y ) echo "Fair enough, let's do this!";;
      n|N ) echo "Exiting"; exit;;
      * ) echo "invalid"; exit;;
    esac
fi

# Project Files - Pull from Github
echo -e  "${green_bg} Get latest code ${NC}${yellow} Pulling ${REPO_BRANCH} branch from Github...${NC}"
git checkout ${REPO_BRANCH}
git pull 

# ddev Restart
echo -e  "${green_bg} ddev Restart ${NC}${yellow} Restart ddev to get latest container updates...${NC}"
ddev restart

# Set File paths if they do not exist
if [ ! -d ${SITEDIR_PATH}/files/private ]; then
  mkdir ${SITEDIR_PATH}/files/private;
fi

# Composer Install
echo -e  "${green_bg} Composer Install ${NC}${yellow} to install latest updates from composer.json...${NC}"
rm -rf vendor
rm -rf web/core
rm -rf web/libraries
rm -rf web/modules/contrib
rm -rf web/themes/contrib
ddev composer install

if [ "$1" == 'pull' ]; then
  start2=$SECONDS
  echo -en "${green_bg} ddev Pull ${NC}${yellow} Starting Pantheon DB Pull... ${NC}"
  ddev pull --skip-files -y
  ## Calculate Process time
  duration2=$(( SECONDS - start2 ))
fi

# Start database sync
if [ -n "$1" ] &&  [ "$1" != "pull" ]; then
  FILE="$1"
  echo -e "${green_bg} ddev db import ${NC}${yellow} from "${FILE}" ${NC}"
  ddev import-db ${FILE}
elif [ "$1" != "pull" ]; then
  echo -e "${green_bg} No DB Import ${NC}${yellow} (add file name to end of command)${NC}"
fi

# Cache Rebuild
echo -e "${green_bg} Drush cr ${NC}${yellow} Cache Rebuild...${NC}"
ddev drush cr

# Update DB
echo -e "${green_bg} Drush updb ${NC}${yellow} updatee database...${NC}"
ddev drush updb -y

# Config Import
echo -e "${green_bg} Drush cim -y ${NC}${yellow} Import config...${NC}"
ddev drush cim -y

# Config Import
echo -e "${green_bg} Drush cim -y ${NC}${yellow} Import config again to be sure...${NC}"
ddev drush cim -y

## Calculate Process time
duration=$(( SECONDS - start ))
## Echo Process time
echo -e
if [ "$1" == 'pull' ]; then
  echo -e "${green_bg} Pull runtime ${NC}${yellow} ${duration2} seconds ${NC}"
fi
echo -e "${green_bg} Sync runtime ${NC}${yellow} ${duration} seconds ${NC}"
echo -e
echo -e "${green_bg} SYNC COMPLETE! ${NC} "
echo -e "Open ${yellow}http://${VIRTUAL_HOST}${NC} in your browser to verify the setup.${NC}"
echo -e
echo -e "${green_bg} ddev drush uli! ${NC} "
ddev drush uli

exit

sleep 2
