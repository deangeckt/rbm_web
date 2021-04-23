import json
import sys
import traceback
from flask import Flask
from flask import request
from flask_cors import CORS
import os
from NeuronWrapper.neuronWrapper import NeuronWrapper
from config import config_full_path, read_paths

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


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
