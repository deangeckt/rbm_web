import json
import os
import sys
import traceback
from flask import Flask
from flask import request
from flask_cors import CORS

from neuronWrapper import NeuronWrapper

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

wrapper = NeuronWrapper()


@app.route('/api/v1/run', methods=['POST'])
def score():
    try:
        data = request.get_json()
        print(data)
        for d in data:
            if 'id' not in d or 'value' not in d:
                msg = "Data params - bad format"
                raise ValueError(msg)

        res = wrapper.run(data)
        return json.dumps(res), 200, {'Content-Type': 'application/json',
                                      'Access-Control-Allow-Origin': '*',
                                      "Access-Control-Allow-Methods": "GET, POST"}

    except:
        exctype, _, exctb = sys.exc_info()
        print(str(traceback.format_tb(exctb)))
        return "Server error", 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    app.run(host="0.0.0.0", port=port)
