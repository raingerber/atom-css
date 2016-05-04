var _ = require('lodash');

var _display = require('./display');
var _selectorInput = require('./input');
var _filterInput = require('./filter-input');
var _matchList = require('./match-list');

var emitter = new (require('atom').Emitter)();

var bottomPanel;
var leftPanel;

var element = document.createElement('div');

element.appendChild(_selectorInput.element);
element.appendChild(_filterInput.element);
element.appendChild(_display.element);

atom.commands.add('atom-text-editor', {
  'atom-stylus:esc': function(event) {
    console.error('PISTACHIO');
    var editor;
    editor = this.getModel();
    return editor.insertText(new Date().toLocaleString());
  }
});

function addHandlers() {
  console.error('ADDING');
  element.addEventListener('keyup', onKeyUp);
  document.addEventListener('keyup', onKeyUpDocument);
}

function removeHandlers() {
  console.error('REMOVING');
  element.removeEventListener('keyup', onKeyUp);
  document.removeEventListener('keyup', onKeyUpDocument);
}

function onKeyUp(event) {
  console.error('onKeyUp');
  emitter.emit('keyup', event.which);
}

function onKeyUpDocument(event) {
  console.error('onKeyUpDocument');
  emitter.emit('document:keyup', event.which);
}

function initialize(visible) {
  // console.log(_matchList.element);
  bottomPanel = atom.workspace.addBottomPanel({
    item: element,
    visible: visible || false
  });

  leftPanel = atom.workspace.addLeftPanel({
    item: _matchList.element,
    priority: 1000,
    visible: true
  });

  // _matchList.emitter.on(function() {
  //
  // });

  addHandlers();

  return {
    panel: bottomPanel,
    element: element
  };
}

function destroy() {
  removeHandlers();
  bottomPanel.destroy();
  leftPanel.destroy();

  bottomPanel = null;
  leftPanel = null;
}

module.exports._display = _display;
module.exports._filterInput = _filterInput;
module.exports._selectorInput = _selectorInput;
module.exports._matchList = _matchList;
module.exports.initialize = initialize;
module.exports.destroy = destroy;
module.exports.emitter = emitter;
