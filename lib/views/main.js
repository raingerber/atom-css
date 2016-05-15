var _ = require('lodash');

var _display = require('./display');
var _selectorInput = require('./selector-input');
var _filterInput = require('./filter-input');
var _pathInput = require('./path-input');
var _matchList = require('./match-list');
var _pathList = require('./path-list');

var bottomPanel;
var leftPanel;

// var ESC_KEY = 27;
var ENTER_KEY = 13;

var element = document.createElement('div');

var _displayContainer = document.createElement('div');
var _menuLinks = document.createElement('div');
_menuLinks.innerHTML = '<a>Show CSS Paths</a>';
_displayContainer.appendChild(_display.element);
_displayContainer.appendChild(_menuLinks);

element.classList.add('atom-css-bottom-panel');

var mainInputElements = document.createElement('div');
mainInputElements.appendChild(_selectorInput.element);
mainInputElements.appendChild(_filterInput.element);
element.appendChild(mainInputElements);
// element.appendChild(_selectorInput.element);
// element.appendChild(_filterInput.element);
element.appendChild(_pathInput.element);
element.appendChild(_pathList.element);
element.appendChild(_displayContainer);

var keyUpCb;

var Paths = require('../paths');

_pathList.setPaths(Paths.getPaths());

Paths.emitter.on('paths-updated', function onPathsUpdated(event, paths) {
  console.log(arguments);
  _pathList.setPaths(paths); // get it each time
});

var pathInputOpen = false;

togglePathInput(pathInputOpen);

function togglePathInput(show) {
  pathInputOpen = typeof show === 'boolean' ? show : !pathInputOpen;
  mainInputElements.classList.toggle('hidden', pathInputOpen);
  _pathInput.toggle(pathInputOpen);
  _pathList.toggle(pathInputOpen);
  if (pathInputOpen) {
    console.error('open');
    _pathInput.element.focus();
  }
}

_menuLinks.querySelector('a').addEventListener('click', togglePathInput);

function onKeyUpPathInput(event) {
  if (event.which !== ENTER_KEY) {
    return;
  }
  var newPath = _pathInput.editor.getText();
  _pathInput.editor.setText('');

  if (newPath) {
    Paths.addNewPath(newPath.trim());
  }
}

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

  _selectorInput.element.addEventListener('keyup', keyUpCb);
  _filterInput.element.addEventListener('keyup', keyUpCb);
  _pathInput.element.addEventListener('keyup', onKeyUpPathInput);

  return {
    panel: bottomPanel,
    element: element
  };
}

// var buttons = document.createElement('div');
// buttons.classList.add('block');
// buttons.innerHTML = [ // use 'selected' class to make a button blue
//   "<div class='btn-group'>",
//     "<button class='btn search-source'>Show Paths</button>",
//   "</div>"
// ].join('');
//
// var element = document.createElement('div');
// element.classList.add('preprocessor-preview-path-input-bar');
// element.appendChild(editor.element);
// element.appendChild(buttons);

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

function togglePanelHelper(panel, show) {
  if (!panel) {
    return false;
  }

  if (typeof show !== 'boolean') {
    show = !panel.isVisible();
  }

  if (show) {
    panel.show();
    // if (focus) {
    //   console.log('focus on input element');
    // }
  } else {
    panel.hide();
  }

  return show;
}

// FOCUS DOES NOTHING RIGHT NOW
function togglePanel(id, show, focus) {
  var visible;
  if (id === 'bottom') {
    visible = togglePanelHelper(bottomPanel, show, focus);
  }

  if (id === 'left') {
    visible = togglePanelHelper(leftPanel, show, focus);
  }

  if (id === 'all') {
    visible = togglePanel('bottom', show, focus);
    visible = togglePanel('left', show, focus);
  }

  // console.log('TOGGLE PANEL');
  // visible && View._selectorInput.editor.element.focus();
}

module.exports._display = _display;
module.exports._filterInput = _filterInput;
module.exports._pathInput = _pathInput;
module.exports._pathList = _pathList;
module.exports._selectorInput = _selectorInput;
module.exports._displayContainer = _displayContainer;
module.exports._matchList = _matchList;
module.exports.initialize = initialize;
module.exports.destroy = destroy;
module.exports.leftPanel = leftPanel;
module.exports.togglePanel = togglePanel;
module.exports.getQueries = getQueries;
