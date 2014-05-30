#!/bin/bash

# NOTE: Java and ANT dependencies (configure JAVA_HOME and PATH before install!)

###########################################################################################
# http://cordova.apache.org/docs/en/3.5.0/guide_platforms_index.md.html#Platform%20Guides #
# http://developer.android.com/sdk/index.html                                             #
###########################################################################################

# Download

os="linux"
arch="x86"
ver="20140321"

if [ ! -z $1 ] && [ $1 -eq 64 ]; then
	arch="x86_64"
fi

name="adt-bundle-$os-$arch-$ver"
echo "downloading $name..."
wget http://dl.google.com/android/adt/22.6.2/$name.zip

# Installation

dest="~/.android"
path="$dest/$name"

echo "installing android sdk at $path..."
mkdir $dest || rm -rf $path
unzip $name.zip && sleep 3 && mv $name $dest/ && rm $name.zip

# Configuration

echo "configuring bash profile..."
cmd="export PATH=\${PATH}:$path/sdk/platform-tools:$path/sdk/tools"
eval $cmd
echo "
# Android SDK
$cmd" >> ~/.bash_profile

echo "done"
