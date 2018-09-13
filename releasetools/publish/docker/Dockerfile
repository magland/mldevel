FROM continuumio/anaconda3:latest

RUN conda install python=3.6
RUN conda install nodejs=8.11
RUN conda install conda-build

RUN conda install -c conda-forge jq
RUN conda install -c conda-forge twine 

ADD entrypoint.sh /working/entrypoint.sh
WORKDIR /working

ENTRYPOINT ["./entrypoint.sh"]

