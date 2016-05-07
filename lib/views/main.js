var _ = require('lodash');

var _display = require('./display');
var _selectorInput = require('./selector-input');
var _filterInput = require('./filter-input');
var _matchList = require('./match-list');
var _pathList = require('./path-list');

var bottomPanel;
var leftPanel;

// var ESC_KEY = 27;
var ENTER_KEY = 13;

var element = document.createElement('div');

element.classList.add('atom-css-bottom-panel');

element.appendChild(_selectorInput.element);
element.appendChild(_filterInput.element);
element.appendChild(_pathList.element);
element.appendChild(_display.element);

var keyUpCb;

var p = require('../paths').getPaths();

// console.log(p);

_pathList.setPaths(p);

function initialize(emitter, visible) {

  _selectorInput.addEventListeners(emitter);

  bottomPanel = atom.workspace.addBottomPanel({
    item: element,
    visible: visible || false
  });

  leftPanel = atom.workspace.addLeftPanel({
    item: _matchList.element,
    priority: 1000,
    visible: true
  });

  emitter.on('search', _matchList.onSearchEvent);

  keyUpCb = function keyUpCb(event) {
    onKeyUp(emitter, event.which, !event.shiftKey);
  };

  element.addEventListener('keyup', keyUpCb);

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
  element.removeEventListener('keyup', keyUpCb);

  bottomPanel && bottomPanel.destroy();
  destroyLeftPanel();

  bottomPanel = null;
}

function toggleSearchInputPanel(show) {
  bottomPanel && show ? bottomPanel.show() : bottomPanel.hide();
}

function toggleSearchPanel(show) {
  // console.error('toggle:', show);
  leftPanel && show ? leftPanel.show() : leftPanel.hide();
}

function onKeyUp(emitter, keycode, forward) {
  // console.error(keycode);
  switch (keycode) {
    case ENTER_KEY:
      emitter.emit('search', {
        type: 'source',
        forward: forward
      });
      // updateSearch({});
      return false;
    // case SHIFT_KEY:
      // return false;
    default:
      return;
  };
}

function getQueries() {
  var selector = getQuery(_selectorInput);
  var filter = getQuery(_filterInput);

  return {
    selector: selector || '',
    filter: filter || ''
  };
  // _selectorInput = View._selectorInput;
  // _filterInput = View._filterInput;
  // console.log(arguments, _filterInput.editor);
  // var filterQuery = _filterInput.editor.getText();
  // var selectorQuery = _selectorInput.editor.getText();
}

function getQuery(view) {
  return view.editor.getText();
}

module.exports._display = _display;
module.exports._filterInput = _filterInput;
module.exports._selectorInput = _selectorInput;
module.exports._matchList = _matchList;
module.exports.initialize = initialize;
module.exports.destroy = destroy;
module.exports.leftPanel = leftPanel;
module.exports.destroyLeftPanel = destroyLeftPanel;
module.exports.toggleSearchInputPanel = toggleSearchInputPanel;
module.exports.toggleSearchPanel = toggleSearchPanel;
module.exports.getQueries = getQueries;
