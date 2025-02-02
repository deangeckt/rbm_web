import os
import configparser
from pkg_resources import resource_filename


# Please fill absolute path to your files
def read_absolute_paths():
    # neuron_path = 'C:/Users/t-deangeckt/Desktop/NEURON 7.8 AMD64/larkumEtAl2009_2'
    neuron_path = "C:/Users/dean/Desktop/NEURON 8.2.6 AMD64"
    # swc_path = 'C:/Users/t-deangeckt/Downloads/TracesNumber_121-129Final2.swc'
    swc_path = "C:/Users/dean/Desktop/NEURON 8.2.6 AMD64/H16-06-008-21-02-01_685741524_m_dendriteaxon.swc"
    return neuron_path, swc_path


def get_shared_config_path():
    config = configparser.ConfigParser()
    config.read(resource_filename(__name__, 'config.ini'))
    return resource_filename(__name__, config['DEFAULT']['shared_config_path'])


def change_to_neuron_path():
    neuron_path = read_absolute_paths()[0]
    if neuron_path is not None and os.getcwd() != os.path.normpath(neuron_path):
        print('Changing dir to: ', neuron_path)
        os.chdir(neuron_path)
