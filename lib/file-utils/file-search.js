var _ = require('lodash');

var Emitter = require('atom').Emitter;
var FileWatcher = require('./file-watcher');
// var FileSelection = require('./file-selection');

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

// make it with fewer parameters
function searchFile(searchType, file, query, filterRules) {
  // console.log(file);
  var matchStartPositions = file.map.search(query, filterRules);
  // console.log(file.map);
  // console.log(matchStartPositions);
  var matches = matchStartPositions.map(function(pos) {
    // console.error();
    // var data = normalizeTextRange(pos.line, file.map.rawCSS);
    // console.log(data);
    // var fSel = new FileSelection(file.inputPath, data.range, data.text);
    // console.log(fSel);
    var fSel = normalizeTextRange(pos.line, file.map.rawCSS);
    return fSel;
  });

  return {
    file: file,
    matches: matches
  };
}


function searchFiles(searchType, query, filterRules) {
  // console.log(arguments);

  function searchFileProxy(file) { // closure with query and filterRules
    return searchFile(searchType, file, query, filterRules);
  }

  function filterResults(obj) {
    // console.log(obj);
    return obj.matches.length > 0;
  }

  var files = this.getFiles();

  // console.log(this);
  // console.log(files);

  var matches =
    _(files)
      .map(searchFileProxy)
      .filter(filterResults)
      .value();

  return matches;
}

FileSearch.prototype = Object.create(FileWatcher.prototype);
FileSearch.prototype.constructor = FileSearch;
FileSearch.prototype.searchFiles = searchFiles;

module.exports = FileSearch;
