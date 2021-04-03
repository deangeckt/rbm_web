import json
import os
import sys
import traceback
from flask import Flask
from flask import request

from neuronWrapper import run

app = Flask(__name__)


@app.route('/api/v1/run', methods=['POST'])
def score():
    try:
        data = request.get_json()
        print(data)

        res = run()
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
