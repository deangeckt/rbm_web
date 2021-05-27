from itertools import product
import copy
import numpy as np
from scipy.stats import wasserstein_distance


def __find_param_val(params, key: str):
    result = None
    for tup in params:
        if tup['id'] == key:
            result = tup['value']
    if result is None:
        raise ValueError('Missing {} params'.format(key))
    return result


def __remove_anim_if_exist(params):
    anim_tup = {'id': 'animation', 'value': True}
    if anim_tup not in params:
        return

    idx = params.index(anim_tup)
    del params[idx]


def __fill_list_for_product_aux(fill_params, list_values, list_keys, sec_key=None, sec_type=None):
    for param_key in fill_params:
        attrs = fill_params[param_key]['attrs']
        for attr in attrs:
            attr_obj = attrs[attr]
            values = np.linspace(attr_obj['min'], attr_obj['max'], num=attr_obj['amount'])
            list_values.append(values)
            new_key = ('global', param_key, attr) if sec_key is None else (sec_key, sec_type, param_key, attr)
            list_keys.append(new_key)


def __fill_list_for_product(brute_params):
    list_values = []
    list_keys = []

    __fill_list_for_product_aux(fill_params=brute_params['global'],
                                list_values=list_values,
                                list_keys=list_keys)
    sections_brute = brute_params['sections']
    for sec_key in sections_brute:
        sections_params = sections_brute[sec_key]
        __fill_list_for_product_aux(fill_params=sections_params['mechanism'],
                                    list_values=list_values,
                                    list_keys=list_keys,
                                    sec_key=sec_key,
                                    sec_type='mechanism')
        __fill_list_for_product_aux(fill_params=sections_params['general'],
                                    list_values=list_values,
                                    list_keys=list_keys,
                                    sec_key=sec_key,
                                    sec_type='general')

    return list_keys, list_values


def __update_new_attr_params(override_params, param_key, attr_key, value):
    if param_key not in override_params:
        override_params[param_key] = {"attrs": {attr_key: value}}
    else:
        override_params[param_key]["attrs"][attr_key] = value


def __update_new_product_params(product_tuple, list_keys, new_params):
    for idx, param in enumerate(product_tuple):
        curr_key = list_keys[idx]
        if curr_key[0] == 'global':  # global or section_key
            global_params = __find_param_val(new_params, 'global')
            __update_new_attr_params(override_params=global_params,
                                     param_key=curr_key[1],
                                     attr_key=curr_key[2],
                                     value=param)
        else:
            sec_key = curr_key[0]
            param_type = curr_key[1]  # general or mechanism
            section_params = __find_param_val(new_params, 'sections')
            __update_new_attr_params(override_params=section_params[sec_key][param_type],
                                     param_key=curr_key[2],
                                     attr_key=curr_key[3],
                                     value=param)


def __compare_graph(gt, candidate):
    return wasserstein_distance(gt, candidate)


def brute_force_api(run, params, swc_path):
    brute_params = __find_param_val(params, 'brute_force')
    __remove_anim_if_exist(params)

    gt = brute_params['plot']
    product_results = []
    list_keys, list_values = __fill_list_for_product(brute_params)
    products_params = list(product(*list_values))

    for idx, product_tuple in enumerate(products_params):
        print('Iteration: {}  params: {}'.format(idx, product_tuple))
        new_params = copy.deepcopy(params)
        __update_new_product_params(product_tuple, list_keys, new_params)
        volts = run(new_params, swc_path)['volt']
        candidate = next(iter(volts.values()))
        product_results.append(__compare_graph(gt, candidate))
