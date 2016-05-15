var MiniEditor = require('./mini-text-editor');

var config = {
  className: 'path-input',
  placeholder: 'New Path...'
};

var editor = new MiniEditor(config.placeholder, config.className);

function toggle(show) {
  editor.element.classList.toggle('hidden', !show);
}

module.exports.editor = editor;
module.exports.element = editor.element;
module.exports.toggle = toggle;
