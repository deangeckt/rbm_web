import numpy as np


def __get_apic_from_list(h, apic: list):
    res = []
    for i in apic:
        res.append(h.apic[i])
    return res


def inject(h):
    """
    Edit this code with your own complex params, e.g:
    changing apic's diam in a range manner (linespace)
    - id's of apic are chosen according to section id
    :param h: given from neuronWrapper
    :return: none
    """

    # apic_tuft1 = list(range(14, 29))
    # apic_tuft2 = list(range(37, 42))
    # apic_trunk = list(range(0, 13))
    # apic_obliq = [55, 56, 57, 60, 61, 62, 66, 65, 67, 68, 69, 72]
    # apic_obliq2 = [58, 59, 63, 64, 70, 71]
    # apic_hotzone = [13, 36]
    #
    # range_apic_values_segments(h, apic_trunk, 'diam', 5, 4.5)
    # range_apic_values_segments(h, apic_obliq, 'diam', 0.5, 0.2)
    # range_apic_values_segments(h, apic_obliq2, 'diam', 0.5, 0.2)
    # range_apic_values_segments(h, apic_hotzone, 'diam', 3, 3 * 0.7)
    # range_apic_values(h, apic_tuft1, 'diam', 2.1, 0.8)
    # range_apic_values(h, apic_tuft2, 'diam', 2.1, 0.8)

    return


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
