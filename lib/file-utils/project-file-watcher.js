var _ = require('lodash');
var FileWatcher = require('./file-watcher');

function ProjectFileWatcher(paths) {
  FileWatcher.call(this, paths, {
    onDidChange: function() {
      this.createMappings();
    },
    onDidRename: function() {
      this.createMappings();
    },
    // THE LIST ITSELF SHOULD BE LISTENING FOR DELETE, INSTEAD OF THE FILES DOING IT
    onDidDelete: function() {
      console.log('deleted');
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
ProjectFileWatcher.prototype = Object.create(FileWatcher.prototype);
ProjectFileWatcher.prototype.constructor = ProjectFileWatcher;
ProjectFileWatcher.prototype.searchFiles = searchFiles;

module.exports = ProjectFileWatcher;
