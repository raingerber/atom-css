var _ = require('lodash');

var Emitter = require('atom').Emitter;

var FileWatcher = require('./file-watcher');

function ProjectFiles(paths) {
  var emitter = new Emitter(); // keeps scope in the callbacks
  emitter.on('onDidDelete', this.removeFile);
  this.emitter = emitter;

  FileWatcher.call(this, paths, {
    onDidChange: function onDidChange() {
      emitter.emit('onDidChange', this.getPath());
      this.createMappings();
    },
    onDidRename: function onDidRename() {
      // TEST IF THIS WORKS (should, but might need to update some other properties?)
      emitter.emit('onDidRename', this.getPath());
      this.createMappings();
    },
    onDidDelete: function onDidDelete() {
      emitter.emit('onDidDelete', this.getPath());
    }
  });
}

function searchFiles(query, filterRules) {

  function searchFile(file) {
    return {
      file: file,
      matches: file.map.search(query, filterRules)
    };
  }

  function filterResults(obj) {
    return obj.matches.length > 0;
  }

  var files = this.getFiles();

  return _(files)
    .map(searchFile)
    .filter(filterResults)
    .value();
}

// remove 'watcher' from name - it also searches, so it's more generic
ProjectFiles.prototype = Object.create(FileWatcher.prototype);
ProjectFiles.prototype.constructor = ProjectFiles;
ProjectFiles.prototype.searchFiles = searchFiles;

module.exports = ProjectFiles;
