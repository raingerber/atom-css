var searchFile = require('../file-utils/file-search').prototype.searchFile; // expose prototype functions on the exports object
var getCompiledSelector = require('./selector-compiler').getCompiledSelector;
var createOutputString = require('./output-string');

// getCompiledSelector should take file as the parameter, not fileSearch
// then addSelectorHighlights will have access to the correct file

function updateCompiledSelectorView(fileSearch, emitter, selection, callback) {
  var editor = selection.editor;

  // console.dir(arguments);
  var path = selection.editor.getPath();

  // if (typeof path !== 'string') {
  //   return defaultReturn();
  // }

  var file = fileSearch.getSourceFileByPath(path);

  // if (!file) {
  //   return defaultReturn();
  // }

  var compiledSelectors = getCompiledSelector(file, emitter, selection);
  callback(compiledSelectors);
}

// addSelectorHighlights(selection.editor, file, compiledSelectors);
//
// function addSelectorHighlights(editor, file, selectors) {
//   if (!selectors.length) {
//     return defaultReturn();
//   }
//   // allow sourceType to be null (defaults to 'source')
//   var matches = searchFile('source', file, selectors[0], null).matches;
//
//   if (matches) {
//     h = new Highlights(editor, matches).populate(0);
//   } else if (h) {
//     clearHighlights(h);
//   }
//   // console.log(h);
// }

function selectionHasText(selection) {
  // console.dir(selection);
  var hasText = !!selection && !!selection.getText && !!selection.getText();
  return hasText;
}

function onSelectionChange(event, emitter, fileSearch, callback) {
  // console.error(arguments);
  try {
    updateCompiledSelectorView(fileSearch, emitter, event.selection, callback);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function addSelectionListener(editor, emitter, _files, _callback) {
  // console.dir(arguments);
  var f = typeof _callback === 'function';
  var callback = f ? _callback : function() {};
  return editor.onDidChangeSelectionRange(function onDidChangeSelectionRange(event) {
    onSelectionChange(event, emitter, _files, callback)
  });
}

// editor needs to be last because this goes into a partial
function addTextEditorObserver(editor, emitter, files, view) {
  // console.log(arguments);
  var onSelectorUpdate = function onSelectorUpdate(compiledSelectors) {
    // console.dir(compiledSelectors);
    var str = createOutputString(compiledSelectors);
    view.innerHTML = str;
  };

  addSelectionListener(editor, emitter, files, onSelectorUpdate);
}

// can only be used once the way it's set up now
module.exports.addTextEditorObserver = addTextEditorObserver;
