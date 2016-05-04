var _ = require('lodash');

var _display = require('./display');
var _selectorInput = require('./input');
var _filterInput = require('./filter-input');
var _matchList = require('./match-list');

var emitter = new (require('atom').Emitter)();

var bottomPanel;
var leftPanel;

var element = document.createElement('div');

element.classList.add('atom-css-bottom-panel');

element.appendChild(_selectorInput.element);
element.appendChild(_filterInput.element);
element.appendChild(_display.element);

function onKeyUp(event) {
  // console.error('onKeyUp');
  emitter.emit('keyup', event.which);
}

// function onKeyUpDocument(event) {
//   console.error('onKeyUpDocument');
//   emitter.emit('document:keyup', event.which);
// }

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

  element.addEventListener('keyup', onKeyUp);

  return {
    panel: bottomPanel,
    element: element
  };
}

function destroyLeftPanel() {
  console.error('destroying');
  leftPanel && leftPanel.destroy();
  leftPanel = null;
}

function destroy() {
  element.removeEventListener('keyup', onKeyUp);

  bottomPanel && bottomPanel.destroy();
  destroyLeftPanel();

  bottomPanel = null;
}

function toggleSearchPanel(show) {
  // console.error('toggle:', show);
  leftPanel && show ? leftPanel.show() : leftPanel.hide();
}

module.exports._display = _display;
module.exports._filterInput = _filterInput;
module.exports._selectorInput = _selectorInput;
module.exports._matchList = _matchList;
module.exports.initialize = initialize;
module.exports.destroy = destroy;
module.exports.emitter = emitter;
module.exports.leftPanel = leftPanel;
module.exports.destroyLeftPanel = destroyLeftPanel;
module.exports.toggleSearchPanel = toggleSearchPanel;
