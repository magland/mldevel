FROM continuumio/anaconda3:latest

RUN conda install python=3.6
RUN conda install nodejs=8.11
RUN conda install conda-build

RUN apt-get install -y jq

ADD . /working
WORKDIR /working

ENTRYPOINT ["./entrypoint.sh"]

