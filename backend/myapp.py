#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request
from flask_cors import CORS, cross_origin
from sheet_parser import xmlparser
from pymongo import MongoClient
from os import listdir
import json
from bson import ObjectId
app = Flask(__name__)
CORS(app)

dir_name = 'static/sheet_music/'
scoreNames = [m.split('.xml')[0] for m in listdir(dir_name)]

fav_list = []
hist_list = []

client = MongoClient()
db_zh = client.zh
scores_zh = db_zh.score

db_en = client.en
scores_en = db_en.score

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


@app.route('/api/language/english/musicscores/favorite/')
def api_fav_en():
    if 'name' in request.args:
        if request.args['name'] not in fav_list:
            fav_list.append(request.args['name'])
        return json.dumps(fav_list)
    else:
        return json.dumps(fav_list)


@app.route('/api/language/chinese/musicscores/favorite/')
def api_fav_zh():
    if 'name' in request.args:
        if request.args['name'] not in fav_list:
            fav_list.append(request.args['name'])
        return json.dumps(fav_list)
    else:
        return json.dumps(fav_list)


@app.route('/api/language/english/musicscores/history/')
def api_hist_en():
    return json.dumps(hist_list)


@app.route('/api/language/chinese/musicscores/history/')
def api_hist_zh():
    return json.dumps(hist_list)


@app.route('/api/language/chinese/musicscores/')
def api_search_zh():
    if 'keyword' in request.args:
        return
    if 'title' in request.args:
        #if request.args['title'] not in hist_list:
        #    hist_list.append(request.args['title'])
        #else:
        #    del (hist_list[hist_list.index(request.args['title'])])
        #    hist_list.append(request.args['title'])
        #return parser_zh.generate_json(request.args['title'])

        result = scores_zh.find_one({"title_id":request.args['title']})
        print(type(result))
        return JSONEncoder().encode(result)
    else:
        return json.dumps(scoreNames)


@app.route('/api/language/english/musicscores/')
def api_search_en():
    if 'keyword' in request.args:
        result = [{"title": "For Elise", "title_mp3": "69f1ce301c91af6a336171188df2ef2f.ogg", "author": "Beethoven"}]
        return json.dumps(result)
    if 'title' in request.args:
        # if request.args['title'] not in hist_list:
        #     hist_list.append(request.args['title'])
        # else:
        #     del (hist_list[hist_list.index(request.args['title'])])
        #     hist_list.append(request.args['title'])
        # return parser_en.generate_json(request.args['title'])
        result = scores_en.find_one({"title_id": request.args['title']})
        print(type(result))
        return JSONEncoder().encode(result)
    else:
        return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
