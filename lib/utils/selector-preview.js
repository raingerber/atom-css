var getCompiledSelector = require('./selector-compiler').getCompiledSelector;

function updateCompiledSelectorView(fileSearch, selection, callback) {
  var hasText = selectionHasText(selection);
  var compiledSelector = hasText ? getCompiledSelector(fileSearch, selection) : '';
  callback(compiledSelector);
}

function selectionHasText(selection) {
  // console.dir(selection);
  // var get = _.get(arguments, '[0]');
  return selection && selection.getText && selection.getText() || '';
}

function onSelectionChange(event, fileSearch, callback) {
  console.dir(arguments);
  try {
    updateCompiledSelectorView(fileSearch, event.selection, callback);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function addSelectionListener(editor, _files, _callback) {
  // console.dir(arguments);
  var callback = typeof _callback === 'function' ? _callback : function() {};
  return editor.onDidChangeSelectionRange(function onDidChangeSelectionRange(event) {
    onSelectionChange(event, _files, callback)
  });
}

// can only be used once the way it's set up now
module.exports.addSelectionListener = addSelectionListener;
