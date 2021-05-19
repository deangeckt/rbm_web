import numpy as np
import matplotlib.pyplot as plt
from Api.neuronWrapper import NeuronWrapper
from Api.schemaConvert import recording_key
from config import read_paths

if __name__ == "__main__":
    wrapper = NeuronWrapper(config_path='../../app/src/config.json')

    sim_time = 100
    global_params = {
        "general":
            {
                "attrs": {
                    "sim_time": sim_time,
                },
            }
    }
    sections_params = {
        "0_1": {
            "id": "0_1",
            "general": {
                "L": 1,
                "Ra": 35.4,
                "nseg": 1,
                "rallbranch": 1
            },
            "process": {
                "0.5": {
                    "IClamp": [
                        {
                            "attrs": {
                                "delay": 10,
                                "dur": 20,
                                "amp": 0.5
                            },
                            "add": True
                        },
                        {
                            "attrs": {
                                "delay": 40,
                                "dur": 20,
                                "amp": 0.5
                            },
                            "add": True
                        }
                    ]
                }
            },
            "records": {
                "0.5": [0, 1]
            },
            "mechanism": {
                "hh": {
                    "attrs": {},
                    "add": True
                },
                "na_ion": {
                    "attrs": {},
                    "add": True
                }
            }
        },
    }
    params = [{'id': 'global', 'value': global_params},
              {'id': 'sections', 'value': sections_params}]

    res = wrapper.run(params=params, swc_path=read_paths()[1])
    r_key1 = recording_key(recording_type_=1, type_=1, id_=0, section_=0.5)
    r_key2 = recording_key(recording_type_=0, type_=1, id_=0, section_=0.5)

    plt.subplot(1, 2, 1)
    plt.plot(np.array(res['time']), np.array(res[r_key1]))
    plt.xlim((0, sim_time))
    plt.xlabel('Time [mS]')
    plt.ylabel('soma[0] - Current Na')
    plt.tight_layout()

    plt.subplot(1, 2, 2)
    plt.plot(np.array(res['time']), np.array(res[r_key2]))
    plt.xlim((0, sim_time))
    plt.xlabel('Time [mS]')
    plt.ylabel('soma[0] - Voltage')
    plt.show()
