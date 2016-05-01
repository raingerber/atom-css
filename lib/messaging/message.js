// var config = require('../config.js');
var messenger = require('messenger');
var Emitter = require('atom').Emitter;

var port = 8000;

var server = messenger.createListener(port);
var client = messenger.createSpeaker(port);

function FileMessage(port) {
  this.emitter = new Emitter();
  this.server = messenger.createListener(port);
  this.client = messenger.createSpeaker(port);
  this.addHandler();
  setTimeout(function() {
    this.getData();
  }, 1000);
}

FileMessage.prototype.addHandler = function addHandler() {
  if (!this.server) {
    return;
  }

  this.server.on('update', function(message, data) {
    this.addPaths(data);
    message.reply({});
  });
};

FileMessage.prototype.addPaths = function addPaths(data) {
  console.log(data);
};

FileMessage.prototype.getData = function getData() {
  this.client.request('get', {}, addPaths);
};



setTimeout(function() {
  getData();
}, 1000);

function addPaths(data) {
  console.log(data);
}

function getData() {
  client.request('get', {}, addPaths);
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
