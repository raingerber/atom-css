
var p = require('../utils/points');

var Point = require('atom').Point;
var Range = require('atom').Range;

function FileSelection(path, range, css) {
  this.path = path;
  this.range = range;

  var r = new Range(new Point(range[0][0], range[0][1]), new Point(range[1][0], range[1][1]));
  this.__range = r;

  this.text = css;
  this.source = '';
  // this.rawCSS = '';
}

FileSelection.prototype.get = getCoordinate;

function getCoordinate(headOrTail, rowOrColumn) {
  var a = getPos(this.__range, ['start', 'end'], headOrTail);

  if (!a) {
    return false;
  }

  var b = getPos(a, ['row', 'column'], rowOrColumn);

  return b;
}

function getPos(source, validKeys, key) {
  if (!source || !_.includes(validKeys, key)) {
    return false;
  }

  var value = source[key];

  return value;
}

// var fSel = normalizeTextRange(_match.range[0][0], match.file.map.rawCSS, path);
// THIS NEEDS TO BE ABLE TO CHECK MULTIPLE LINES
function normalizeTextRange(bufferLine, css, path) {
  var line = p.sourceLineToAtomLine(bufferLine);
  var arrayOfLines = css.split(/\r?\n/)
  var text = arrayOfLines[line];

  var len = text.length;
  text = text.replace(/^\s*/, ''); // remove leading whitespace --- does it need to check for linebreaks separately??
  var startColumn = len - text.length;
  text = text.replace(/\s*{?\s*$/, ''); // remove trailing whitespace + optional curly brace {
  var endColumn = startColumn + text.length;

  var a = new Point(bufferLine, startColumn);
  var b = new Point(bufferLine, endColumn);
  var range = new Range(a, b);

  return {
    range: range,
    text: text
  };

  var fSel = new FileSelection(path, range, text);

}

function trimStart() {

}

function trimEnd() {

}

module.exports.normalizeTextRange = normalizeTextRange;
