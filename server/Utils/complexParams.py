import numpy as np


def __get_apic_range(h, start, end):
    res = []
    for i in range(start, end):
        res.append(h.apic[i])
    return res


def range_apic_values(h, var: str, start, end):
    """
    set linear values on some apic sections
    :param h: self.h from neuronWrapper
    :param var: string with the property of the section
    :param start: range starts here
    :param end: range ends here
    :return: None
    """
    # Change according to your neuron
    apic_start_id = 0
    apic_end_id = 13

    apics = __get_apic_range(h, apic_start_id, apic_end_id)
    values = np.linspace(start, end, apic_end_id - apic_start_id)
    for idx, sec in enumerate(apics):
        setattr(sec, var, values[idx])
        print('changing {} - {}, value: {}'.format(sec, var, values[idx]))


def range_apic_values_segments(h, var: str, start, end):
    """
    set linear values on some apic sections - including the segments per section
    :param h: self.h from neuronWrapper
    :param var: string with the property of the section
    :param start: range starts here
    :param end: range ends here
    :return: None
    """
    # Change according to your neuron
    apic_start_id = 0
    apic_end_id = 13

    apics = __get_apic_range(h, apic_start_id, apic_end_id)
    segments_amount = sum([sec.nseg for sec in apics])
    values = np.linspace(start, end, segments_amount)

    idx = 0
    for sec in apics:
        for seg in sec:
            setattr(seg, var, values[idx])
            print('changing {} - {}, value: {}'.format(seg, var, values[idx]))
            idx += 1
