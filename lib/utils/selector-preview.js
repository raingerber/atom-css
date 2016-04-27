var getCompiledSelector = require('./selector-compiler').getCompiledSelector;

function updateCompiledSelectorView(selection, callback) {
  var hasText = selectionHasText(selection);
  var compiledSelector = hasText ? getCompiledSelector(selection) : '';
  callback(compiledSelector);
}

function selectionHasText(selection) {
  return selection && selection.getText();
}

function onSelectionChange(event, callback) {
  try {
    updateCompiledSelectorView(event.selection, callback);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function addSelectionListener(editor, _callback) {
  var callback = typeof _callback === 'function' ? _callback : function() {};
  return editor.onDidChangeSelectionRange(function onDidChangeSelectionRange(event) {
    onSelectionChange(event, callback)
  });
}

// can only be used once the way it's set up now
module.exports.addSelectionListener = addSelectionListener;
