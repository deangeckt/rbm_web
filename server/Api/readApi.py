import io
from contextlib import redirect_stdout

from Api.schemaConvert import tid_to_type, id_tid_to_section_key


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
                if other == '{':
                    continue
                if other == '{}':
                    result[attr] = []
                else:
                    val_split = other.split('=')
                    vals.append({val_split[0]: float(val_split[1].replace('}', ''))})
            if vals:
                result[attr] = vals
    return result


def __read_section_general(h):
    res = {}
    for tid in range(1, 5):
        try:
            _type = tid_to_type(tid, h)
            print(
                'reading general params from {} sections from type {}'.format(len(_type), tid))
            for cid in range(len(_type)):
                recording_key_ = id_tid_to_section_key(cid, tid)
                h_ref = tid_to_type(tid, h)[cid]
                res[recording_key_] = {'L': h_ref.L,
                                       'Ra': h_ref.Ra,
                                       'nseg': h_ref.nseg,
                                       'rallbranch': h_ref.rallbranch}
        except:
            continue
    return res


def __read_mechanism(h, type_):
    """
    :param type_: 0 || 1
    :return: []
    """
    mechanism = []
    mt = h.MechanismType(type_)
    mname = h.ref('')
    for i in range(mt.count()):
        mt.select(i)
        mt.selected(mname)
        mechanism.append(mname[0])
    return mechanism


def __read_mech_globals(h, mech_name):
    ms = h.MechanismStandard(mech_name, -1)
    name = h.ref('')
    mech_globals = []
    for j in range(ms.count()):
        ms.name(name, j)
        mech_globals.append(name[0])
    return mech_globals


def read_api(h):
    result = {}
    dummy = h.Section(name='dummy')
    point_mechanism_list = __read_mechanism(h, 0)
    point_processes_list = __read_mechanism(h, 1)
    mechanism_global = {}
    mechanism_global_dict = {}
    point_processes_dict = {}

    exclude_processes = ['loc', 'has_loc', 'get_loc', 'get_segment']
    for proc in point_processes_list:
        point_processes_dict[proc] = []
        dummy_proc = getattr(h, proc)(dummy(0.5))
        attrs = vars(getattr(h, proc))
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
        mechanism_global[mech] = __read_mech_globals(h, mech)

    for mg in mechanism_global:
        if not mechanism_global[mg]:
            continue
        vals = []
        for attr in mechanism_global[mg]:
            vals.append({attr: getattr(h, attr)})
        mechanism_global_dict[mg] = vals

    with io.StringIO() as buf, redirect_stdout(buf):
        h.psection(sec=dummy)
        point_mechanism_str = buf.getvalue()

    exclude_point_proc = exclude_mechanism
    exclude_point_proc.extend(['glutamate', 'ampa'])
    point_mechanism_dict = __parse_point_mech_str(point_mechanism_str,
                                                  exclude_mechanism)
    result['point_processes'] = point_processes_dict
    result['point_mechanism'] = point_mechanism_dict
    result['global_mechanism'] = mechanism_global_dict
    result['section_general'] = __read_section_general(h)

    return result
