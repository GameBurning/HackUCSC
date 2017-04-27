# -*- coding=utf-8 -*-
import urllib.request
import urllib
import json
import urllib.parse
import hashlib
import requests
from pymongo import MongoClient
import os
from xmlparser import XmlParser

mp3_dir_path = os.path.expanduser('~/static/')
sheet_dir_path = '../static/sheet_music'
Update_Mp3 = True
Update_Index = True

Update_Length = True

def _get_md5_hex(text):
    return hashlib.md5(text.encode('utf-16be')).hexdigest()

def run():
    client = MongoClient()
    client.drop_database('beta')
    db = client.beta
    xml_parser = XmlParser(sheet_dir_path, "english")

    if Update_Index:
        for i in range(1000):
            index_test = "Measure {}".format(i)
            save_to_mp3(index_test, filename=str(i)+"_en")
        save_to_mp3("left hand part",filename="left_en")
        save_to_mp3("right hand part",filename="right_en")


    if Update_Length:
        for i in range(1000):
            save_to_mp3(str(i), filename="length/" + str(i) + "_en")
        save_to_mp3("Sentence Length:", filename="length_en")


    mp3_files = os.listdir(sheet_dir_path)
    for mp3_file in mp3_files:
        if mp3_file[-4:] == ".xml":
            score = xml_parser.generate_score(mp3_file)
            meta_text = ""
            for i in score['metaInfo']:
                for k in i.keys():
                    meta_text += k + " : " + i[k] + ','
            # print(meta_text)
            meta_mp3 = save_to_mp3(meta_text)
            score['metaInfo'] = {
                "text" : score['metaInfo'],
                'mp3' : meta_mp3 + '.mp3'
            }
            score['title_id'] = score['title']
            score['title'] = {
                "text": score['title'],
                'mp3': save_to_mp3(score['title']) + '.mp3'
            }
            score['composer'] = {
                "text": score['composer'],
                'mp3': save_to_mp3(score['composer']) + '.mp3'
            }
            score['key'] = {
                "text": score['key'],
                'mp3': save_to_mp3(score['key']) + '.mp3'
            }
            for measure_num in score['scoreContent']:
                # print(measure_num)
                # print(score['scoreContent'][measure_num])
                left_text = 'Measure {} '.format(measure_num)\
                            +score['scoreContent'][measure_num]['Left']
                right_text = 'Measure {} '.format(measure_num)\
                            +score['scoreContent'][measure_num]['Right']

                if Update_Mp3:
                    left_mp3 = save_to_mp3(left_text)
                    right_mp3 = save_to_mp3(right_text)

                else:
                    left_mp3 = _get_md5_hex(left_text)
                    right_mp3 = _get_md5_hex(right_text)

                score['scoreContent'][measure_num]['Right'] = {
                    "text" : score['scoreContent'][measure_num]['Right'],
                    "mp3" : right_mp3 + '.mp3'
                }
                score['scoreContent'][measure_num]['Left'] = {
                    "text" : score['scoreContent'][measure_num]['Left'],
                    "mp3" : left_mp3 + '.mp3'
                }

            result = db.score.insert_one(score)
            print(result)


def save_to_mp3(text, filename=None):
    headers = {'accept': 'audio/flac'}
    ibm_api = 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?text='
    auth = ('a97c57a2-b373-4aea-b706-869950719784', '5P6rFTI50BOD')
    if filename:
        mp3_name = filename
    else:
        mp3_name = _get_md5_hex(text)
    r = r = requests.get(ibm_api, auth=auth, headers = headers)
    code = r.status_code
    print(text)
    print(code)
    if code == 200:
        with open(mp3_dir_path + mp3_name+'.flac',"wb") as file:
            for chunk in r.iter_content(1024):
                file.write(chunk)
        return mp3_name
    else:
        return 'error'


if __name__ == '__main__':
    run()