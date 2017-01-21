from flask import Flask, url_for
from .xmlparser import *
from os import listdir
import json
app = Flask(__name__)

scoreNames = [m for m in listdir('test/testCases/')]
print(scoreNames)

@app.route('/api/musicscores/<scorename>')
def api_score(scorename):
    return generateJson(scorename)

@app.route('/api/musicscores/')
def score_list():
    return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run()
