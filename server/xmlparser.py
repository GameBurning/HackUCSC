import xml.etree.ElementTree as ET
import sys

# TODO: Chrod in the first place
# TODO: REST

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

#- Read XML File -#
tree = ET.parse('test/testCases/Sweethearts.xml')
_root = tree.getroot()

#- Read title -#
_work = _root.find('work')
r_worktitle = "MusicTitle："
if _work != None:
    r_worktitle += _work.find('work-title').text
else:
    r_worktitle += _root.find('movement-title').text

identification = _root.find('identification')
#- Get Composer name -#
_creator = identification.find('creator')
r_composer = "Composer: "
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
r_tempo = "The tempo is: " + beatunit

#- Read Attributes#
clef_num = 0
#_stafflayout = p[0].find('measure/print/staff-layout')
_attrib = m[0].find('attributes')
_stafflayout = _attrib.find('staves')
if _stafflayout == None:
    clef_num = 1
else:
    clef_num = int(_stafflayout.text)
print(clef_num)

#- Read Division -#
divisions = _attrib.find('divisions').text
key = _attrib.find('key/fifths').text
r_key = fifthkey_dict[key]
beats = _attrib.find('time/beats').text
beat_type = _attrib.find('time/beat-type').text
r_beat = "Time Signature :" + beat_type + " " + beats

sign = []
for clef in _attrib.findall('clef'):
    sign.append(clef.find('sign').text)

whole_text = [] #Division texts list

#- Read whole score measure by measure -#
for m_single in m:
    m_text = []
    for i in range(0, clef_num):
        m_text.append([])
    for element in m_single:
        if element.tag == "note":
            note = element
            ##print(note.attrib)
            ##print(note[0].tag)
            if note.find('rest') is not None:
                if not note.find('rest/display-step'):
                    _type = ""
                    if note.find('type') is not None:
                        _type = note.find('type').text
                    _staff = note.find('staff').text
                    note_text = _type + " rest"
                    m_text[int(_staff)-1].append(note_text)
                    whole_text.append(m_text)
            else:
                _step = note.find('pitch/step').text
                _octave = note.find('pitch/octave').text
                _type = note.find('type').text
                # TODO: have no idea with voice attribute
                _staff = note.find('staff').text

                if note.find('accidental') is not None:
                    _step = note.find('accidental').text + " " + _step

                if note.find('chord') is not None:
                    note_text = " " + _step + _octave
                    m_text[int(_staff) - 1][-1] += note_text
                else:
                    note_text = _type + " " + _step + _octave
                    if note.find('notations'):
                        ssset = set()
                        for slur in note.findall('notations/slur'):
                            ssset.add(slur.attrib['type'])
                            print(ssset)
                        if ssset != set():
                            if ssset == set(['start']):
                                note_text = "start slur " + note_text
                            if ssset == set(['stop']):
                                note_text += " stop slur"
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
            elif element[0][0].tag == 'wedge':
                m_text[int(_staff) - 1].append(element[0][0].attrib['type'])

    whole_text.append(m_text)

comma = ", "
read_heading = r_worktitle + comma + \
r_composer + comma + \
r_tempo + comma + \
r_key + comma + \
r_beat
print(read_heading)
#print(whole_text)

print("right hand")
num = 0
for m in whole_text:
    num += 1
    print(num, end=': ')
    print(" , ".join(m[0]))

num = 0
print("left hand")
for m in whole_text:
    num += 1
    print(num, end=': ')
    print(" , ".join(m[1]))