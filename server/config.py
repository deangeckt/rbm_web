import os

base_cwd = os.getcwd()
config_path = '../app/src/config.json'
config_full_path = os.path.join(base_cwd, config_path)


def read_paths():
    neuron_path = 'C:/Users/t-deangeckt/Desktop/NEURON 7.8 AMD64/larkumEtAl2009_2'
    swc_path = 'C:/Users/t-deangeckt/Downloads/TracesNumber_121-129Final2.swc'
    return neuron_path, swc_path
