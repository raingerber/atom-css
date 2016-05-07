
var Point = require('../utils/points');
var Highlights = require('./file-highlights');
var normalizeTextRange = require('../file-utils/file-selection').normalizeTextRange;

function getHighlights(editor, matchSelections, startIndex) {
  console.log(arguments);
  var highlights = new Highlights(editor, matchSelections);
  highlights.populate(startIndex * 1);
  return highlights;
}

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
      matches: match.matches
    };
  });

  // console.log(this.matches);
  this.callback = callback || function() {}; // rename to highlightCallback or something
  this.highlightMatch(0, 0, this.callback);
}

HighlightCrawler.prototype.destroy = function destroy() {
  !!this.highlights && this.highlights.clear();
  // needs to close any windows that were opened and not used
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

  // console.log(n);

  this.highlightMatch(i, n, this.callback);

  // console.log('>>>>', i, n);
};

HighlightCrawler.prototype.highlightMatch = function highlightMatch(index, matchIndex, callback) {
  this.setIndex(index);
  var match = this.matches[index];

  if (match) {
    this.openEditorWithHighlights(match.file, match.matches, matchIndex, callback);
  } else {
    console.log('No matches found!');
  }

};

HighlightCrawler.prototype.openEditorWithHighlights = function openEditorWithHighlights(file, matches, matchIndex, callback) {
  // console.log(file.getPath());
  var _this = this;
  var path = file.getPath();
  openTextEditor(path, null).then(function(editor) {
    _this.highlights = getHighlights(editor, matches, matchIndex);
    if (typeof callback === 'function') {
      callback();
    }
  });
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
    // var x = indexData.newIndex;
    this.setIndex(indexData.newIndex);
    this.highlightMatch(this.getIndex(), 0, this.callback);
  } else {
    // console.log('>>>>>>>>>>>>>>>>>> NEXT ELSE');
  }
};

HighlightCrawler.prototype.clear = function clear() {
  this.highlights && this.highlights.clear();
};

require('./iterator').addIteratorMethods(HighlightCrawler.prototype);

module.exports = HighlightCrawler;
