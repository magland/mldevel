#!/bin/bash

set -e

REPOSITORY_URL=$1
REPOSITORY_TAG=$2

sudo docker build -t mldevel_publish docker
docker run -v ~/.anaconda:/root/.anaconda -it mldevel_publish conda $REPOSITORY_URL $REPOSITORY_TAG
