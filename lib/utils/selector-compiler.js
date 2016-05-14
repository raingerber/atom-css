// var normalizeTextRange = require('../file-utils/file-selection').normalizeTextRange;
var atomPointToSourcePoint = require('./points').atomPointToSourcePoint;
var searchFile = require('../file-utils/file-search').prototype.searchFile;
var createOutputString = require('./output-string');
var Highlights = require('../highlights/file-highlights');

var currentHighlights;

var ENTER_KEY = 13;

function onKeyDownGetter(emitter, matches) {
  return function onKeyDown(event) {
    if (event.which === ENTER_KEY) {
      // event.preventDefault();
      event.stopPropagation();
      if (!matches) {
        debugger;
      }

      emitter.emit('prefill-search-input', matches[0].text);
      // console.error('prefill');
    }
  };
}

function clearHighlights(highlights) {
  highlights && highlights.clear();
  highlights = null;
}

var el;
var onKeyDownCb = function() {};

function selectionHasText(selection) {
  // console.dir(selection);
  var hasText = !!selection && !!selection.getText && !!selection.getText();
  return hasText;
}

function defaultReturn() {
  clearHighlights(currentHighlights);
  return [];
}

function getCompiledSelector(file, emitter, selection) {

  if (!file || !selectionHasText(selection)) {
    return defaultReturn();
  }

  var editor = selection.editor;
  var bufferRange = selection.getBufferRange(); // might need multiple lines
  var selectors = getSelectorFromBuffer(file, bufferRange) || [];
  // console.log(selectors);

  if (!selectors.length) {
    return defaultReturn();
  }

  // allow sourceType to be null (defaults to 'source')
  var matches = searchFile('source', file, selectors[0], null).matches; // TODO: use selectors instead of selectors[0] ?
  updateCurrentHighlights(editor, emitter, matches);
  return selectors;
}

function updateCurrentHighlights(editor, emitter, matches) {
  removeCurrentHighlights();
  if (!matches) {
    return currentHighlights = null;
  }

  el = atom.views.getView(editor);
  onKeyDownCb = onKeyDownGetter(emitter, matches);
  el.addEventListener('keydown', onKeyDownCb);

  // null means don't focus on a particular highlight
  currentHighlights = new Highlights(editor, matches).populate(null);

  rm();
  rm = function rm() {
    emitter.off('core:cancel', removeCurrentHighlights);
  };

  emitter.on('core:cancel', removeCurrentHighlights);
  return currentHighlights;
}

var rm = function() {};

function removeCurrentHighlights() {
  console.log('clearing highlights');
  rm();
  el && el.removeEventListener('keydown', onKeyDownCb);
  clearHighlights(currentHighlights);
}

function getSelectorFromBuffer(file, bufferRange) {
  if (!file) {
    return '';
  }

  // in source (-1) format
  var generatedPositions = getGeneratedPositions(file, bufferRange);
  if (!generatedPositions.length) {
    // console.log('No generated pos!');
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
  var generatedPositions = file.map.getGeneratedPositions(file.map.consumer, startPos);
  return generatedPositions;
}

function getMatchingRules(file, generatedPositions) {
  var numbers = _.map(generatedPositions, 'line'); // column also?
  // get all the rules on lines that are in the generated positions
  return file.map.rules.filter(function(rule) {
    return numbers.indexOf(rule.position.start.line) > -1;
  });
}

module.exports.getCompiledSelector = getCompiledSelector;
