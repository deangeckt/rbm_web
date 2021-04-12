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
    elif type_ == 0:
        return h.dend_0
    elif type_ == 4:
        return h.apic
    else:
        raise ValueError('SWC - invalid type: ', type_)


def recording_type_to_ref(type_, h_ref):
    if type_ == 'volt':
        return h_ref._ref_v
    elif type_ == 'ina':
        return h_ref._ref_ina
    elif type_ == 'ik':
        return h_ref._ref_ik
    else:
        raise ValueError('invalid record type: ', type_)


def recording_key(recording_type_, type_, id_, section_):
    return '{}_{}_{}_{}'.format(recording_type_, type_, id_, section_)


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

    def add_record(self):
        if 'record' not in self.config:
            return
        recordings = {}
        for record_ in self.config['record']:
            id_ = record_['id']
            section_ = record_['section']
            type_ = record_['type']
            recording_type_ = record_['record_type']
            recording_key_ = recording_key(recording_type_, type_, id_, section_)

            h_ref = num_to_type(type_)
            h_ref = h_ref[id_](section_)
            h_ref = recording_type_to_ref(type_=recording_type_, h_ref=h_ref)

            vrec = h.Vector()
            vrec.record(h_ref)

            recordings[recording_key_] = vrec
        return recordings

    def run(self, params):
        self.init_params(params)
        self.init_swc()

        h.celsius = self.config['celsius']

        h.soma[0].insert('hh')  # insert a Hodgkin-Huxley channel
        # h.dend_0[8].insert('hh')

        stims = self.add_stim()
        recordings = self.add_record()

        trec = h.Vector()
        trec.record(h._ref_t)  # record time variable

        h.finitialize(self.config['rest_volt'])
        h.dt = self.config['dt']
        neuron.run(self.config['sim_time'])

        result = {'time': np.array(trec).tolist()}
        for record_key in recordings:
            result[record_key] = np.array(recordings[record_key]).tolist()

        return result


if __name__ == "__main__":
    wrap = NeuronWrapper()
    stim = [{'id': 0, 'section': 0.5, 'type': 0, 'delay': 20, 'duration': 25, 'amplitude': 0.5},
            ]
    record = [{'id': 0, 'section': 0.5, 'type': 1, 'record_type': 'volt'},
              {'id': 0, 'section': 0.5, 'type': 0, 'record_type': 'volt'}
            ]
    res = wrap.run([{'id': 'swc_path', 'value': 'C:/Users/t-deangeckt/Downloads/swcTree.swc'},
                    {'id': 'sim_time', 'value': 200},
                    {'id': 'rest_volt', 'value': -65},
                    {'id': 'stim', 'value': stim},
                    {'id': 'record', 'value': record}])

    subplot(1, 2, 1)
    r_key1 = recording_key('volt', 1, 0, 0.5)
    r_key2 = recording_key('volt', 0, 0, 0.5)

    plot(np.array(res['time']), np.array(res[r_key1]))
    xlim((0, h.tstop))
    ylabel(r_key1)
    xlabel('Time (ms)')
    tight_layout()

    subplot(1, 2, 2)
    plot(np.array(res['time']), np.array(res[r_key2]))
    xlim((0, h.tstop))
    xlabel('Time (ms)')
    ylabel(r_key2)
    show()
