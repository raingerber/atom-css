var onSelectorViewCompiled = function() {};

function updateCompiledSelectorView(selection) {
  var hasText = selectionHasText(selection);
  var compiledSelector = hasText ? getCompiledSelector(selection) : '';
  onSelectorViewCompiled(compiledSelector);
}

function selectionHasText(selection) {
  return selection && selection.getText();
}

function onSelectionChange(event) {
  try {
    updateCompiledSelectorView(event.selection);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function addSelectionListener(editor, callback) {
  typeof callback === 'function' && (onSelectorViewCompiled = callback);
  return editor.onDidChangeSelectionRange(onSelectionChange);
}

module.exports.addSelectionListener = addSelectionListener;
