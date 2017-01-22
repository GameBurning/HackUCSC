from flask import Flask, request
from server.xmlparser import *
from os import listdir
import json
app = Flask(__name__)

scoreNames = [m.split('.')[0] for m in listdir('server/test/testCases/')]
#print(scoreNames)

@app.route('/api/musicscores/<scorename>')
def api_score(scorename):
    return generateJson(scorename)



@app.route('/api/musicscores/')
def api_search():
    if 'keyword' in request.args:
        rList = []
        for m in scoreNames:
            if request.args['keyword'].lower() in m.lower():
                rList.append(m)
        return json.dumps(rList)
    else:
        return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run()
