from flask import Flask, request
from flask_cors import CORS, cross_origin
from xmlparser import *
from os import listdir
import json
app = Flask(__name__)
CORS(app)

scoreNames = [m.split('.xml')[0] for m in listdir('static/sheetMusic/')]

fav_list = []
hist_list = []

@app.route('/api/musicscores/favorite/')
def api_fav():
    if 'name' in request.args:
        if request.args['name'] not in fav_list:
            fav_list.append(request.args['name'])
        return json.dumps(fav_list)
    else:
        return json.dumps(fav_list)

@app.route('/api/musicscores/<scorename>')
def api_score(scorename):
    if scorename not in hist_list:
        hist_list.append(scorename)
    else:
        del(hist_list[hist_list.index(scorename)])
        hist_list.append(scorename)
    return generateJson(scorename)
    

@app.route('/api/musicscores/history/')
def api_hist():
    return json.dumps(hist_list)

@app.route('/api/musicscores/')
def api_search():
    if 'keyword' in request.args:
        rList = []
        for m in scoreNames:
            if request.args['keyword'].lower() in m.lower():
                newDict = {}
                newDict['name'] = m
                newDict['hardness'] = "Not implemented yet"
                newDict['composer'] = "Not implemented yet"
                rList.append(newDict)
        return json.dumps(rList)
    else:
        return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run()
