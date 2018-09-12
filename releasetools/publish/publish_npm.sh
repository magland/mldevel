#!/bin/bash

set -e

REPOSITORY_URL=$1
REPOSITORY_TAG=$2

sudo docker build -t mldevel_publish docker
docker run -v ~/.npmrc:/root/.npmrc -it mldevel_publish npm $REPOSITORY_URL $REPOSITORY_TAG
