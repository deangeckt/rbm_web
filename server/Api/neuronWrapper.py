import json
from copy import deepcopy
import numpy as np

from Api.bruteForceApi import brute_force_api
from Api.readApi import read_api
from Api.schemaConvert import recording_type_to_ref, tid_to_type, recording_key, \
    section_key_to_id_tid, id_tid_to_section_key, recording_key_to_payload_type
from Utils.animations import create_animations


class NeuronWrapper:
    def __init__(self, config_path):
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
        self.recordings.clear()
        self.recordings = {}
        self.anim_recordings.clear()
        self.anim_recordings = {}
        self.process.clear()
        self.process = []

        self.neuron_dy = __import__("neuron")
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

                for attrList in process[segment_key][proc]:
                    new_proc = getattr(self.h, proc)(h_ref)
                    attrs = attrList['attrs']
                    for attr in attrs:
                        setattr(new_proc, attr, attrs[attr])
                    self.process.append(new_proc)

    def __add_section_record(self, section: dict):
        id_, tid_ = section_key_to_id_tid(section['id'])
        records = section['records']
        for segment in records:
            for record in records[segment]:
                vec_rec = self.__add_record_aux(id_, tid_, record, float(segment))
                recording_key_ = recording_key(record, tid_, id_, segment)
                self.recordings[recording_key_] = vec_rec

    def __add_record_aux(self, id_, tid_, recording_type_, segment_):
        h_ref = tid_to_type(tid_, self.h)
        h_ref = h_ref[id_](segment_)
        h_ref = recording_type_to_ref(type_=recording_type_, h_ref=h_ref)

        vec_rec = self.h.Vector()
        vec_rec.record(h_ref)
        return vec_rec

    def __record_all(self):
        for tid in range(1, 5):
            try:
                _type = tid_to_type(tid, self.h)
                print('adding record to {} sections from type {}'.format(len(_type), tid))
                for cid in range(len(_type)):
                    recording_key_ = id_tid_to_section_key(cid, tid)
                    vec_rec = self.__add_record_aux(cid, tid, 0, 0.5)
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

            self.__add_section_mech(section)
            self.__add_section_process(section)
            self.__add_section_record(section)
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
        result = {}
        plot_obj = {'time': time_vec, 'current': {}, 'volt': {}}
        for record_key in self.recordings:
            payload_type = recording_key_to_payload_type(record_key)
            plot_obj[payload_type][record_key] = np.array(self.recordings[record_key]).tolist()
        result['plot'] = plot_obj

        if 'animation' in self.input:
            result['animation'] = create_animations(self.anim_recordings, time_vec)

        return result

    def read(self, swc_path):
        self.__init_swc(swc_path)
        return read_api(self.h)

    def brute_force(self, params, swc_path):
        return brute_force_api(self.run, params, swc_path)
