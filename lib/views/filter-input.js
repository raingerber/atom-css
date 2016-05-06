var MiniEditor = require('./mini-text-editor');

var config = {
  className: 'filter-css-input',
  placeholder: 'CSS Filter Properties...'
};

var editor = new MiniEditor(config.placeholder, config.className);

// editor.setText('height: 12px;'); // TEMPORARY

module.exports.editor = editor;
module.exports.element = editor.element;
