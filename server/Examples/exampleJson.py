import json
import numpy as np
import matplotlib.pyplot as plt
from Api.neuronWrapper import NeuronWrapper
from Api.schemaConvert import recording_key
from config import read_absolute_paths, get_shared_config_path, change_to_neuron_path

# Example using the params.json - can be downloaded from the simulation web page
if __name__ == "__main__":
    params = json.load(open('params.json'))
    change_to_neuron_path()

    wrapper = NeuronWrapper(config_path=get_shared_config_path())
    res = wrapper.run(params={}, swc_path=read_absolute_paths()[1])

    r_key = recording_key(recording_type_=0, tid_=1, id_=0, section_=0.5)
    volt_res = res['plot']['volt']
    plt.plot(np.array(res['plot']['time']), np.array(volt_res[r_key]))
    plt.xlim((0, 100))
    plt.xlabel('Time [mS]')
    plt.ylabel('soma[0](0.5) - Voltage')
    plt.show()
