var fs = require('fs');
var express = require('express');
var _ = require('lodash');
var app = express();
var randomstring = require("randomstring");

// use:  http://localhost:8001/speak?sentence=good day Jamie
// use:  http://localhost:8001/voice/ffdsafdsafdsafsadrjenqw.wav

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var text_to_speech = new TextToSpeechV1 ({
  username: 'a97c57a2-b373-4aea-b706-869950719784',
  password: '5P6rFTI50BOD'
});

let next_id = randomstring.generate(36);
let hash_table = {};
let filePath = "./voiceStore";

app.get('/speak', function(req, res){

	var sentence = req.query.sentence;
	console.log(req.query);

	if(!sentence || sentence.length > 10000) {
		res.send('');
		return;
	}

	if(_.has(hash_table, sentence)) {
        console.log("using hash map");
        console.log(hash_table);
		res.send('/voice/'+hash_table[sentence]+'.wav');
		return;
	}
	else {
        console.log("using API");
        console.log("" + sentence);

		var query = {
	      text: sentence,
	      "language": "en-US",
		  "gender": "male",
	      accept: 'audio/wav'
	    };

	    // Pipe the synthesized text to a file.
	    text_to_speech.synthesize(query).pipe(fs.createWriteStream(filePath+'/'+next_id+'.wav'));

	    res.send('/voice/'+next_id + '.wav');
	    hash_table[sentence] = next_id;

	    console.log(hash_table);

	    next_id = randomstring.generate(36);
	    return;
	}

});

app.use('/voice', express.static(__dirname + '/voiceStore'));

app.listen(8001, '0.0.0.0', function(){
    console.log("starting server");
})
