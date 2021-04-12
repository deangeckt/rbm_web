import json
from pylab import *


def num_to_type(type_, h):
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
    def __init__(self, config_path):
        self.neuron_dy = __import__("neuron")
        self.h = getattr(self.neuron_dy, "h")

        self.h.load_file('stdrun.hoc')
        self.h.load_file('import3d.hoc')

        self.config = {}
        with open(config_path) as f_:
            default_form = json.load(f_)['default_form']
            for form in default_form:
                self.config[form['id']] = form['value']

    def init_params(self, params):
        for tup in params:
            id_ = tup['id']
            val_ = tup['value']
            self.config[id_] = val_

    def init_swc(self):
        if 'swc_path' not in self.config:
            raise ValueError('Missing SWC file param')

        cell = self.h.Import3d_SWC_read()
        try:
            cell.input(self.config['swc_path'])
        except:
            raise ValueError('Cant open SWC file at: ', self.config['swc_path'])

        i3d = self.h.Import3d_GUI(cell, False)
        i3d.instantiate(None)

    def add_stim(self):
        if 'stim' not in self.config:
            return
        stims = []
        for stim in self.config['stim']:
            id_ = stim['id']
            section_ = stim['section']
            type_ = stim['type']
            h_ref = num_to_type(type_, self.h)

            new_stim = self.h.IClamp(h_ref[id_](section_))
            new_stim.delay = stim['delay']
            new_stim.dur = stim['duration']
            new_stim.amp = stim['amplitude']
            stims.append(new_stim)
        return stims

    def add_record(self):
        if 'record' not in self.config:
            raise ValueError('Missing Recordings')
        recordings = {}
        for record_ in self.config['record']:
            id_ = record_['id']
            section_ = record_['section']
            type_ = record_['type']
            recording_type_ = record_['record_type']
            recording_key_ = recording_key(recording_type_, type_, id_, section_)

            h_ref = num_to_type(type_, self.h)
            h_ref = h_ref[id_](section_)
            h_ref = recording_type_to_ref(type_=recording_type_, h_ref=h_ref)

            vrec = self.h.Vector()
            vrec.record(h_ref)

            recordings[recording_key_] = vrec
        return recordings

    def run(self, params):
        self.init_params(params)
        self.init_swc()

        self.h.celsius = self.config['celsius']

        self.h.soma[0].insert('hh')  # insert a Hodgkin-Huxley channel

        stims = self.add_stim()
        recordings = self.add_record()

        trec = self.h.Vector()
        trec.record(self.h._ref_t)  # record time variable

        self.h.finitialize(self.config['rest_volt'])
        self.h.dt = self.config['dt']
        self.neuron_dy.run(self.config['sim_time'])

        result = {'time': np.array(trec).tolist()}
        for record_key in recordings:
            result[record_key] = np.array(recordings[record_key]).tolist()

        return result


if __name__ == "__main__":
    wrap = NeuronWrapper('../app/src/share/config.json')

    stim = [{'id': 0, 'section': 0.5, 'type': 0, 'delay': 20, 'duration': 25, 'amplitude': 0.5},
            ]
    record = [{'id': 0, 'section': 0.5, 'type': 1, 'record_type': 'volt'},
              {'id': 0, 'section': 0.5, 'type': 0, 'record_type': 'volt'}
              ]

    res = wrap.run(
        [{'id': 'swc_path', 'value': 'C:/Users/t-deangeckt/Downloads/swcTree.swc'},
         {'id': 'sim_time', 'value': 200},
         {'id': 'rest_volt', 'value': -65},
         {'id': 'stim', 'value': stim},
         {'id': 'record', 'value': record}])

    subplot(1, 2, 1)
    r_key1 = recording_key('volt', 1, 0, 0.5)
    r_key2 = recording_key('volt', 0, 0, 0.5)

    plot(np.array(res['time']), np.array(res[r_key1]))
    xlim((0, 200))
    ylabel(r_key1)
    xlabel('Time (ms)')
    tight_layout()

    subplot(1, 2, 2)
    plot(np.array(res['time']), np.array(res[r_key2]))
    xlim((0, 200))
    xlabel('Time (ms)')
    ylabel(r_key2)
    show()
