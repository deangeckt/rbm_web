import io
import json
from contextlib import redirect_stdout
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

    def __init_params(self, params):
        for tup in params:
            id_ = tup['id']
            val_ = tup['value']
            self.config[id_] = val_

    def __init_swc(self):
        if 'swc_path' not in self.config:
            raise ValueError('Missing SWC file param')

        cell = self.h.Import3d_SWC_read()
        try:
            cell.input(self.config['swc_path'])
        except:
            raise ValueError('Cant open SWC file at: ', self.config['swc_path'])

        i3d = self.h.Import3d_GUI(cell, False)
        i3d.instantiate(None)

    def __add_stim(self):
        if 'stim' not in self.config:
            return
        stims = []
        for stim in self.config['stim']:
            id_ = stim['section']['id']
            section_ = stim['section']['section']
            type_ = stim['section']['type']
            h_ref = num_to_type(type_, self.h)

            new_stim = self.h.IClamp(h_ref[id_](section_))
            new_stim.delay = stim['delay']
            new_stim.dur = stim['duration']
            new_stim.amp = stim['amplitude']
            stims.append(new_stim)
        return stims

    def __add_record(self):
        if 'record' not in self.config or self.config['record'] == []:
            raise ValueError('Missing Recordings')
        recordings = {}
        for record_ in self.config['record']:
            id_ = record_['section']['id']
            section_ = record_['section']['section']
            type_ = record_['section']['type']
            recording_type_ = record_['type']
            recording_key_ = recording_key(recording_type_, type_, id_, section_)

            h_ref = num_to_type(type_, self.h)
            h_ref = h_ref[id_](section_)
            h_ref = recording_type_to_ref(type_=recording_type_, h_ref=h_ref)

            vrec = self.h.Vector()
            vrec.record(h_ref)

            recordings[recording_key_] = vrec
        return recordings

    def run(self, params):
        self.__init_params(params)
        self.__init_swc()

        self.h.celsius = self.config['celsius']

        self.h.soma[0].insert('hh')  # insert a Hodgkin-Huxley channel

        stims = self.__add_stim()
        recordings = self.__add_record()

        trec = self.h.Vector()
        trec.record(self.h._ref_t)  # record time variable

        self.h.finitialize(self.config['rest_volt'])
        self.h.dt = self.config['dt']
        self.neuron_dy.run(self.config['sim_time'])

        result = {'time': np.array(trec).tolist()}
        for record_key in recordings:
            result[record_key] = np.array(recordings[record_key]).tolist()

        return result

    def __read_mechanism(self, type_):
        """
        :param type_: 0 || 1
        :return: []
        """
        mechanism = []
        mt = self.h.MechanismType(type_)
        mname = self.h.ref('')
        for i in range(mt.count()):
            mt.select(i)
            mt.selected(mname)
            mechanism.append(mname[0])
        return mechanism

    def __read_mech_globals(self, mechname):
        ms = self.h.MechanismStandard(mechname, -1)
        name = self.h.ref('')
        mech_globals = []
        for j in range(ms.count()):
            ms.name(name, j)
            mech_globals.append(name[0])
        return mech_globals

    @staticmethod
    def __parse_point_mech_str(attr_str, exclude: list):
        result = {}
        lines = attr_str.split('\n')
        for line in lines:
            if line.startswith('\tinsert'):
                sep_line = line.split(' ')
                attr = sep_line[1]
                if attr in exclude:
                    continue
                vals = []
                others = sep_line[2:]
                for other in others:
                    if other == '{}' or other == '{':
                        continue
                    val_split = other.split('=')
                    vals.append({val_split[0]: float(val_split[1].replace('}', ''))})
                if vals:
                    result[attr] = vals
        return result

    def read(self):
        result = {}
        dummy = self.h.Section(name='dummy')
        point_mechanism_list = self.__read_mechanism(0)
        point_processes = self.__read_mechanism(1)
        mechanism_global = {}
        mechanism_global_dict = {}
        point_processes_dict = {}

        exclude_processes = ['loc', 'has_loc', 'get_loc', 'get_segment']
        for proc in point_processes:
            point_processes_dict[proc] = []
            attrs = vars(getattr(self.h, proc))
            for attr in attrs:
                if attr in exclude_processes:
                    continue
                value = 0 if (attrs[attr] is None) else attrs[attr]
                point_processes_dict[proc].append({attr: value})

        exclude_mechanism = ['morphology', 'capacitance']
        for mech in point_mechanism_list:
            if mech in exclude_mechanism:
                continue
            dummy.insert(mech)
            mechanism_global[mech] = self.__read_mech_globals(mech)

        for mg in mechanism_global:
            if not mechanism_global[mg]:
                continue
            vals = []
            for attr in mechanism_global[mg]:
                vals.append({attr: getattr(self.h, attr)})
            mechanism_global_dict[mg] = vals

        with io.StringIO() as buf, redirect_stdout(buf):
            self.h.psection(sec=dummy)
            point_mechanism_str = buf.getvalue()

        point_mechanism_dict = self.__parse_point_mech_str(point_mechanism_str,
                                                           exclude_mechanism)
        # e.g IClamp -> h.IClamp(sec[id_](section_))
        result['point_processes'] = point_processes_dict
        # e.g hh -> sec.insert('hh'), sec.gnabar_hh = X
        result['point_mechanism'] = point_mechanism_dict
        # e.g  h('celsius = X')
        result['global_mechanism'] = mechanism_global_dict

        return result


if __name__ == "__main__":
    wrap = NeuronWrapper('../app/src/share/config.json')
    section_soma = {'id': 0, 'section': 0.5, 'type': 1}
    section_undef = {'id': 0, 'section': 0.5, 'type': 0}

    stim = [{'section': section_soma, 'delay': 20, 'duration': 25, 'amplitude': 0.5},
            {'section': section_undef, 'delay': 60, 'duration': 25, 'amplitude': 0.5}
            ]
    record = [{'section': section_soma, 'type': 'volt'},
              {'section': section_undef, 'type': 'volt'}
              ]

    res = wrap.run(
        [{'id': 'swc_path', 'value': 'C:/Users/t-deangeckt/Downloads/neuromorpho_cnic_001.CNG.swc'},
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
