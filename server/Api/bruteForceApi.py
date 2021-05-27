from itertools import product
import copy
import numpy as np


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


def __fill_list_for_product(brute_params):
    list_values = []
    list_keys = []

    global_brute = brute_params['global']
    for param_key in global_brute:
        attrs = global_brute[param_key]['attrs']
        for attr in attrs:
            attr_obj = attrs[attr]
            vals = np.linspace(attr_obj['min'], attr_obj['max'], num=attr_obj['amount'])
            list_values.append(vals)
            list_keys.append(('global', param_key, attr))

    return list_keys, list_keys


def __update_new_product_params(product_tuple, list_keys, new_params):
    for idx, param in enumerate(product_tuple):
        curr_key = list_keys[idx]
        param_type = curr_key[0]
        param_key = curr_key[1]
        attr_key = curr_key[2]
        if param_type == 'global':
            global_params = __find_param_val(new_params, 'global')
            if param_key not in global_params:
                global_params[param_key] = {"attrs": {attr_key: param}}
            else:
                global_params[param_key]["attrs"][attr_key] = param


def __compare_graph(gt, candidate):
    return 0.0


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
