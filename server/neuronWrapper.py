import json
import neuron
from neuron import h
from copy import deepcopy
import numpy as np
from pylab import *


class NeuronWrapper:
    def __init__(self):
        with open('config.json') as f_:
            self.default_config = json.load(f_)
        self.config = None
        self.reset_config()

    def reset_config(self):
        self.config = deepcopy(self.default_config)

    def run(self, params):
        self.reset_config()
        for tup in params:
            id_ = tup['id']
            val_ = tup['value']
            self.config[id_] = val_

        h.celsius = self.config['celsius']
        cell = h.Section()  # create a section (cable)
        cell.insert('hh')  # insert a Hodgkin-Huxley channel

        vrec = h.Vector()  # setup recording Vectors
        trec = h.Vector()
        vrec.record(cell(0.5)._ref_v)  # record voltage from middle (0.5) of the Section
        trec.record(h._ref_t)  # record time variable

        h.finitialize(self.config['rest_volt'])
        h.dt = self.config['dt']
        neuron.run(self.config['sim_time'])
        return {'time': np.array(trec).tolist(), 'volt': np.array(vrec).tolist()}


if __name__ == "__main__":
    wrap = NeuronWrapper()
    res = wrap.run([{'id': 'sim_time', 'value': 50},
                    {'id': 'rest_volt', 'value': -100}])

    plot(np.array(res['time']), np.array(res['volt']))
    xlim((0, h.tstop))
    xlabel('Time (ms)')
    ylabel('v(0.5)')
    show()
