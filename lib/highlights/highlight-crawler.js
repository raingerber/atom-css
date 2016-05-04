
var Point = require('../utils/points');
var Highlights = require('./file-highlights');
var normalizeTextRange = require('../utils/range-utils').normalizeTextRange;

function getHighlights(editor, matches) {
  var matchData = matches.map(_.partial(getMatchData, editor));
  return new Highlights(editor, matchData);
}

function getMatchData(editor, match) {
  var line = Point.sourceLineToAtomLine(match.line);
  var text = editor.lineTextForBufferRow(line) || '';
  var rangeData = normalizeTextRange(line, text);
  return rangeData;
}

// returns a promisee
function openTextEditor(uri, initialPoint) {
  var uri = '/' + uri; // WHY IS THIS HERE????????
  return atom.workspace.open(uri, {
    searchAllPanes: true
  });
}

////////////////////////////////////////////////////////////////////////////////

function HighlightCrawler(matches, callback) {
  // console.dir(matches);
  this.setIndex(0);
  this.highlights = null;
  this.matches = matches;
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
    console.error('it has been opened');
    _this.highlights = getHighlights(editor, matches).populate(startIndex);
    if (typeof callback === 'function') {
      callback();
    }
  });
};

HighlightCrawler.prototype.setCurrentMatch = function setCurrentMatch(path, line, column) {
  var i = _.findKey(this.matches, function(match) {
    return match.file.getPath() === path;
  });

  var m = this.matches[i];

  console.error(i);

  if (!m || !m.matches) {
    return false;
  }

  var n = _.findKey(m.matches, function(match) {
    return match.line === line && match.column === column;
  });

  var m2 = m.matches[n];

  console.error('n', n);

  if (!m2) {
    return false;
  }

  this.setIndex(i);

  this.highlightCurrentFile(n, this.callback);

  console.log('>>>>', i, n);
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
