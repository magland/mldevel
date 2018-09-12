#!/bin/bash

trap 'kill %1; kill %2;' SIGINT

python3 run_mlstatus.py &
kbucket-host /kbnode --auto

