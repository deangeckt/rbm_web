import json
import numpy as np
import matplotlib.pyplot as plt
from NeuronWrapper.neuronWrapper import NeuronWrapper
from NeuronWrapper.schema import recording_key
from config import read_paths

# Example by using the params.json - can be downloaded from the simulation web page
if __name__ == "__main__":
    wrapper = NeuronWrapper(config_path='../../../app/src/config.json')
    sim_time = 150

    with open('params.json') as json_file:
        params = json.load(json_file)
        res = wrapper.run(params=params, swc_path=read_paths()[1])
        r_key = recording_key(recording_type_=1, type_=1, id_=0, section_=0.5)

        plt.plot(np.array(res['time']), np.array(res[r_key]))
        plt.xlim((0, sim_time))
        plt.xlabel('Time [mS]')
        plt.ylabel('soma[0] - Voltage')
        plt.show()
