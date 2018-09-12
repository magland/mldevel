#!/bin/bash

set -e

sudo docker build -t mlstatus docker
docker run -v $PWD/kbnode:/kbnode -it mlstatus
