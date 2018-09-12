#!/bin/bash

set -e

REPOSITORY_URL=$1
REPOSITORY_TAG=$2

cp .npmrc ~/.npmrc

git clone $REPOSITORY_URL source
cd source
git checkout refs/tags/$REPOSITORY_TAG
npm install
npm test

PRERELEASE_SCRIPT=devel/prerelease_test_within_container.sh
if [ -f $PRERELEASE_SCRIPT ]; then
   echo "Running $PRERELEASE_SCRIPT"
   $PRERELEASE_SCRIPT
fi

npm publish

#devel/conda_build.sh
#devel/conda_upload.sh

