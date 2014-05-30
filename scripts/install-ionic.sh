#!/bin/bash

##########################################################
# http://ionicframework.com/docs/guide/installation.html #
##########################################################

# Install cordova
sudo apt-get install npm
sudo npm install -g cordova

# Install ionic
sudo npm install -g gulp ionic

# Some linux distributions install "nodejs" instead of "node"
sudo ln -s /usr/bin/nodejs /usr/bin/node
