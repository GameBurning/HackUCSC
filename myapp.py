from flask import Flask, request
from server.xmlparser import *
from os import listdir
import json
app = Flask(__name__)

scoreNames = [m.split('.xml')[0] for m in listdir('server/test/testCases/')]
hardness_dict = {
    '1-2': 1,
    'Andromeda_Serenade':5,
    'Nyan_Cat':3,
    '3-4':2,
    'Autumn_Leaves':5,
    '599-47': 4,
    '5':2,
    'Sonate_in_F_Major':4,
    'Sweethearts':5,
    '6-7':2,
    'Fur_Elise':2,
    'Waltz_No.1_in_C_Major':4}

composer_dict = {
    '1-2' : 'Carl Czerny',
    'Andromeda_Serenade':'Ludwig Van Beethoven',
    '3-4':'Carl Czerny',
    '5':'Carl Czerny',
    '6-7':'Carl Czerny',
    '599-47':'Carl Czerny',
    'Nyan_Cat':'sarajoon',
    'Sonate_in_F_Major':'Ludwig Van Beethoven',
    'Autumn_Leaves':'Joseph Kosma',
    'Sweethearts':'H F Neilsson',
    'Fur_Elise':'Ludwig Van Beethoven',
    'Waltz_No.1_in_C_Major':'Noah Garnier'
}

@app.route('/api/musicscores/<scorename>')
def api_score(scorename):
    return generateJson(scorename)

@app.route('/api/musicscores/')
def api_search():
    if 'keyword' in request.args:
        rList = []
        for m in scoreNames:
            if request.args['keyword'].lower() in m.lower():
                newDict = {}
                newDict['name'] = m
                newDict['hardness'] = hardness_dict[m]
                newDict['composer'] = composer_dict[m]
                rList.append(newDict)
        return json.dumps(rList)
    else:
        return json.dumps(scoreNames)

if __name__ == '__main__':
    app.run()
