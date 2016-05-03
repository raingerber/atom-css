// var config = require('../config.js');
var messenger = require('messenger');
var Emitter = require('atom').Emitter;

function PortWatcher(port) {
  this.emitter = new Emitter();
  this.server = messenger.createListener(port);
  this.client = messenger.createSpeaker(port);
  this.addUpdateHandler();
  setTimeout(function() {
    this.getInitialData();
  }, 1000);
}

PortWatcher.prototype.addUpdateHandler = function addUpdateHandler() {
  if (!this.server) {
    return;
  }

  this.server.on('update', function(message, data) {
    this.addPaths(data);
    message.reply({});
  });
};

PortWatcher.prototype.getInitialData = function getInitialData() {
  var options = {};
  this.client.request('get', options, addPaths);
};

PortWatcher.prototype.addPaths = function addFiles(fileData) {
  var newFileData = _.filter(fileData, function(datum) {
    return !pathIsBeingWatched(datum.path);
  });

  this.files = this.updateExistingFiles();
  this.files = this.files.concat(newFiles);

  emitter.emit('update', data);
};

// PortWatcher.prototype.removeUpdateHandler = function removeUpdateHandler() {};

function getFileByPath(fileData, path) {
  return _.find(fileData, function fileHasPath(datum) {
    return datum.path === path;
  });
}

function pathIsBeingWatched(path) {
  return _.includes(this.paths, path);
}

function updateExistingFiles(fileData) {
  return _.reduce(this.files, function(arr, file) {
    var path = file.path, newFile;
    if (newFile = getFileByPath(fileData, path)) {
      updateFile(this.files, newFile);
      arr.push(newFile);
    }
    else if (pathIsBeingWatched(path)) {
      arr.push(newFile);
    }
    else {
      removeFile(this.files, file);
    }

    return arr;
  },
  []);
}

function updateFile() {
  var changed = updatePaths(newFile.inputPath, newFile.outputPath)

  if (newFile.map) {
    file.map.updateMappings(newFile.css, newFile.map);
  }
  else if (changed) {
    file.map.render();
  }
}

function updatePaths(current, newInput, newOutput) {
  var changed = false;
  if (current.inputPath !== newInput) {
    current.inputPath = newInput
    changed = true;
  }

  if (current.outputPath !== newOutput) {
    current.outputPath = newOutput;
    changed = true;
    // delete temp file
  }

  return changed;
}

module.exports.PortWatcher = PortWatcher;
