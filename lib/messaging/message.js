// var config = require('../config.js');
var messenger = require('messenger');
var Emitter = require('atom').Emitter;

function FileMessage(port) {
  this.emitter = new Emitter();
  this.server = messenger.createListener(port);
  this.client = messenger.createSpeaker(port);
  this.addUpdateHandler();
  setTimeout(function() {
    this.getInitialData();
  }, 1000);
}

FileMessage.prototype.addUpdateHandler = function addUpdateHandler() {
  if (!this.server) {
    return;
  }

  // emitter.emit('onDidChange');
  // emitter.emit('onDidRename');
  // emitter.emit('onDidDelete');

  this.server.on('update', function(message, data) {
    this.addPaths(data);
    message.reply({});
  });

};

/*

list of files that were in the old one, but not in this one
list of files that are in this one, but not in the old one
list of files that are the same
 */


function getFileByPath(files, path) {
  return _.find(files, function fileHasPath(file) {
    return file.path === path;
  });
}

function pathIsBeingWatched(path) {
  return _.includes(this.paths, path);
}

function addFiles(newFiles) {
  _.forEach(this.files, function(file, index, files) {
    var newFile;
    var path = file.path;
    if (newFile = getFileByPath(newFiles, path)) {
      updateFile(this.files, newFile);
    }
    else if (!pathIsBeingWatched(path)) {
      removeFile(this.files, file);
    }
  });
}

// this.inputPath = inputPath || this.getPath();
// this.outputPath = outputPath || this.getOutputPath(inputPath);
// this.map = new StyleMap(this.inputPath, this.outputPath);

function updateFile() {
  var current;

  if (current.inputPath !== newFile.inputPath) {
    current.inputPath = newFile.inputPath;
  }

  if (current.outputPath !== newFile.outputPath) {
    current.outputPath = newFile.outputPath;
    // delete temp file
  }

  if (newFile.map) {
    // overwrite the old sourcemap
  } else {
    // recompile sourcemap with the new paths
  }
}

FileMessage.prototype.removeUpdateHandler = function removeUpdateHandler() {};

FileMessage.prototype.addPaths = function addPaths(data) {
  console.log(data);
  emitter.emit('update', data);
  // clear existing data and overwrite existing SourceFiles
};

FileMessage.prototype.getInitialData = function getInitialData() {
  this.client.request('get', {}, addPaths);
};

module.exports.FileMessage = FileMessage;

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
