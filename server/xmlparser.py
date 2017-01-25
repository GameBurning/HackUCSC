import xml.etree.ElementTree as ET
import json

#TODO: First repeat and sencond repeat have diffrent ending

fifthkey_dict = {
'-1':'F major. B-flat',\
'-2':'B-flat major. Key signature: B-flat; E-flat',\
'-3':'E-flat major. Key signature: A-flat; B-flat; E-flat',\
'-4':'A-flat major. Key signature: A-flat; B-flat; D-flat; E-flat',\
'-5':'D-flat major. Key signature: A-flat; B-flat; D-flat; E-flat; G-flat',\
'-6':'G-flat major. Key signature: A-flat; B-flat; C-flat; D-flat; E-flat; G-flat',\
'-7':'C-flat major. Key signature: A-flat; B-flat; C-flat; D-flat; E-flat; F-flat; G-flat',\
'0':'C major. Key signature: none',\
'1':'G major. Key signature: F-sharp',\
'2':'D major. Key signature: C-sharp; F-sharp',\
'3':'A major. Key signature: C-sharp; F-sharp; G-sharp',\
'4':'E major. Key signature: C-sharp; D-sharp; F-sharp; G-sharp',\
'5':'B major. Key signature: A-sharp; C-sharp; D-sharp; F-sharp; G-sharp',\
'6':'F-sharp major. Key signature: A-sharp; C-sharp; D-sharp; E-sharp; F-sharp; G-sharp',\
'7':'C-sharp major. Key signature: A-sharp; B-sharp; C-sharp; D-sharp; E-sharp; F-sharp; G-sharp'\
}

dynamic_dict = {
'p':'soft',
'pp':'very soft',
'ppp':'very very soft',
'f':'loud',
'ff':'very loud',
'fff':'very very loud',
'fz':'accented note',
'mf':'half strong',
'mp':'half soft'
}

octave_shift = "the following set of notes need to be shifted up by one octave"

