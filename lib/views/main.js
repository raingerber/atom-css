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

function destroyPanel(id) {
  if (id === 'left') {
    leftPanel && leftPanel.destroy();
    return leftPanel = null;
  }

  if (id === 'bottom') {
    bottomPanel && bottomPanel.destroy();
    return bottomPanel = null;
  }
}

function destroy() {
  element.removeEventListener('keyup', keyUpCb);
  destroyPanel('bottom');
  destroyPanel('left');

  bottomPanel = null;
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
      break;
    default:
      break;
  };
}

function getQueries() {
  var selector = getQuery(_selectorInput);
  var filter = getQuery(_filterInput);

  return {
    selector: selector || '',
    filter: filter || ''
  };
}

function getQuery(view) {
  return view.editor.getText();
}

// toggleSearchInputPanel
function togglePanelHelper(panel, show) {
  if (!panel) {
    return false;
  }

  if (typeof show !== 'boolean') {
    show = !panel.isVisible();
  }

  if (show) {
    panel.show();
    if (focus) {
      console.log('focus on input element');
    }
  } else {
    panel.hide();
  }

  return show;
}

function togglePanel(id, show, focus) {
  if (id === 'bottom') {
    return togglePanelHelper(bottomPanel, show, focus);
  }

  if (id === 'left') {
    return togglePanelHelper(leftPanel, show, focus);
  }

  // console.log('TOGGLE PANEL');
  panelIsVisible && View._selectorInput.editor.element.focus();
}

module.exports._display = _display;
module.exports._filterInput = _filterInput;
module.exports._selectorInput = _selectorInput;
module.exports._matchList = _matchList;
module.exports.initialize = initialize;
module.exports.destroy = destroy;
module.exports.leftPanel = leftPanel;
module.exports.togglePanel = togglePanel;
module.exports.getQueries = getQueries;
