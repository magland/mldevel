#!/bin/bash

set -e

COMMAND=$1

cd /source
npm install
npm test

PRERELEASE_SCRIPT=devel/prerelease_test_within_container.sh
if [ -f $PRERELEASE_SCRIPT ]; then
   echo "Running $PRERELEASE_SCRIPT"
   $PRERELEASE_SCRIPT
fi

if [ "$COMMAND" == "npm" ]; then
	npm publish
elif [ "$COMMAND" == "conda" ]; then
	export CONDA_PREFIX=/opt/conda
	devel/conda_build.sh
	devel/conda_upload.sh
elif [ "$COMMAND" == "pypi" ]; then
	devel/publish.sh
else
	echo "Invalid command: $COMMAND"
	exit -1
fi

#devel/conda_build.sh
#devel/conda_upload.sh

