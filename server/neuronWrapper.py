import json
import neuron
from neuron import h
from copy import deepcopy
import numpy as np
from pylab import *


def num_to_type(type_):
    if type_ == 1:
        return h.soma
    elif type_ == 2:
        return h.axon
    elif type_ == 3:
        return h.dend
    elif type_ == 4:
        return h.apic
    else:
        raise ValueError('SWC - invalid type: ', type_)


class NeuronWrapper:
    def __init__(self):
        h.load_file('stdrun.hoc')
        h.load_file('import3d.hoc')

        self.default_config = {}
        with open('../app/src/share/config.json') as f_:
            default_form = json.load(f_)['default_form']
            for form in default_form:
                self.default_config[form['id']] = form['value']
        self.config = None
        self.reset_config()

    def reset_config(self):
        self.config = deepcopy(self.default_config)

    def init_params(self, params):
        self.reset_config()
        for tup in params:
            id_ = tup['id']
            val_ = tup['value']
            self.config[id_] = val_

    def init_swc(self):
        if 'swc_path' not in self.config:
            raise ValueError('Missing SWC file param')

        cell = h.Import3d_SWC_read()
        try:
            cell.input(self.config['swc_path'])
        except:
            raise ValueError('Cant open SWC file at: ', self.config['swc_path'])

        i3d = h.Import3d_GUI(cell, False)
        i3d.instantiate(None)

    def add_stim(self):
        if 'stim' not in self.config:
            return
        stims = []
        for stim in self.config['stim']:
            id_ = stim['id']
            section_ = stim['section']
            type_ = stim['type']
            h_ref = num_to_type(type_)

            new_stim = h.IClamp(h_ref[id_](section_))
            new_stim.delay = stim['delay']
            new_stim.dur = stim['duration']
            new_stim.amp = stim['amplitude']
            stims.append(new_stim)
        return stims

    def run(self, params):
        self.init_params(params)
        self.init_swc()

        h.celsius = self.config['celsius']

        h.soma[0].insert('hh')  # insert a Hodgkin-Huxley channel
        stims = self.add_stim()

        vrec = h.Vector()  # setup recording Vectors
        trec = h.Vector()
        vrec.record(h.soma[0](0.5)._ref_v)  # record voltage from middle (0.5) of the Section
        trec.record(h._ref_t)  # record time variable

        h.finitialize(self.config['rest_volt'])
        h.dt = self.config['dt']
        neuron.run(self.config['sim_time'])
        return {'time': np.array(trec).tolist(), 'volt': np.array(vrec).tolist()}


if __name__ == "__main__":
    wrap = NeuronWrapper()
    stim = [{'id': 0, 'section': 0.5, 'type': 1, 'delay': 20,
             'duration': 25, 'amplitude': 5}]
    res = wrap.run([{'id': 'swc_path', 'value': 'C:/Users/t-deangeckt/Downloads/swcTree.swc'},
                    {'id': 'sim_time', 'value': 150},
                    {'id': 'rest_volt', 'value': -65},
                    {'id': 'stim', 'value': stim}])

    plot(np.array(res['time']), np.array(res['volt']))
    xlim((0, h.tstop))
    xlabel('Time (ms)')
    ylabel('v(0.5)')
    show()
