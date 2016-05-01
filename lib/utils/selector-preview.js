var getCompiledSelector = require('./selector-compiler').getCompiledSelector;

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

// can only be used once the way it's set up now
module.exports.addSelectionListener = addSelectionListener;




function lastIndexOf(str, char) {
  return str.lastIndexOf(char);
}
