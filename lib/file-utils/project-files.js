var _ = require('lodash');

var Emitter = require('atom').Emitter;

var FileWatcher = require('./file-watcher');

function ProjectFiles(paths) {
  this.emitter = new Emitter();
  var emitter = this.emitter;
  // console.dir(this);
  // console.log(this.emitter);
  FileWatcher.call(this, paths, {
    onDidChange: function() {
      emitter.emit('onDidChange', this.getPath());
      this.createMappings();
    },
    onDidRename: function() {
      emitter.emit('onDidRename', this.getPath());
      this.createMappings();
    },
    // THE LIST ITSELF SHOULD BE LISTENING FOR DELETE, INSTEAD OF THE FILES DOING IT
    onDidDelete: function() {
      emitter.emit('onDidDelete', this.getPath());
    }
  });

  this.emitter.on('onDidDelete', this.removeFile);
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
