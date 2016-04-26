var MiniEditor = require('./mini-text-editor');

var config = {
  className: 'selector-input',
  placeholder: 'Selector...'
};

var editor = new MiniEditor(config.placeholder, config.className);

editor.setText('.bumper-header'); // TEMPORARY

module.exports = editor;
