class i18n(object):
    __musical_text = {
        "english": {
            "key": {
                '-1': 'F major. B-flat',
                '-2': 'B-flat major. Key signature: B-flat; E-flat',
                '-3': 'E-flat major. Key signature: A-flat; B-flat; E-flat',
                '-4': 'A-flat major. Key signature: A-flat; B-flat; D-flat; E-flat',
                '-5': 'D-flat major. Key signature: A-flat; B-flat; D-flat; E-flat; G-flat',
                '-6': 'G-flat major. Key signature: A-flat; B-flat; C-flat; D-flat; E-flat; G-flat',
                '-7': 'C-flat major. Key signature: A-flat; B-flat; C-flat; D-flat; E-flat; F-flat; G-flat',
                '0': 'C major. Key signature: none',
                '1': 'G major. Key signature: F-sharp',
                '2': 'D major. Key signature: C-sharp; F-sharp',
                '3': 'A major. Key signature: C-sharp; F-sharp; G-sharp',
                '4': 'E major. Key signature: C-sharp; D-sharp; F-sharp; G-sharp',
                '5': 'B major. Key signature: A-sharp; C-sharp; D-sharp; F-sharp; G-sharp',
                '6': 'F-sharp major. Key signature: A-sharp; C-sharp; D-sharp; E-sharp; F-sharp; G-sharp',
                '7': 'C-sharp major. Key signature: A-sharp; B-sharp; C-sharp; D-sharp; E-sharp; F-sharp; G-sharp'
            },
            "dynamic": {
                'p': 'soft',
                'pp': 'very soft',
                'ppp': 'very very soft',
                'f': 'loud',
                'ff': 'very loud',
                'fff': 'very very loud',
                'fz': 'accented note',
                'mf': 'half strong',
                'mp': 'half soft'
            },
            "other": {
                "octave_shift": "the following set of notes need to be shifted up by one octave"

            }
        },
        "chinese": {
            "key": dict(zip(['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5'],
                           ['5个降号', '4个降号', '3个降号', '2个降号'
                            , '1个降号', '没有升降号', '1个升号',
                            '2个升号', '3个升号', '4个升号', '5个升号'])),
            "dynamic": {
                'p': '弱',
                'pp': '很弱',
                'ppp': '最弱',
                'f': '强',
                'ff': '很强',
                'fff': '最强',
                'fz': '突强',
                'mf': '中强',
                'mp': '中弱'
            },
            "other": {
                "octave_shift": "以下的一组音符需要升高八度"
            }
        }
    }
    __language = None

    def set_language(self, lang):
        lang = lang.lower()
        if lang != "english" or lang != "chinese":
            print('only support English and Chinese')
        self.__language = lang

    def get_text(self, keyword, t="default"):
        # if the keyword is not found, return itself
        if self.__language is None:
            print("language not set")
            return False
        return self.__musical_text[self.language][t].get(keyword, keyword)
