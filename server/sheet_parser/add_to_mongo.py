# -*- coding=utf-8 -*-
import urllib.request
import urllib
import json
import urllib.parse
import base64
import os
import wave
import struct
import time
import hashlib
import os
import xmlparser


def run():
    print('need implementation')

def save_to_mp3(text, cuid='3c:15:c2:d2:0a:02'):
    baidu_api = 'http://tsn.baidu.com/text2audio'
    token = '24.f61a23f1e782676f1fd919a4dd8830c9.2592000.1491628839.282335-9326479'
    lan='zh'
    data={'tex':text,'lan':lan,'cuid':cuid,'ctp':1,'tok':token}
    data_urlencode=urllib.parse.urlencode(data)
    mp3_name = hashlib.md5(text.encode('utf-16be')).hexdigest()
    r=urllib.request.urlopen(baidu_api, str.encode(data_urlencode))
    code = r.getcode()
    print(code)
    if code == 200:
        result=r.read()
        file=open(os.path.expanduser('~/mp3files/')+ mp3_name+'.mp3',"wb")
        file.write(result)
        file.close()
        return mp3_name
    else:
        return 'error'

if __name__ == '__main__':
    save_to_mp3('我是高泊宁')
