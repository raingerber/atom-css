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

  // in source (-1) format
  var generatedPositions = getGeneratedPositions(file, bufferRange);
  if (!generatedPositions.length) {
    console.log('No generated pos!');
    return [];
  }

  var matches = getMatchingRules(file, generatedPositions);

  console.dir(matches);

  // move the html to a separate view
  function mediaRule(match) {
    var data = match.rules.map(getSelectorFromMatch);
    // console.log(data);
    var str = '<span style=\'background:green;\'>' + match.media + '</span><br />' + match.rules.map(getSelectorFromMatch);
    console.log(str);
    return str;
    // return {header: '', selector: ''};
  }

  function getSelectorFromMatch(match) {
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
  console.log(bufferRange.start, startPos);
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
  // get all the rules on lines that are in the generated positions
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
