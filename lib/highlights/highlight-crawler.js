
var Point = require('../utils/points');
var Highlights = require('./file-highlights');

function getHighlights(editor, matchSelections, startIndex) {
  // console.log(arguments);
  var highlights = new Highlights(editor, matchSelections);
  highlights.populate(startIndex);
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
  // console.log('HIGHLIGHT MATCH')
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

  console.log(n);

  // console.log('HIGHLIGHT MATCH')
  this.highlightMatch(i, n, this.callback);

  // console.log('>>>>', i, n);
};

HighlightCrawler.prototype.highlightMatch = function highlightMatch(fileIndex, matchIndex, callback) {
  // debugger;
  // console.log(arguments);
  if (matchIndex < 0) {
    return false;
  }

  this.setIndex(fileIndex);
  var match = this.matches[fileIndex];
  // console.log(fileIndex, match);

  if (match) {
    this.openEditorWithHighlights(match.file, match.matches, matchIndex, callback);
  } else {
    console.log('No matches found!');
  }

};

HighlightCrawler.prototype.openEditorWithHighlights = function openEditorWithHighlights(file, matches, matchIndex, callback) {
  if (matchIndex < 0) {
    // debugger;
  }
  // console.log(arguments);
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
  // this.highlights.getLength()
  var p = this.highlights.prev();
  // console.log(p);
  if (!p || this.matches.length <= 1) { // or if nothing changed
    console.log('Nothing changed');
    return;
  }

  var max = this.highlights.selections.length - 1;
  max = Math.max(0, max);
  // var matches = this.matches[index].matches;
  // console.log('this.highlights.selections.length: ' + this.highlights.selections.length, 'max:', max);
  // var current = this.highlights.currentHighlight();
  var indexData = this.getNewIndex(-1, 0, max, true);
  var index = indexData.newIndex;
  this.highlights.clear();
  // console.log(indexData, this.matches[index].matches.length - 1);
  this.setIndex(index);
  // console.log('HIGHLIGHT MATCH')
  max = this.matches[index].matches.length - 1,
  max = Math.max(0, max);
  this.highlightMatch(this.getIndex(), max, this.callback);
};

HighlightCrawler.prototype.next = function next() {
  // console.error('NEXT');
  if (this.highlights.next() && this.matches.length > 1) { // if it overflowed
    // console.error('NEXT');
    var indexData = this.getNewIndex(1, 0, this.matches.length - 1, true);
    this.highlights.clear();
    this.setIndex(indexData.newIndex);
    // console.log('HIGHLIGHT MATCH')
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
