def tid_to_type(type_, h):
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
    if type_ == 0:
        return h_ref._ref_v
    elif type_ == 1:
        return h_ref._ref_ina
    elif type_ == 2:
        return h_ref._ref_ik
    else:
        raise ValueError('invalid record type: ', type_)


def recording_key(recording_type_, tid_, id_, section_):
    return '{}_{}_{}_{}'.format(recording_type_, tid_, id_, section_)


def recording_key_to_payload_type(record_key):
    record_type = record_key.split('_')[0]
    if record_type == '0':
        return 'volt'
    else:
        return 'current'


def section_key_to_id_tid(section_key):
    """
    :param section_key: 'cid_tid'
    :return: [cid, tid]
    """
    return [int(i) for i in section_key.split('_')]


def id_tid_to_section_key(id_, tid_):
    return '{}_{}'.format(id_, tid_)
