var getCompiledSelector = require('./selector-compiler').getCompiledSelector;
var createOutputString = require('./output-string');

function updateCompiledSelectorView(fileSearch, selection, callback) {
  var hasText = selectionHasText(selection);
  // if (hasText) debugger;
  var compiledSelectors = hasText ? getCompiledSelector(fileSearch, selection) : [];
  // console.log('6666666');
  // console.log(hasText, selection.getText());
  // console.dir(compiledSelectors);
  callback(compiledSelectors);
}

function selectionHasText(selection) {
  // console.dir(selection);
  var hasText = !!selection && !!selection.getText && !!selection.getText();
  return hasText;
}

function onSelectionChange(event, fileSearch, callback) {
  // console.dir(arguments);
  try {
    updateCompiledSelectorView(fileSearch, event.selection, callback);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function addSelectionListener(editor, _files, _callback) {
  // console.dir(arguments);
  var f = typeof _callback === 'function';
  var callback = f ? _callback : function() {};
  return editor.onDidChangeSelectionRange(function onDidChangeSelectionRange(event) {
    onSelectionChange(event, _files, callback)
  });
}

// editor needs to be last because this goes into a partial
function addTextEditorObserver(editor, files, view) {
  var onSelectorUpdate = function onSelectorUpdate(compiledSelectors) {
    // console.dir(compiledSelectors);
    var x = createOutputString(compiledSelectors);
    view.text(x);
  };

  addSelectionListener(editor, files, onSelectorUpdate);
}

// can only be used once the way it's set up now
module.exports.addTextEditorObserver = addTextEditorObserver;
