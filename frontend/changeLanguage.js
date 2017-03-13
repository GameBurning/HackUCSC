var fs = require('fs');
var config = require('./app/config.json');
console.log("Setting language to : " + process.argv[2]);
config.language = process.argv[2];
fs.writeFile('./app/config.json', JSON.stringify(config, null, 4));
