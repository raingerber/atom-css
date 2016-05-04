var _ = require('lodash');

var Emitter = require('atom').Emitter;

var FileWatcher = require('./file-watcher');

var callbacks = {
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
};

function FileSearch(paths) {
  var emitter = new Emitter(); // keeps scope in the callbacks
  emitter.on('onDidDelete', this.removeFile);
  this.emitter = emitter;
  FileWatcher.call(this, paths, callbacks);
}

function searchFiles(query, filterRules) {

  // console.log(arguments);

  function searchFile(file) {
    // console.log(file.map.search(query, filterRules));
    return {
      file: file,
      matches: file.map.search(query, filterRules)
    };
  }

  function filterResults(obj) {
    return obj.matches.length > 0;
  }

  var files = this.getFiles();
  // console.log(files);
  return _(files)
    .map(searchFile)
    .filter(filterResults)
    .value();
}

FileSearch.prototype = Object.create(FileWatcher.prototype);
FileSearch.prototype.constructor = FileSearch;
FileSearch.prototype.searchFiles = searchFiles;

module.exports = FileSearch;
