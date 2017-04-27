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
Update_Mp3 = False
Update_Index = False

Update_Length = False

def _get_md5_hex(text):
    return hashlib.md5(text.encode('utf-16be')).hexdigest()

def run():
    client = MongoClient()
    client.drop_database('en')
    db = client.en
    xml_parser = XmlParser(sheet_dir_path, "english")

    if Update_Index:
        for i in range(50):
            index_test = "Measure {}".format(i)
            save_to_flac(index_test, filename=str(i) + "_en")
        save_to_flac("left hand part", filename="left_en")
        save_to_flac("right hand part", filename="right_en")


    if Update_Length:
        for i in range(10):
            save_to_flac(str(i), filename="length/" + str(i) + "_en")
        save_to_flac("Sentence Length:", filename="length_en")


    mp3_files = os.listdir(sheet_dir_path)
    for mp3_file in mp3_files:
        if mp3_file[-4:] == ".xml":
            score = xml_parser.generate_score(mp3_file)
            meta_text = ""
            for i in score['metaInfo']:
                for k in i.keys():
                    meta_text += k + ". " + i[k] + '. '
            # print(meta_text)
            meta_mp3 = save_to_flac(meta_text)
            score['metaInfo'] = {
                "text" : score['metaInfo'],
                'mp3' : meta_mp3 + '.ogg'
            }
            score['title_id'] = score['title']
            score['title'] = {
                "text": score['title'],
                'mp3': save_to_flac(score['title']) + '.ogg'
            }
            score['composer'] = {
                "text": score['composer'],
                'mp3': save_to_flac(score['composer']) + '.ogg'
            }
            score['key'] = {
                "text": score['key'],
                'mp3': save_to_flac(score['key']) + '.ogg'
            }
            for measure_num in score['scoreContent']:
                # print(measure_num)
                # print(score['scoreContent'][measure_num])
                left_text = 'Measure {}. '.format(measure_num)\
                            +score['scoreContent'][measure_num]['Left']
                right_text = 'Measure {}. '.format(measure_num)\
                            +score['scoreContent'][measure_num]['Right']

                if Update_Mp3:
                    left_mp3 = save_to_flac(left_text)
                    right_mp3 = save_to_flac(right_text)

                else:
                    left_mp3 = _get_md5_hex(left_text)
                    right_mp3 = _get_md5_hex(right_text)

                score['scoreContent'][measure_num]['Right'] = {
                    "text" : score['scoreContent'][measure_num]['Right'],
                    "mp3" : right_mp3 + '.ogg'
                }
                score['scoreContent'][measure_num]['Left'] = {
                    "text" : score['scoreContent'][measure_num]['Left'],
                    "mp3" : left_mp3 + '.ogg'
                }

            result = db.score.insert_one(score)
            print(result)


def save_to_flac(text, filename=None):
    headers = {'accept': 'audio/ogg;codecs=opus'}
    ibm_api = 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=en-US_AllisonVoice&text='
    auth = ('a97c57a2-b373-4aea-b706-869950719784', '5P6rFTI50BOD')
    if filename:
        mp3_name = filename
    else:
        mp3_name = _get_md5_hex(text)
    r = requests.get(ibm_api + text, auth=auth, headers = headers)
    code = r.status_code
    print(text)
    print(code)
    print(mp3_name)
    if code == 200:
        with open(mp3_dir_path + mp3_name+'.ogg',"wb") as file:
            print(mp3_dir_path+mp3_name+'.ogg')
            for chunk in r.iter_content(1024):
                file.write(chunk)
        return mp3_name
    else:
        return 'error'


if __name__ == '__main__':
    run()
