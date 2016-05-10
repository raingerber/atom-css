// var normalizeTextRange = require('../file-utils/file-selection').normalizeTextRange;
var atomPointToSourcePoint = require('./points').atomPointToSourcePoint;
var createOutputString = require('./output-string');
var Highlights = require('../highlights/file-highlights');

var h;

function getCompiledSelector(fileSearch, selection) {

  if (fileSearch === false) {
    h && h.clear();
    h = null;
    return [];
  }

  console.dir(arguments);
  var path = selection.editor.getPath();
  if (typeof path !== 'string') {
    h && h.clear(), h = null;
    return [];
  }

  var file = fileSearch.getSourceFileByPath(path);

  if (!file) {
    h && h.clear(), h = null;
    return [];
  }

  var bufferRange = selection.getBufferRange(); // might need multiple lines
  // console.log(selection);
  // console.log(path, file, bufferRange);
  // var fSel = normalizeTextRange(bufferRange.start.line, file.map.rawCSS, file.inputPath);
  // console.log(fSel);
  var selectors = getSelectorFromBuffer(file, bufferRange) || [];
  // console.log(selectors);

  if (!selectors.length) {
    h && h.clear();
    h = null;
  }


  var searchFile = require('../file-utils/file-search').prototype.searchFile;
  // allow sourceType to be null (defaults to 'source')
  var matches = searchFile('source', file, selectors[0], null).matches;
  // console.log(matches);
  if (matches) {
    h = new Highlights(selection.editor, matches).populate(0);
  } else if (h) {
    h && h.clear();
    h = null;
  }
  // console.log(h);


  return selectors;
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

  // console.dir(matches);

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
  // console.dir(compiledSelectors);
  // var compiledSelector = createOutputString(firstMatch.selectors);
  // console.log(_.compact(compiledSelectors));
  return compiledSelectors;
}

function getGeneratedPositions(file, bufferRange) {
  var inputPath = '/' + file.getPath();
  var startPos = atomPointToSourcePoint(bufferRange.start, inputPath);
  // console.log(bufferRange.start, startPos);
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

module.exports.getCompiledSelector = getCompiledSelector;
