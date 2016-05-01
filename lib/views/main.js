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

function addHandlers() {
  element.addEventListener('keyup', onKeyUp);
  document.addEventListener('keyup', onKeyUpDocument);
}

function removeHandlers() {
  element.removeEventListener('keyup', onKeyUp);
  document.removeEventListener('keyup', onKeyUpDocument);
}

function onKeyUp(event) {
  emitter.emit('keyup', event.which);
}

function onKeyUpDocument(event) {
  emitter.emit('document:keyup', event.which);
}

function initialize(visible) {
  bottomPanel = atom.workspace.addBottomPanel({
    item: element,
    visible: visible || false
  });

  // leftPanel = atom.workspace.addBottomPanel({
  //   item: matchList,
  //   visible: false
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
  // leftPanel.destroy();
}

module.exports._display = _display;
module.exports._filterInput = _filterInput;
module.exports._selectorInput = _selectorInput;
module.exports.initialize = initialize;
module.exports.destroy = destroy;
module.exports.emitter = emitter;
