var atomPointToSourcePoint = require('./points').atomPointToSourcePoint;

function getCompiledSelector(file, bufferRange) {
  if (!file) { // TEMPORARY
    return '';
  }

  var generatedPositions = getGeneratedPositions(file, bufferRange);
  if (!generatedPositions.length) {
    console.log('No generated pos!');
    return '';
  }
  var matches = getMatchingRules(file, generatedPositions);
  // console.log('LENG:', matches.length);
  var firstMatch = matches[0]; // TEMPORARY
  // console.dir(firstMatch);
  var compiledSelector = createOutputString(firstMatch.selectors);
  // console.log(compiledSelector);
  return compiledSelector || '';
}

function getGeneratedPositions(file, bufferRange) {
  var inputPath = '/' + file.getPath();
  var startPos = atomPointToSourcePoint(bufferRange.start, inputPath);
  var generatedPositions = file.map.getGeneratedPositions(startPos);
  return generatedPositions;
}

function getMatchingRules(file, generatedPositions) {
  var numbers = _.map(generatedPositions, 'line');
  // var numbers = generatedPositions.map(_.property('line')); // column also?
  // console.log(numbers);
  return file.map.rules.filter(function(rule) {
    return numbers.indexOf(rule.position.start.line) > -1;
  });
}

function createOutputString(lines) {
  if (!lines.length) {
    return '';
  }

  if (lines.length === 1) {
    return lines[0];
  }

  return lines.join('<br />');
}

module.exports.getCompiledSelector = getCompiledSelector;
