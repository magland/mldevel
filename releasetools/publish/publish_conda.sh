#!/bin/bash

set -e

SOURCEDIR=$1

docker pull magland/mldevel_publish
docker run -v ~/.anaconda:/root/.anaconda -v $SOURCEDIR:/source -it magland/mldevel_publish conda
