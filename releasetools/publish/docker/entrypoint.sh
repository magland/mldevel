#!/bin/bash

set -e

COMMAND=$1

cd /source
if [ -f "package.json" ]; then
	npm install
	npm test
elif [ -f "setup.py" ]; then
	pip install .
fi

PRERELEASE_SCRIPT=devel/prerelease_test_within_container.sh
if [ -f $PRERELEASE_SCRIPT ]; then
   echo "Running $PRERELEASE_SCRIPT"
   $PRERELEASE_SCRIPT
fi

if [ "$COMMAND" == "npm" ]; then
	npm publish
elif [ "$COMMAND" == "conda" ]; then
	export CONDA_PREFIX=/opt/conda # Probably no longer needed
	conda config --set anaconda_upload yes
	devel/conda_build.sh
elif [ "$COMMAND" == "pypi" ]; then
	devel/publish.sh
else
	echo "Invalid command: $COMMAND"
	exit -1
fi

#devel/conda_build.sh
#devel/conda_upload.sh

