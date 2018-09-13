#!/bin/bash

set -e

SOURCEDIR=$1

docker pull magland/mldevel_publish
docker run -v ~/.npmrc:/root/.npmrc -v $SOURCEDIR:/source magland/mldevel_publish npm
