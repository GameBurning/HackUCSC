#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import xml.etree.ElementTree as ET
# from enum import Enum
import i18n

# TODO: First repeat and second repeat have different endings


class XmlParser:
    # TODO : Implement Enum instead of dictionary keyword
    # class MetaData(Enum):
    #     tempo = 0


    def __init__(self, path_to_sheet_folder, language="English"):
        self.trans_class = i18n.I18N()
        self._ = self.trans_class.get_text
        self.language = language
        self.path = path_to_sheet_folder
        # results
        self.metadata = {}
        self.body = {}
        self.trans_class.set_language(self.language)

    def set_language(self, language):
        self.language = language
        self.trans_class.set_language(self.language)

    def read_title_and_composer(self, _root):
        # Read title
        _work = _root.find('work')
        self.metadata["title"] = ""

        if _work is not None:
            self.metadata["title"] += self._(_work.find('work-title').text)
        else:
            self.metadata["title"] += self._(_root.find('movement-title').text)

        identification = _root.find('identification')

        # Get Composer name
        _creator = identification.find('creator')

        self.metadata["composer"] = ""
        if _creator is not None and _creator.attrib['type'] == "composer":
            self.metadata["composer"] += _creator.text
        else:
            self.metadata["composer"] = ""

    def read_tempo(self, _m):
        # - Read Tempo - #
        _beat_unit = _m[0].find('direction/direction-type/metronome/beat-unit')
        beat_unit = self._("not defined")
        if _beat_unit is not None:
            beat_unit = _beat_unit.text
        _per_minute = _m[0].find('direction/direction-type/metronome/per-minute')

        if _per_minute is not None:
            if self.trans_class.get_language() == 'english':
                beat_unit = _per_minute.text + " " + beat_unit + " notes" + " per minute"
            else:
                beat_unit = "每分钟 " + _per_minute.text + " 拍"

        self.metadata["tempo"] = beat_unit

    def read_attributes(self, _m):
        # Read Attributes
        _attrib = _m[0].find('attributes')
        _staff_layout = _attrib.find('staves')

        if _staff_layout is None:
            self.metadata["clef_num"] = 1
        else:
            self.metadata["clef_num"] = int(_staff_layout.text)

        # Read Division
        self.metadata["divisions"] = _attrib.find('divisions').text
        key = _attrib.find('key/fifths').text
        self.metadata["key"] = self._(key, "key")
        beats = _attrib.find('time/beats').text
        beat_type = _attrib.find('time/beat-type').text
        # r_beat = "Time Signature :" + beats + " " + beat_type
        self.metadata["beat"] = self._(beats) + " " + self._(beat_type) + " " + self._(" 拍")

    def generate_json(self, score_name):
        # - Read XML File - #
        tree = ET.parse('{}/{}.xml'.format(self.path, score_name))
        root = tree.getroot()

        # Read Pages and measures
        p = []  # List of pages
        m = []  # List of measures

        for page in root.findall('part'):
            p.append(page)
            for measure in page.findall('measure'):
                m.append(measure)

        self.read_title_and_composer(root)
        self.read_tempo(m)
        self.read_attributes(m)

        whole_text = []  # Division texts list

        # Read whole score measure by measure
        for m_single in m:
            m_text = []
            for i in range(0, self.metadata["clef_num"]):
                m_text.append([])

            first_time_backup_to_staff1 = True

            backups = m_single.findall('backup')
            if len(backups) > 1:
                m_text[0].append(self._('first musical line'))

            for element in m_single:
                if element.tag == "note":
                    note = element
                    if note.find('rest') is not None:
                        if not note.find('rest/display-step'):
                            _type = ""
                            if note.find('type') is not None:
                                _type = note.find('type').text
                            _staff = note.find('staff').text
                            note_text = self._(_type, 'duration') + self._(" rest")
                            m_text[int(_staff)-1].append(note_text)

                    else:
                        _step = note.find('pitch/step').text
                        _octave = note.find('pitch/octave').text
                        _type = note.find('type').text
                        # TODO: have no idea with voice attribute
                        _staff = note.find('staff').text

                        if note.find('accidental') is not None:
                            _step = self._(note.find('accidental').text, "accidental") + self._(_step, "step")

                        if note.find('chord') is not None:
                            # if "chord" not in m_text[int(_staff) - 1][-1]:
                            #     m_text[int(_staff) - 1][-1] = "chord " + m_text[int(_staff) - 1][-1]
                            if note.find('notations/arpeggiate') is not None:
                                if 'arpeggiated' not in m_text[int(_staff) - 1][-1]:
                                    m_text[int(_staff) - 1][-1] = self._('arpeggiated ') + m_text[int(_staff) - 1][-1]

                            if self.trans_class.get_language() == "english":
                                note_text = " " + self._(_step,"step") + self._(_octave, "octave")
                            else:
                                note_text = " " + self._(_octave, "octave") + self._(_step, "step")

                            m_text[int(_staff) - 1][-1] += note_text

                        else:
                            if self.trans_class.get_language() == "english":
                                note_text = self._(_type, "duration") + " " + self._(_step, "step") + " " + \
                                        self._(_octave, "octave")
                            else:
                                note_text = self._(_type, "duration") + " " + self._(_octave, "octave") + \
                                        self._(_step, "step") + " "

                            if note.find('dot') is not None:
                                note_text = self._("dotted ") + note_text
                            if note.find('grace') is not None:
                                if note.find('grace').attrib['slash'] == "yes":
                                    note_text = self._("grace note ") + note_text

                            if note.find('tie') is not None:
                                note_text = self._("tied note ") + note_text

                            if note.find('notations') is not None:
                                is_tuplet = False
                                ssset = set()
                                if note.find('notations/articulations/staccato') is not None:
                                    note_text = "staccato " + note_text

                                for slur in note.findall('notations/slur'):
                                    ssset.add(slur.attrib['type'])

                                if note.find('notations/tuplet') is not None:
                                    is_tuplet = True

                                if ssset != set():
                                    if ssset == set(['start']):
                                        if is_tuplet:
                                            note_text = self._("start tuplet ") + note_text
                                        else:
                                            note_text = self._("start slur ") + note_text
                                    if ssset == set(['stop']):
                                        if is_tuplet:
                                            note_text = note_text + self._(" stop tuplet ")
                                        else:
                                            note_text = note_text + self._(" stop slur ")

                            m_text[int(_staff) - 1].append(note_text)

                elif element.tag == "direction":
                    _staff = element.find('staff').text
                    if element.find('direction-type')[0].tag == 'word':
                        m_text[int(_staff) - 1].append(element.find('direction-type')[0].text)
                    elif element[0][0].tag == 'dynamics':
                        # print(element[0][0][0].tag)
                        m_text[int(_staff) - 1].append(self._(element[0][0][0].tag, 'dynamics'))
                    elif element[0][0].tag == 'octave-shift':
                        m_text[int(_staff) - 1].append(self._('octave_shift', 'others'))
                    elif element[0][0].tag == 'wedge' and element[0][0].attrib['type']!="stop":
                        m_text[int(_staff) - 1].append(self._(element[0][0].attrib['type'], 'wedge'))

                elif element.tag == "backup":
                    if first_time_backup_to_staff1 and m_text[0][0] == 'first musical line':
                        m_text[0].append(self._('second musical line'))
                        first_time_backup_to_staff1 = False

            whole_text.append(m_text)

        comma = " , "

        metaInfo = {self._('title','meta'): self._(self.metadata["title"],'title'),
                    self._('composer','meta'): self._(self.metadata["composer"],'composer'),
                    self._('tempo','meta'): self._(self.metadata["tempo"]),
                    self._('key','meta'): self.metadata["key"],
                    self._('beat','meta'): self.metadata["beat"]
                    }

        score_content = {}

        num = 0
        for m in whole_text:
            num += 1
            score_content[num] = {}
            score_content[num]['Right'] = comma.join(m[0])

        num = 0
        for m in whole_text:
            num += 1
            score_content[num]['Left'] = comma.join(m[1])

        scoreInfo = {
            'metaInfo':metaInfo,
            'scoreContent':score_content
        }

        return json.dumps(scoreInfo, indent=4, separators=(',', ': '))


if __name__ == "__main__":
    #print(generateJson('Sweethearts'))
    parser = XmlParser('../test/testCases', 'chinese')
    print(parser.generate_json('Fur_Elise'))
