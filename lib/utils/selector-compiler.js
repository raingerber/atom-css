var atomPointToSourcePoint = require('./points').atomPointToSourcePoint;

function getCompiledSelector(fileSearch, selection) {
  // console.dir(arguments);
  var path = selection.editor.getPath();
  if (typeof path !== 'string') {
    return [];
  }

  var file = fileSearch.getSourceFileByPath(path);
  if (!file) {
    return [];
  }

  var bufferRange = selection.getBufferRange(); // might need multiple lines
  // console.log(path,file,bufferRange);
  return getSelectorFromBuffer(file, bufferRange) || [];
}

function getSelectorFromBuffer(file, bufferRange) {
  if (!file) {
    return '';
  }

  var generatedPositions = getGeneratedPositions(file, bufferRange);
  if (!generatedPositions.length) {
    console.log('No generated pos!');
    return [];
  }

  var matches = getMatchingRules(file, generatedPositions);
  // console.log('LENG:', matches.length);
  // var firstMatch = matches[0]; // TEMPORARY, SHOULD BE LOOPING THROUGH THIS

  console.dir(matches);

  function mediaRule(match) {
    var data = match.rules.map(getSelectorFromMatch);
    // console.log(data);
    // window.m = match;
    var str = '<span style=\'background:green;\'>' + match.media + '</span><br />' + match.rules.map(getSelectorFromMatch);
    console.log(str);
    return str;
    // return {header: '', selector: ''};
  }

  function getSelectorFromMatch(match) {
    // console.dir(match)
    // console.log(match.type === 'rule');
    // console.log(createOutputString(match.selectors));
    var x =
      match.type === 'rule' && createOutputString(match.selectors)
      || match.type === 'media' && mediaRule(match)
      || '';

    // console.log(x);
    return x;
  }

  var compiledSelectors = matches.map(getSelectorFromMatch);
  console.dir(compiledSelectors);
  // var compiledSelector = createOutputString(firstMatch.selectors);
  // console.log(_.compact(compiledSelectors));
  return compiledSelectors;
}

function getGeneratedPositions(file, bufferRange) {
  var inputPath = '/' + file.getPath();
  var startPos = atomPointToSourcePoint(bufferRange.start, inputPath);
  // consumer, position
  // console.log(bufferRange.start, startPos);
  // console.dir(arguments);
  var generatedPositions = file.map.getGeneratedPositions(file.map.consumer, startPos);
  // console.dir(generatedPositions);
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
