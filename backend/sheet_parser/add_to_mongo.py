# -*- coding=utf-8 -*-
import urllib.request
import urllib
import json
import urllib.parse
import hashlib
from pymongo import MongoClient
import os
from xmlparser import XmlParser

mp3_dir_path = os.path.expanduser('~/mp3files/')
sheet_dir_path = '../static/sheet_music'


def run():
    client = MongoClient()
    db = client.beta
    xml_parser = XmlParser(sheet_dir_path, "chinese")
    mp3_files = os.listdir(sheet_dir_path)
    for mp3_file in mp3_files:
        if mp3_file[-4:] == ".xml":
            score = xml_parser.generate_score(mp3_file)
            for measure_num in score['scoreContent']:
                #print(measure_num)
                print(score['scoreContent'][measure_num])
                left_mp3 = save_to_mp3(score['scoreContent'][measure_num]['Left'])
                right_mp3 = save_to_mp3(score['scoreContent'][measure_num]['Right'])
                score['scoreContent'][measure_num]['Right'] = {
                    "text" : score['scoreContent'][measure_num]['Right'],
                    "mp3" : right_mp3
                }
                score['scoreContent'][measure_num]['Left'] = {
                    "text": score['scoreContent'][measure_num]['Left'],
                    "mp3": left_mp3
                }
                #score['scoreContent']
                # for hand in measure:
                #     print(hand)
            result = db.score.insert_one(score)


def save_to_mp3(text, cuid='3c:15:c2:d2:0a:02'):
    baidu_api = 'http://tsn.baidu.com/text2audio'
    token = '24.f61a23f1e782676f1fd919a4dd8830c9.2592000.1491628839.282335-9326479'
    lan = 'zh'
    data = {'tex': text, 'lan': lan, 'cuid': cuid, 'ctp': 1, 'tok': token}
    data_urlencode = urllib.parse.urlencode(data)
    mp3_name = hashlib.md5(text.encode('utf-16be')).hexdigest()
    r = urllib.request.urlopen(baidu_api, str.encode(data_urlencode))
    code = r.getcode()
    print(code)
    if code == 200:
        result = r.read()
        file = open(mp3_dir_path + mp3_name+'.mp3',"wb")
        file.write(result)
        file.close()
        return mp3_name
    else:
        return 'error'


if __name__ == '__main__':
    run()
