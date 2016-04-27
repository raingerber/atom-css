
// THIS NEEDS TO BE ABLE TO CHECK MULTIPLE LINES
function normalizeTextRange(bufferLine, text) {
  var len = text.length;
  text = text.replace(/^\s*/, ''); // remove leading whitespace --- does it need to check for linebreaks separately??
  var startColumn = len - text.length;
  text = text.replace(/\s*{?\s*$/, ''); // remove trailing whitespace + optional curly brace {
  var endColumn = startColumn + text.length;
  var range = makeNewRangeArray(bufferLine, startColumn, endColumn);
  return {
    range: range,
    text: text
  };
}

// use Point class?
function makeNewRangeArray(bufferLine, startColumn, endColumn) {
  var startPoint = [bufferLine, startColumn];
  var endPoint = [bufferLine, endColumn];
  var range = [startPoint, endPoint];
  return range;
}

module.exports.normalizeTextRange = normalizeTextRange;
