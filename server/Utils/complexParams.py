import numpy as np


def __get_apic_from_list(h, apic: list):
    res = []
    for i in apic:
        res.append(h.apic[i])
    return res


def range_apic_values(h, apic: list, var: str, start, end):
    """
    set linear values on some apic sections
    :param h: self.h from neuronWrapper
    :param apic: list with apic index's
    :param var: string with the property of the section
    :param start: range starts here
    :param end: range ends here
    :return: None
    """
    apics = __get_apic_from_list(h, apic)
    values = np.linspace(start, end, len(apic))
    for idx, sec in enumerate(apics):
        setattr(sec, var, values[idx])
        print('changing {} - {}, value: {}'.format(sec, var, values[idx]))


def range_apic_values_segments(h, apic: list, var: str, start, end):
    """
    set linear values on some apic sections - including the segments per section
    :param h: self.h from neuronWrapper
    :param apic: list with apic index's
    :param var: string with the property of the section
    :param start: range starts here
    :param end: range ends here
    :return: None
    """
    apics = __get_apic_from_list(h, apic)
    segments_amount = sum([sec.nseg for sec in apics])
    values = np.linspace(start, end, segments_amount)

    idx = 0
    for sec in apics:
        for seg in sec:
            setattr(seg, var, values[idx])
            print('changing {} - {}, value: {}'.format(seg, var, values[idx]))
            idx += 1
