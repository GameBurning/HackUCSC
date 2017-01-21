from flask import Flask, url_for
from server.xmlparser import *
app = Flask(__name__)

@app.route('/api/musicscores/<scorename>')
def api_score(scorename):
    return generateJson(scorename)

if __name__ == '__main__':
    app.run()
