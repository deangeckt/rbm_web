import json
import numpy as np
import matplotlib.pyplot as plt
from Api.neuronWrapper import NeuronWrapper
from Api.schemaConvert import recording_key
from config import read_paths

# Example using the params.json - can be downloaded from the simulation web page
if __name__ == "__main__":
    wrapper = NeuronWrapper(config_path='../../app/src/config.json')

    with open('params.json') as json_file:
        params = json.load(json_file)
        res = wrapper.run(params=params, swc_path=read_paths()[1])

        r_key = recording_key(recording_type_=0, tid_=1, id_=0, section_=0.6)
        volt_res = res['volt']
        plt.plot(np.array(res['time']), np.array(volt_res[r_key]))
        plt.xlim((0, 50))
        plt.xlabel('Time [mS]')
        plt.ylabel('soma[0](0.6) - Voltage')
        plt.show()
