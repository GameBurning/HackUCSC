from flask import Flask, request
from flask_cors import CORS, cross_origin
from parser import xmlparser
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
    if 'language' in request.args:
        xmlparser.set_language(request.args['language'].lower())
    if 'title' in request.args:
        if request.args['title'] not in hist_list:
            hist_list.append(request.args['title'])
        else:
            del (hist_list[hist_list.index(request.args['title'])])
            hist_list.append(request.args['title'])
        return xmlparser.generateJson(request.args['title'])
    else:
        return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run()
