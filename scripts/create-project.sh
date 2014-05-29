#!/bin/bash

##########################################################
# http://ionicframework.com/docs/guide/installation.html #
##########################################################

if [ -z "$1" ]
  then
    echo "No project name supplied"
    exit
fi

# Create the project
ionic start "$1"
cd "$1"

# Configure platforms
ionic platform ios
ionic platform android

# Test it out
ionic build ios
ionic build android

# Clearing the defaults
rm www/index.html
rm www/js/*
rm www/css/style.css

# Cordova config
# We need to make some quick configuration changes to Cordova defaults to make sure our app behaves normally. Specifically, we need to turn off Web View bouncing that is on by default for iOS apps. Open up config.xml and add these preferences to the bottom:
# <preference name="webviewbounce" value="false" />
# <preference name="UIWebViewBounce" value="false" />
# <preference name="DisallowOverscroll" value="true" />
