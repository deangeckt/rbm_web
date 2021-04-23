import numpy as np
import matplotlib.pyplot as plt
from NeuronWrapper.neuronWrapper import NeuronWrapper
from NeuronWrapper.schema import recording_key
from config import read_paths

if __name__ == "__main__":
    wrapper = NeuronWrapper(config_path='../../../app/src/config.json')

    sim_time = 200
    global_params = [
        [
            "general",
            {
                "attrs": {
                    "sim_time": sim_time,
                },
            }
        ]
    ]
    sections_params = {
        "0_1": {
            "key": "0_1",
            "section": 0.5,
            "recording_type": 1,
            "mechanism": {
                "hh": {
                    "attrs": {
                        "gnabar_hh": 0.13
                    },
                    "add": True
                }
            },
            "process": {
                "IClamp": {
                    "attrs": {
                        "dur": 30,
                        "amp": 0.5,
                        "delay": 10,
                    },
                    "add": True
                },
            }
        },
        "20_4": {
            "key": "20_4",
            "section": 0.5,
            "recording_type": 1,
            "mechanism": {},
            "process": {}
        }
    }
    params = [{'id': 'global', 'value': global_params},
              {'id': 'sections', 'value': sections_params}]

    res = wrapper.run(params=params, swc_path=read_paths()[1])
    r_key1 = recording_key(recording_type_=1, type_=1, id_=0, section_=0.5)
    r_key2 = recording_key(recording_type_=1, type_=4, id_=20, section_=0.5)

    plt.subplot(1, 2, 1)
    plt.plot(np.array(res['time']), np.array(res[r_key1]))
    plt.xlim((0, sim_time))
    plt.xlabel('Time [mS]')
    plt.ylabel('soma[0] - Voltage')
    plt.tight_layout()

    plt.subplot(1, 2, 2)
    plt.plot(np.array(res['time']), np.array(res[r_key2]))
    plt.xlim((0, sim_time))
    plt.xlabel('Time [mS]')
    plt.ylabel('apic[20] - Voltage')
    plt.show()
