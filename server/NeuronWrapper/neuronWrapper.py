import io
import json
from contextlib import redirect_stdout
from copy import deepcopy

import numpy as np

from NeuronWrapper.animations import create_animations
from NeuronWrapper.schema import recording_type_to_ref, tid_to_type, recording_key, \
    section_key_to_id_tid, id_tid_to_section_key


class NeuronWrapper:
    def __init__(self, config_path):
        self.neuron_dy = __import__("neuron")
        self.input = {'global': {}, 'sections': {}}
        self.recordings = {}
        self.anim_recordings = {}
        self.process = []
        self.default_general_params = {}
        self.general_params = {}

        with open(config_path) as f_:
            default_general_ = json.load(f_)['static_global_form']['general']
            for tup in default_general_:
                for key_ in tup:
                    self.default_general_params[key_] = tup[key_]
        self.__reset_params()

    def __reset_params(self):
        self.general_params = deepcopy(self.default_general_params)
        self.input['sections'] = {}
        self.recordings = {}
        self.anim_recordings = {}
        self.process = []

        self.h = getattr(self.neuron_dy, "h")
        self.h.load_file('stdrun.hoc')
        self.h.load_file('import3d.hoc')

    def __init_params(self, params):
        for tup in params:
            id_ = tup['id']
            val_ = tup['value']
            self.input[id_] = val_

    def __init_swc(self, swc_path):
        cell = self.h.Import3d_SWC_read()
        try:
            cell.input(swc_path)
        except:
            raise ValueError('Cant open SWC file at: ', swc_path)

        i3d = self.h.Import3d_GUI(cell, False)
        i3d.instantiate(None)

    def __add_section_mech(self, section: dict):
        id_, tid_ = section_key_to_id_tid(section['id'])
        h_ref = tid_to_type(tid_, self.h)[id_]
        mechanism = section['mechanism']
        for mech in mechanism:
            h_ref.insert(mech)
            attrs = mechanism[mech]['attrs']
            for attr in attrs:
                setattr(h_ref, attr, attrs[attr])

    def __add_section_process(self, section: dict):
        id_, tid_ = section_key_to_id_tid(section['id'])
        process = section['process']
        for segment_key in process:
            for proc in process[segment_key]:
                segment = float(segment_key)
                if segment < 0 or segment > 1:
                    raise ValueError(
                        'Invalid segment. id: {} type: {} segment: {}'.format(id_, tid_, segment))
                h_ref = tid_to_type(tid_, self.h)
                h_ref = h_ref[id_](segment)

                new_proc = getattr(self.h, proc)(h_ref)
                attrs = process[segment_key][proc]['attrs']
                for attr in attrs:
                    setattr(new_proc, attr, attrs[attr])
                self.process.append(new_proc)

    def __add_section_record(self, section: dict):
        recording_type_ = section['recording_type']
        if recording_type_ == 0:
            return

        id_, tid_ = section_key_to_id_tid(section['id'])
        vec_rec = self.__add_record_aux(id_, tid_, recording_type_)
        recording_key_ = recording_key(recording_type_, tid_, id_, 0.5)

        self.recordings[recording_key_] = vec_rec

    def __add_record_aux(self, id_, tid_, recording_type_):
        h_ref = tid_to_type(tid_, self.h)
        h_ref = h_ref[id_](0.5)
        h_ref = recording_type_to_ref(type_=recording_type_, h_ref=h_ref)

        vec_rec = self.h.Vector()
        vec_rec.record(h_ref)
        return vec_rec

    # TODO: support recording type as a param: volt, i_na etc...
    def __record_all(self):
        for tid in range(1, 5):
            try:
                _type = tid_to_type(tid, self.h)
                print('adding record to {} sections from type {}'.format(len(_type), tid))
                for cid in range(len(_type)):
                    recording_key_ = id_tid_to_section_key(cid, tid)
                    vec_rec = self.__add_record_aux(cid, tid, 1)
                    self.anim_recordings[recording_key_] = vec_rec
            except:
                continue

    def __add_section_general_params(self, section: dict):
        id_, tid_ = section_key_to_id_tid(section['id'])
        h_ref = tid_to_type(tid_, self.h)[id_]
        general = section['general']
        for param in general:
            setattr(h_ref, param, general[param])

    def __init_global(self):
        global_params = self.input['global']
        for param_key in global_params:
            attrs = global_params[param_key]['attrs']

            for attr in attrs:
                if param_key == 'general':
                    self.general_params[attr] = attrs[attr]
                else:
                    self.h('{} = {}'.format(attr, attrs[attr]))

    def __init_section(self):
        sections = self.input['sections']
        for section_key in sections:
            section = sections[section_key]

            id_, tid_ = section_key_to_id_tid(section['id'])
            if tid_ == 1 and id_ > 0:
                continue

            self.__add_section_record(section)
            self.__add_section_mech(section)
            self.__add_section_process(section)
            self.__add_section_general_params(section)

        if self.recordings == {}:
            raise ValueError('Missing Recordings')

    def run(self, params, swc_path):
        self.__reset_params()
        self.__init_params(params)
        self.__init_swc(swc_path)
        self.__init_global()
        self.__init_section()

        trec = self.h.Vector()
        trec.record(self.h._ref_t)

        if 'animation' in self.input:
            self.__record_all()

        self.h.celsius = self.general_params['celsius']
        self.h.finitialize(self.general_params['rest_volt'])
        self.h.dt = self.general_params['dt']
        self.neuron_dy.run(self.general_params['sim_time'])

        time_vec = np.array(trec).tolist()
        result = {'time': time_vec}
        for record_key in self.recordings:
            result[record_key] = np.array(self.recordings[record_key]).tolist()

        if 'animation' in self.input:
            result['animation'] = create_animations(self.anim_recordings, time_vec)

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

    def __read_section_general(self):
        res = {}
        for tid in range(1, 5):
            try:
                _type = tid_to_type(tid, self.h)
                print(
                    'reading general params from {} sections from type {}'.format(len(_type), tid))
                for cid in range(len(_type)):
                    recording_key_ = id_tid_to_section_key(cid, tid)
                    h_ref = tid_to_type(tid, self.h)[cid]
                    res[recording_key_] = {'L': h_ref.L,
                                           'Ra': h_ref.Ra,
                                           'nseg': h_ref.Ra,
                                           'rallbranch': h_ref.rallbranch}
            except:
                continue
        return res

    def read(self, swc_path):
        self.__init_swc(swc_path)

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
            dummy_proc = getattr(self.h, proc)(dummy(0.5))
            attrs = vars(getattr(self.h, proc))
            for attr in attrs:
                if attr in exclude_processes:
                    continue
                try:
                    value = getattr(dummy_proc, attr)
                    if not isinstance(value, int) and not isinstance(value, float):
                        continue
                    point_processes_dict[proc].append({attr: value})
                except:
                    continue

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
        result['point_processes'] = point_processes_dict
        result['point_mechanism'] = point_mechanism_dict
        result['global_mechanism'] = mechanism_global_dict
        result['section_general'] = self.__read_section_general()

        return result
