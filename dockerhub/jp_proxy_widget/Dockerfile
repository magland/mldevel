FROM continuumio/miniconda3:latest

### Prerequisites
RUN conda install -c conda-forge nodejs=9.11
RUN conda install python=3.6

### JupyterLab with extensions
RUN conda install jupyterlab
RUN ! jupyter labextension install @jupyter-widgets/jupyterlab-manager | tee /dev/stderr | grep -q "error Command failed with exit code"
RUN pip install jp_proxy_widget
RUN jupyter nbextension enable --py --sys-prefix jp_proxy_widget
RUN ! jupyter labextension install jp_proxy_widget | tee /dev/stderr | grep -q "error Command failed with exit code"

