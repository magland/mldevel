FROM continuumio/miniconda3:latest

RUN conda install python=3.6
RUN conda install nodejs=8.11

ADD . /working
WORKDIR /working

ENTRYPOINT ["./entrypoint.sh"]

