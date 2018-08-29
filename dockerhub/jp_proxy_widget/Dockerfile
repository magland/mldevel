FROM continuumio/miniconda3:latest

RUN conda install python=3.6
RUN conda install -c conda-forge nodejs=9.11
RUN conda install scipy
RUN conda install jupyterlab

RUN jupyter labextension install @jupyter-widgets/jupyterlab-manager --no-build

RUN pip install jp_proxy_widget
RUN jupyter nbextension enable --py --sys-prefix jp_proxy_widget
RUN jupyter labextension install jp_proxy_widget --no-build

RUN jupyter lab build
