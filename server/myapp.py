#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request
from flask_cors import CORS, cross_origin
from sheet_parser import xmlparser
from os import listdir
import json
app = Flask(__name__)
CORS(app)

scoreNames = [m.split('.xml')[0] for m in listdir('static/sheet_music/')]

fav_list = []
hist_list = []

parser_zh = xmlparser.XmlParser('test/testCases', "Chinese")
parser_en = xmlparser.XmlParser('test/testCases')


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
        rList = []
        for m in scoreNames:
            if isinstance(request.args['keyword'], str) and isinstance(m.lower(), str):
                if request.args['keyword'].lower() in m.lower():
                    newDict = {}
                    newDict['name'] = m
                    # newDict['composer'] = "Not implemented yet"
                    rList.append(newDict)
            elif isinstance(request.args['keyword'], unicode) or isinstance(m.lower(), unicode):
                if request.args['keyword'] in m:
                    newDict = {}
                    newDict['name'] = m
                    # newDict['hardness'] = "Not implemented yet"
                    rList.append(newDict)

        return json.dumps(rList)
    if 'title' in request.args:
        if request.args['title'] not in hist_list:
            hist_list.append(request.args['title'])
        else:
            del (hist_list[hist_list.index(request.args['title'])])
            hist_list.append(request.args['title'])
        return parser_zh.generate_json(request.args['title'])
    else:
        return json.dumps(scoreNames)


@app.route('/api/language/english/musicscores/')
def api_search_en():
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
    if 'title' in request.args:
        if request.args['title'] not in hist_list:
            hist_list.append(request.args['title'])
        else:
            del (hist_list[hist_list.index(request.args['title'])])
            hist_list.append(request.args['title'])
        return parser_en.generate_json(request.args['title'])
    else:
        return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run()
