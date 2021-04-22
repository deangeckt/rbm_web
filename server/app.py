import json
import sys
import traceback
from flask import Flask
from flask import request
from flask_cors import CORS
import os
from neuronWrapper import NeuronWrapper

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

config_path = '../app/src/config.json'
base_cwd = os.getcwd()
config_full_path = os.path.join(base_cwd, config_path)


def read_paths():
    neuron_path = 'C:/Users/t-deangeckt/Desktop/NEURON 7.8 AMD64/larkumEtAl2009_2'
    swc_path = 'C:/Users/t-deangeckt/Downloads/neuromorpho_cnic_001.CNG.swc'
    return neuron_path, swc_path


@app.route('/api/v1/run', methods=['POST'])
def score():
    try:
        params = request.get_json()
        for p in params:
            if 'id' not in p or 'value' not in p:
                msg = "Data params - bad format"
                raise ValueError(msg)

        wrapper = NeuronWrapper(config_path=config_full_path)
        res = wrapper.run(params=params, swc_path=read_paths()[1])
        return json.dumps(res), 200, {'Content-Type': 'application/json'}

    except ValueError as e:
        return str(e), 505,
    except:
        exctype, _, exctb = sys.exc_info()
        print(str(traceback.format_tb(exctb)))
        return "", 500


@app.route('/api/v1/read', methods=['GET'])
def read():
    try:
        neuron_path = read_paths()[0]
        if neuron_path is not None:
            print('Changing dir to: ', neuron_path)
            os.chdir(neuron_path)

        wrapper = NeuronWrapper(config_full_path)
        res = wrapper.read()
        return json.dumps(res), 200, {'Content-Type': 'application/json'}

    except ValueError as e:
        return str(e), 505,
    except:
        exctype, _, exctb = sys.exc_info()
        print(str(traceback.format_tb(exctb)))
        return "", 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    app.run(host="0.0.0.0", port=port)
