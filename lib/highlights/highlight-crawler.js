
var Point = require('../utils/points');
var Highlights = require('./file-highlights');
var normalizeTextRange = require('../file-utils/file-selection').normalizeTextRange;

// function Selections() {
//   this.file = file // SourceFile
//   this.selections = []; // fill with FileSections
// }

function getHighlights(editor, matches, startIndex) {
  // console.log(matches);
  // var matchData = matches.map(function(match) {
  //   return getMatchData(editor, match);
  // });

  // var matchData = matches.map(function(match) {
  //   return getMatchData(editor, match);
  // });

  // console.error('APPLE-APPLE-APPLE-APPLE');
  // console.error(matchData);
  var highlights = new Highlights(editor, matches);
  // console.log(highlights);
  highlights.populate(startIndex);
  return highlights;
  // return new Highlights(editor, matches);
}

// function getMatchData(match) {
//   console.log(match);
//   var file = match.file;
//   var arrayOfLines = match.file.map.rawCSS.match(/[^\r\n]+/g);
//   var matchSelections = match.matches.map(function(_match) {
//     // console.log(_match);
//     // _match.get('start', 'row')
//     // _match.range[0][0]
//     // console.log(_match.range[0][0], _match.get('start', 'row'));
//     var path = file.inputPath;
//     console.log(_match); //range[0][0]
//     var fSel = normalizeTextRange(_match.range.start.row, file.map.rawCSS, path); // this should return FileSelection
//     // console.log(fSel);
//     return fSel;
//   });
//
//   // console.log(matchSelections);
//
//   return matchSelections;
// }

// returns a promisee
function openTextEditor(uri, initialPoint) {
  var uri = '/' + uri; // WHY IS THIS HERE????????
  return atom.workspace.open(uri, {
    searchAllPanes: true
    , pending: true
  });
}

////////////////////////////////////////////////////////////////////////////////

function HighlightCrawler(matches, callback) {
  // console.dir(matches);
  this.setIndex(0);
  this.highlights = null;
  // this.matches = matches;

  this.matches = matches.map(function(match) {
    // console.log(match);
    return {
      file: match.file,
      matches: match.matches//getMatchData(match)
    };
  });

  // console.log(this.matches);
  this.callback = callback || function() {}; // rename to highlightCallback or something
  this.highlightCurrentFile(0, this.callback);
}

HighlightCrawler.prototype.destroy = function destroy() {
  !!this.highlights && this.highlights.clear();
  // needs to close any windows that were opened and not used
};

HighlightCrawler.prototype.highlightCurrentFile = function highlightCurrentFile(startIndex, callback) {
  if (!this.matches.length) {
    return false;
  }

  var index = this.getIndex();
  var data = this.matches[index];

  // console.log(this.matches);
  // console.log(index, data);
  if (data) {
    this.highlightMatches(data.file, data.matches, startIndex, callback);
  } else {
    console.log('No matches found!');
  }
};

HighlightCrawler.prototype.highlightMatches = function highlightMatches(file, matches, startIndex, callback) {
  // console.log(file.getPath());
  var _this = this;
  var path = file.getPath();
  openTextEditor(path, null).then(function(editor) {
    _this.highlights = getHighlights(editor, matches, startIndex);
    if (typeof callback === 'function') {
      callback();
    }
  });
};

HighlightCrawler.prototype.setCurrentMatch = function setCurrentMatch(path, point) {
  // console.log(arguments);
  var i = _.findKey(this.matches, function(match) {
    // console.log(match);
    return match.file.getPath() === path;
  });

  var m = this.matches[i];

  // console.error('i:', i);

  if (!m || !m.matches) {
    return false;
  }

  // console.error(m);

  var n = _.findKey(m.matches, function(match) {
    var a = match.get('start', 'row');
    var b = match.get('start', 'column');
    // console.log(a, point.row, b, point.column);
    return a === point.row && b === point.column;
  });

  if (!Number.isFinite(n * 1)) {
    console.log('Key not found:', n);
    return false;
  }

  var m2 = m.matches[n];

  console.error('i:', i + ', n:', n);

  if (!m2) {
    return false;
  }

  this.setIndex(i);

  this.highlightCurrentFile(n, this.callback);

  // console.log('>>>>', i, n);
};

HighlightCrawler.prototype.prev = function prev() {
  if (!this.highlights.prev() && this.matches.length > 1) {
    // go to previous file
    var indexData = this.getNewIndex(-1, 0, this.highlights.getLength() - 1, true);
    var index = this.getIndex();
    this.setIndex(indexData.newIndex);
  } else {
    // console.log('>>>>>>>>>>>>>>>>>> PREV ELSE');
  }
};

HighlightCrawler.prototype.next = function next() {
  // console.log(this.highlights);
  if (this.highlights.next()) { // if it overflowed
    var indexData = this.getNewIndex(1, 0, this.matches.length - 1, true);
    this.highlights.clear();
    this.setIndex(indexData.newIndex);
    this.highlightCurrentFile(0, this.callback);
  } else {
    // console.log('>>>>>>>>>>>>>>>>>> NEXT ELSE');
  }
};

HighlightCrawler.prototype.currentHighlight = function currentHighlight() {
  var highlight = this.highlights.currentHighlight();
  return highlight;
};

HighlightCrawler.prototype.clear = function clear() {
  if (this.highlights) {
    this.highlights.clear();
  }
};

require('./iterator').addIteratorMethods(HighlightCrawler.prototype);

module.exports = HighlightCrawler;
