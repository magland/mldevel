#!/bin/bash

set -e

SOURCEDIR=$1

docker pull magland/mldevel_publish
if [ -z "$ANACONDA_API_TOKEN" ]; then
	ANACONDA_API_TOKEN=`cat ~/.anaconda`
fi
docker run -e "ANACONDA_API_TOKEN=$ANACONDA_API_TOKEN" -v $SOURCEDIR:/source magland/mldevel_publish conda
