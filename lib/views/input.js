// Function = require('loophole').Function;
// var Hogan = require('hogan.js');

var Emitter = require('atom').Emitter;

var emitter = new Emitter();

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

buttons.querySelector('.search-source').addEventListener('click', function() {
  console.log('Search Source');
  emitter.emit('click:search-source', {
    text: editor.getText()
  });
});

buttons.querySelector('.search-output').addEventListener('click', function() {
  console.log('Search Output');
  emitter.emit('click:search-output', {
    text: editor.getText()
  });
});

// console.log(editor.element);
editor.setText('.bumper-header'); // temporary
editor.element.style.flex = 2 ; // temporary

var element = document.createElement('div');
element.classList.add('preprocessor-preview-search-input-bar');
element.appendChild(editor.element);
element.appendChild(buttons);

// console.log(buttons);

module.exports.editor = editor;
module.exports.element = element;
module.exports.emitter = emitter;
