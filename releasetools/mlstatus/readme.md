# MLStatus

This is a service that is meant to be run in a Docker container somewhere. It checks the various package repositories and reports the current version of each of the MountainLab-related packages. The results can be viewed on the web.

For example (if it is working): [https://kbucket.flatironinstitute.org/b91898d4911f/download/status.html](https://kbucket.flatironinstitute.org/b91898d4911f/download/status.html)

## Prerequisites

Docker and sudo privileges.

## Running

You must create a kbucket share

```
cd mlstatus
mkdir kbnode
kbucket-share kbnode
```

Answer the questions to create the share, and then after it has successfully connected, `ctrl+c` to close the share. Make a note of the kbucket node id (you will need it to retrieve the data). It is important that this directory is not committed into the source repo (it will have secret keys).

The following will build the container and start the service

```
./start.sh
```

The service will generate a status.html file every few minutes, and it can be viewed at `https://kbucket.flatironinstitute.org/[kbucket-node-id]/download/status.html`, where you must replace `[kbucket-node-id]` with the appropriate kbucket node id. See the example at the top of this file.



