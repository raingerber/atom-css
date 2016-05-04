
// THIS NEEDS TO BE ABLE TO CHECK MULTIPLE LINES
function normalizeTextRangez(bufferLine, text) {
  var len = text.length;
  text = text.replace(/^\s*/, ''); // remove leading whitespace --- does it need to check for linebreaks separately??
  var startColumn = len - text.length;
  text = text.replace(/\s*{?\s*$/, ''); // remove trailing whitespace + optional curly brace {
  var endColumn = startColumn + text.length;
  var range = makeNewRangeArray(startLine, startColumn, endLine, endColumn);
  return {
    range: range,
    text: text
  };
}

function normalizeTextRange(bufferLine, bufferLineText) {
  var endColumn;
  var trimmed = '';
  var len = bufferLineText.length;
  // debugger;
  var lineText = bufferLineText.replace(/^\s*/, '');
  var startColumn = len - lineText.length;
  var offset = startColumn;
  var endLine = bufferLine;
  var text = lineText;

  while (true) {
    endColumn = lineText.indexOf('{');
    if (endColumn === -1) {
      text += lineText;
    }
    else {
      trimmed = lineText.replace(/\s*{?\s*$/, ''); // why is { optional here?
      endColumn = offset + trimmed.length;
      text += trimmed;
      break;
    }

    offset = 0;
    lineText = getLineText(++endLine);
  }

  var range = makeNewRangeArray(bufferLine, startColumn, endLine, endColumn);

  console.error({
    range: range,
    text: text
  });

  return {
    range: range,
    text: text
  };

}

function getLineText(num) {
  return '';
}


// use Point class?
function makeNewRangeArray(startLine, startColumn, endLine, endColumn) {
  var startPoint = [startLine, startColumn];
  var endPoint = [endLine, endColumn];
  var range = [startPoint, endPoint];
  return range;
}

module.exports.normalizeTextRange = normalizeTextRange;
