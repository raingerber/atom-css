var _ = require('lodash');

var Emitter = require('atom').Emitter;

var FileWatcher = require('./file-watcher');

var FileSelection = require('./file-selection');

var normalizeTextRange = require('../utils/range-utils').normalizeTextRange;

function FileSearch(paths) {
  var emitter = new Emitter(); // keeps scope in the callbacks
  this.emitter = emitter;

  // moving this out of the function will break things
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

  emitter.on('onDidDelete', this.removeFile);
  FileWatcher.call(this, paths, callbacks);
}

function searchFiles(query, filterRules) {
  // console.log(arguments);
  function searchFile(file) {
    var rawMatches = file.map.search(query, filterRules);
    // console.log(file.map.css);
    // console.log(result);

    var matches = rawMatches.map(function(m) {
      // console.error(m.line);
      var data = normalizeTextRange(m.line, file.map.css);
      var fSel = new FileSelection(file.inputPath, data.range, data.text);
      return fSel;
    });

    return {
      file: file,
      matches: matches
    };
  }

  function filterResults(obj) {
    return obj.matches.length > 0;
  }

  var files = this.getFiles();
  // console.log(files);
  var matches =
    _(files)
      .map(searchFile)
      .filter(filterResults)
      .value();

  return matches;
}

FileSearch.prototype = Object.create(FileWatcher.prototype);
FileSearch.prototype.constructor = FileSearch;
FileSearch.prototype.searchFiles = searchFiles;

module.exports = FileSearch;
