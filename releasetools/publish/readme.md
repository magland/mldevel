## mldevel/publish

### To push to dockerhub

If you modify the code in docker/, you will want to push the new version to dockerhub:

```
sudo docker build -t magland/mldevel_publish docker
```

### To publish a package on npm

Be sure that you are logged in, so that your credentials are stored in ~/.bashrc. Then:

```
./publish_npm.sh [source-directory]
```

### To publish a package on npm

Put your anaconda API token in ~/.anaconda (be careful!). Then:

```
./publish_conda.sh [source-directory]
```

