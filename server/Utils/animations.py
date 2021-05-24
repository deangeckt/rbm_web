from matplotlib import cm
from matplotlib import colors

norm = colors.Normalize(vmin=-70, vmax=70)
cmap = cm.get_cmap('turbo')


def record_to_hex(record):
    rgba = cmap(norm(record))
    return colors.rgb2hex(rgba)


def create_animations(recordings, time_vec):
    res = {}
    for record_key in recordings:
        anim_props = []
        record = recordings[record_key]
        last_r = record[0]
        last_i = 0
        for idx, r in enumerate(recordings[record_key]):
            if abs(r - last_r) < 2.5:
                continue

            from_ = record_to_hex(last_r)
            to_ = record_to_hex(r)
            dur_ = (time_vec[idx] - time_vec[last_i])
            anim_props.append({'from': from_, 'to': to_, 'dur': dur_ * 1000 / 64})

            last_i = idx
            last_r = r

        res[record_key] = anim_props
    return res

