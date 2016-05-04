
// THIS NEEDS TO BE ABLE TO CHECK MULTIPLE LINES
function normalizeTextRange(bufferLine, text) {
  var len = text.length;
  text = text.replace(/^\s*/, ''); // remove leading whitespace --- does it need to check for linebreaks separately??
  var startColumn = len - text.length;
  text = text.replace(/\s*{?\s*$/, ''); // remove trailing whitespace + optional curly brace {
  var endColumn = startColumn + text.length;
  var range = makeNewRangeArray(bufferLine, startColumn, bufferLine, endColumn);
  return {
    range: range,
    text: text
  };
}

function normalizeTextRangez(bufferLine, bufferLineText) {
  var endColumn;
  var trimmed = '';
  var len = bufferLineText.length;
  // debugger;
  var lineText = bufferLineText.replace(/^\s*/, '');
  var startColumn = len - lineText.length;
  var offset = startColumn;
  var endLine = bufferLine;
  var text = lineText;

  var i = 0;

  while (true) {
    i++;
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
    if (i === 10) {
      console.error('NOT A GOOD');
      return;
    }
    i++;
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
