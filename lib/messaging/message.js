
// var config = require('../config.js');

var messenger = require('messenger');

var server = messenger.createListener(8000);

server.on('update', function(message, data) {
  addPaths(data);
  message.reply({});
});

var client = messenger.createSpeaker(8000);

setTimeout(function() {
  client.request('give it to me', { /* data */ }, addPaths);
}, 1000);

function addPaths(data) {
  console.log(data);
}



// maybe, if no output path is given, it can default to a temporary folder
// var paths = [
//   {
//     "inputPath": {
//       "<string>";
//     },
//     "outputPath": "<string>"
//     "content": "<string>", // optional
//     "sourcemap": { // optional
//       "path": "<string>",
//       "content": "<string>" // optional
//     }
//   }
// ];
