#!/bin/bash

set -e

REPOSITORY_URL=$1
REPOSITORY_TAG=$2

sudo docker build -t publish_npm docker
docker run -v ~/.npmrc:/working/.npmrc -it publish_npm $REPOSITORY_URL $REPOSITORY_TAG