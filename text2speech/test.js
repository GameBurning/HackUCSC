var fs = require('fs');
var cors = require('cors')
var _ = require('lodash');
var request = require('request');
var urlencode = require('urlencode');
var randomWords = require('random-words');

for (var i = 0; i < 10; i++) {
    let query_sentence = randomWords(8).join(' ');
    request('http://localhost:8001/speak?language=zh-CN&sentence=' + query_sentence, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}
/*
let query_sentence = randomWords(8).join(' ');
request('http://localhost:8001/speak?language=zh-CN&sentence=' + query_sentence, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    let query_sentence = randomWords(8).join(' ');
    request('http://localhost:8001/speak?language=zh-CN&sentence=' + query_sentence, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
});
*/