def generateJson(scoreName):
    #- Read XML File -#
    tree = ET.parse('server/test/testCases/{}.xml'.format(scoreName))
    _root = tree.getroot()

    #- Read title -#
    _work = _root.find('work')
    #r_worktitle = "MusicTitle"
    r_worktitle = ""
    if _work != None:
        r_worktitle += _work.find('work-title').text
    else:
        r_worktitle += _root.find('movement-title').text

    identification = _root.find('identification')
    #- Get Composer name -#
    _creator = identification.find('creator')
    #r_composer = "Composer: "
    r_composer = ""
    if _creator != None and _creator.attrib['type'] == "composer":
        r_composer += _creator.text
    else:
        r_composer = ""

    #- Read Pages and mesuares -#
    p = [] #List of pages
    m = [] #List of measures

    for page in _root.findall('part'):
        p.append(page)
        for measure in page.findall('measure'):
            m.append(measure)

    #- Read Tempo -#
    _beatunit = m[0].find('direction/direction-type/metronome/beat-unit')
    beatunit = "not defined"
    if _beatunit is not None:
        beatunit = _beatunit.text
    _perminute = m[0].find('direction/direction-type/metronome/per-minute')
    if _perminute is not None:
        beatunit = _perminute.text + " " + beatunit + " notes" + " per minute"
    #r_tempo = "The tempo is: " + beatunit
    r_tempo = beatunit

    #- Read Attributes#
    clef_num = 0
    #_stafflayout = p[0].find('measure/print/staff-layout')
    _attrib = m[0].find('attributes')
    _stafflayout = _attrib.find('staves')
    if _stafflayout == None:
        clef_num = 1
    else:
        clef_num = int(_stafflayout.text)
    #print(clef_num)

    #- Read Division -#
    divisions = _attrib.find('divisions').text
    key = _attrib.find('key/fifths').text
    r_key = fifthkey_dict[key]
    beats = _attrib.find('time/beats').text
    beat_type = _attrib.find('time/beat-type').text
    #r_beat = "Time Signature :" + beats + " " + beat_type
    r_beat = beats + " " + beat_type

    sign = []
    for clef in _attrib.findall('clef'):
        sign.append(clef.find('sign').text)

    whole_text = [] #Division texts list

    #- Read whole score measure by measure -#
    for m_single in m:
        m_text = []
        for i in range(0, clef_num):
            m_text.append([])

        firstTimeBackupToStaff1 = True

        backups = m_single.findall('backup')
        if len(backups) > 1:
            m_text[0].append('first musical line')


        for element in m_single:
            if element.tag == "note":
                note = element
                if note.find('rest') is not None:
                    if not note.find('rest/display-step'):
                        _type = ""
                        if note.find('type') is not None:
                            _type = note.find('type').text
                        _staff = note.find('staff').text
                        note_text = _type + " rest"
                        m_text[int(_staff)-1].append(note_text)

                else:
                    _step = note.find('pitch/step').text
                    _octave = note.find('pitch/octave').text
                    _type = note.find('type').text
                    # TODO: have no idea with voice attribute
                    _staff = note.find('staff').text

                    if note.find('accidental') is not None:
                        _step = note.find('accidental').text + " " + _step

                    if note.find('chord') is not None:

                        # if "chord" not in m_text[int(_staff) - 1][-1]:
                        #     m_text[int(_staff) - 1][-1] = "chord " + m_text[int(_staff) - 1][-1]
                        if note.find('notations/arpeggiate') is not None:
                            if 'arpeggiated' not in m_text[int(_staff) - 1][-1]:
                                m_text[int(_staff) - 1][-1] = 'arpeggiated ' + m_text[int(_staff) - 1][-1]
                        note_text = " " + _step + _octave
                        m_text[int(_staff) - 1][-1] += note_text

                    else:
                        note_text = _type + " " + _step + " " + _octave
                        if note.find('dot') is not None:
                            note_text = "dotted " + note_text
                        if note.find('grace') is not None:
                            if note.find('grace').attrib['slash'] == "yes":
                                note_text = "grace note " + note_text

                        if note.find('tie') is not None:
                            note_text = "tied note " + note_text

                        if note.find('notations') is not None:
                            isTuplet = False
                            ssset = set()
                            if note.find('notations/articulations/staccato') is not None:
                                note_text = "staccato " + note_text


                            for slur in note.findall('notations/slur'):
                                ssset.add(slur.attrib['type'])
                                #print(ssset)
                            if note.find('notations/tuplet') is not None:
                                isTuplet = True
                            if ssset != set():
                                if ssset == set(['start']):
                                    if isTuplet:
                                        note_text = "start tuplet " + note_text
                                    else:
                                        note_text = "start slur " + note_text
                                if ssset == set(['stop']):
                                    if isTuplet:
                                        note_text = note_text + " stop tuplet "
                                    else:
                                        note_text = note_text + " stop slur "

                        m_text[int(_staff) - 1].append(note_text)


            elif element.tag == "direction":
                _staff = element.find('staff').text
                if element.find('direction-type')[0].tag == 'word':
                    m_text[int(_staff) - 1].append(element.find('direction-type')[0].text)
                elif element[0][0].tag == 'dynamics':
                    # print(element[0][0][0].tag)
                    m_text[int(_staff) - 1].append(dynamic_dict[element[0][0][0].tag])
                elif element[0][0].tag == 'octave-shift':
                    m_text[int(_staff) - 1].append(octave_shift)
                elif element[0][0].tag == 'wedge' and element[0][0].attrib['type']!="stop":
                    m_text[int(_staff) - 1].append(element[0][0].attrib['type'])

            elif element.tag == "backup":
                if firstTimeBackupToStaff1 and m_text[0][0] == 'first musical line':
                    m_text[0].append('second musical line')
                    firstTimeBackupToStaff1 = False

        whole_text.append(m_text)

    comma = " , "
    read_heading = r_worktitle + comma + \
    r_composer + comma + \
    r_tempo + comma + \
    r_key + comma + \
    r_beat

    metaInfo = {'title':r_worktitle,
                'composer': r_composer,
                'tempo':r_tempo,
                'key':r_key,
                'beat':r_beat}

    scoreContent = {}

    #print(read_heading)

    #print("right hand")
    num = 0
    for m in whole_text:
        num += 1
        scoreContent[num] = {}
        scoreContent[num]['Right'] = comma.join(m[0])
        #print(num, end=': ')
        #print(comma.join(m[0]))

    num = 0
    #print("left hand")
    for m in whole_text:
        num += 1
        scoreContent[num]['Left'] = comma.join(m[1])
        #print(num, end=': ')
        #print(" , ".join(m[1]))

    scoreInfo = {
        'metaInfo':metaInfo,
        'scoreContent':scoreContent
    }

    return json.dumps(scoreInfo,indent=4, separators=(',', ': '))

#print(generateJson('Sweethearts'))
#print(generateJson('Fur_Elise'))
<<<<<<< HEAD
#print(generateJson('Autumn_Leaves'))
#print(generateJson('Nyan_Cat'))
=======
print(generateJson('Autumn_Leaves'))
>>>>>>> 04b2505e55e685c2b70bdabce950fcb841190ffa
