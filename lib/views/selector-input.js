var MiniEditor = require('./mini-text-editor');

var config = {
  className: 'selector-input',
  placeholder: 'Selector...'
};

var editor = new MiniEditor(config.placeholder, config.className);

var buttons = document.createElement('div');
buttons.classList.add('block');
buttons.innerHTML = [ // use 'selected' class to make a button blue
  "<div class='btn-group'>",
    "<button class='btn search-source'>Search Source</button>",
    "<button class='btn search-output'>Search Output</button>",
  "</div>"
].join('');

// console.log(editor.element);
editor.setText('.bumper-header'); // temporary
editor.element.style.flex = 2 ; // temporary

var element = document.createElement('div');
element.classList.add('preprocessor-preview-search-input-bar');
element.appendChild(editor.element);
element.appendChild(buttons);

function addEventListeners(emitter) {
  addButtonListener(emitter, '.search-source', 'source');
  addButtonListener(emitter, '.search-output', 'output');
}

function addButtonListener(emitter, selector, searchType) {
  var button = getButton(selector);

  if (!button) {
    return false;
  }

  button.addEventListener('click', function onClickButton(event) {
    var forward = !event.shiftKey;
    outputSearchEvent(emitter, searchType, forward);
  });

  return true;
}

function getButton(selector) {
  return buttons.querySelector(selector);
}

function outputSearchEvent(emitter, searchType, forward) {
  emitter.emit('search', {
    // text: editor.getText(),
    type: searchType,
    forward: forward
  });
}

function focus() {
  editor.element.focus();
}

module.exports.editor = editor;
module.exports.element = element;
module.exports.addEventListeners = addEventListeners;
module.exports.focus = focus;
