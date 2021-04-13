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
config_path = '../app/src/share/config.json'
base_cwd = os.getcwd()
config_full_path = os.path.join(base_cwd, config_path)


@app.route('/api/v1/run', methods=['POST'])
def score():
    try:
        data = request.get_json()
        for d in data:
            if 'id' not in d or 'value' not in d:
                msg = "Data params - bad format"
                raise ValueError(msg)
            if 'neuron_path' in d:
                print('Changing dir to: ', d['value'])
                os.chdir(d['value'])

        wrapper = NeuronWrapper(config_full_path)
        res = wrapper.run(data)
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
        data = request.get_json()
        if 'neuron_path' in data:
            print('Changing dir to: ', data['neuron_path'])
            os.chdir(data['neuron_path'])

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
