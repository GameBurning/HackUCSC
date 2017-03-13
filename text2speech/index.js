var fs = require('fs');
var express = require('express');
var cors = require('cors')
var _ = require('lodash');
var request = require('request');
var app = express();
var urlencode = require('urlencode');
var randomstring = require("randomstring");

// use:  http://localhost:8001/speak?sentence=good day Jamie
// use:  http://localhost:8001/voice/ffdsafdsafdsafsadrjenqw.wav

app.use(cors());

// IBM Watson API setting up
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var ibm_text_to_speech = new TextToSpeechV1({
    username: 'a97c57a2-b373-4aea-b706-869950719784',
    password: '5P6rFTI50BOD'
});

// Baidu API setting up
let bd_API_key = "aXBN99hC2CATILtUamu9qAqX";
let bd_secrete_key = "90e0cebf926af60cdf69bc5adce1d7b9";
let bd_token = "";

let next_id = randomstring.generate(36);
let hash_table = {};
let filePath = "./voiceStore";

var locked = false;

function english_audio_fetch(sentence, hash_key, res) {
    // console.log(" in english_audio_fetch() ");
    var query = {
        text: sentence,
        voice: 'en-US_AllisonVoice',
        accept: 'audio/wav'
    };

    // Pipe the synthesized text to a file.
    let stream = ibm_text_to_speech.synthesize(query, function() {

    }).pipe(fs.createWriteStream(filePath + '/' + next_id + '.wav'));

    stream.on('finish', function () {
        locked = false;
        // console.log("unlocked");
        res.send('/voice/' + next_id + '.wav');
        hash_table[hash_key] = next_id;
        // console.log(" got synthesize ");
        next_id = randomstring.generate(36);
    });

    return;
}

function get_baidu_token(cb) {
    request.post({
        url:'https://openapi.baidu.com/oauth/2.0/token'
        ,form: {
            grant_type : 'client_credentials',
            client_id : bd_API_key,
            client_secret : bd_secrete_key,
        }}
    , function(error, response, body){
        var body = JSON.parse(body);
        if(!body.hasOwnProperty('error')) {
            bd_token = body.access_token;
            if(cb) cb();
            console.log("Baidu token Ready");
        }
        else console.log("CANNOT GET TOKEN");
    })
}

function chinese_audio_fetch(sentence, hash_key, res) {

    // Sending to Baidu API, doc  http://yuyin.baidu.com/file/download/1181
    var options = {
        method: 'GET',
        url: 'http://tsn.baidu.com/text2audio',
        qs: {
            tex: urlencode(sentence),
            cuid: 'ac:bc:32:bf:d9:0f',
            ctp: '1',
            tok: bd_token,
            lan: 'zh'
        }
    };

    var stream = request(options, function(error, response, body) {
        if (error) {
            // console.log("NET WORK CONNECTION ERR");
        } else {
            try {
                body = JSON.parse(body);
                // Auth expired or not yet got
                if(body.err_no == 501) {
                    console.log("auth reset");
                    get_baidu_token(function(){
                        chinese_audio_fetch(sentence, hash_key, res);
                    })
                }
                else {
                    // console.log("UNKNOW ERROR: " + body);
                }
            } catch(e) {
                // It is not valid JSON, then it is correct response
            }
        }
    })
    .pipe(fs.createWriteStream(filePath + '/' + next_id + '.mp3'));

    stream.on('finish', function () {
        locked = false;
        // console.log("unlocked");

        // console.log("Got MP3 FILE");
        hash_table[hash_key] = next_id;
        // console.log(hash_table);

        res.send('/voice/' + next_id + '.mp3');

        next_id = randomstring.generate(36);
    });

}

app.get('/speak', function(req, res) {
    var sentence = req.query.sentence.trim();
    var language = req.query.language;

    // normalize language name
    if (language.indexOf("en") != -1) {
        language = "en";
    } else if (language.indexOf("zh") != -1) {
        language = "zh";
    }

    console.log(req.query);

    if (!sentence || sentence.length > 1024) {
        res.send('');
        return;
    }

    var hash_key = language + " " + sentence;
    // console.log(sentence);

    if (_.has(hash_table, hash_key)) {
        if(hash_key.indexOf("zh") != -1) res.send('/voice/' + hash_table[hash_key] + '.mp3');
        if(hash_key.indexOf("en") != -1) res.send('/voice/' + hash_table[hash_key] + '.wav');
        return;
    } else {
        // console.log("using API - hash_key:" + hash_key);

        if (language == "en") {
            //English
            let interval = setInterval(function() {
                if(locked) {
                    // console.log("waiting");
                }
                else {
                    clearInterval(interval);
                    locked = true;
                    english_audio_fetch(sentence, hash_key, res);
                }
            }, 100);

        } else if (language == "zh") {
            //Chinese
            while(locked) {
                // console.log("waiting");
            }

            let interval = setInterval(function() {
                if(locked) {
                    // console.log("wait");
                }
                else {
                    clearInterval(interval);
                    locked = true;
                    chinese_audio_fetch(sentence, hash_key, res);
                }
            }, 100);

        }
    }

});

app.use('/voice', express.static(__dirname + '/voiceStore'));

app.listen(8001, '0.0.0.0', function() {
    console.log("starting server");
    get_baidu_token();
})
