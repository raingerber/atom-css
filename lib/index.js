var fs = require('fs');

var paths = require('./paths');
var _getCompiledSelector = require('./selector-compiler').getCompiledSelector; // Search and search are both defined!!!!!!!
var FileWatcher = require('./file-utils/project-file-watcher');
var HighlightCrawler = require('./highlights/highlight-crawler');

var Filter = require('./utils/rule-filter');
var subscriptions = new (require('atom').CompositeDisposable)();

var view = require('./views/main');

var element;
var watcher;
var crawler;
var compiledSelector = '';

var ENTER_KEY = 13;
var ESC_KEY = 27;
////////////////////////////////////////////////////////////////////////////////

var disposable;

function addHandlers() {
  document.addEventListener('keyup', clear);
  disposable = view.emitter.on('keyup', onKeyUp);
}

function removeHandlers() {
  document.removeEventListener('keyup', clear);
  disposable.dispose();
}

function clear(event) {
  if (event.which === ESC_KEY && crawler) {
    crawler.clear();
    crawler = null;
  }
}

function onKeyUp(keycode) {
  switch (keycode) {
    case ENTER_KEY:
      var selector = view._selectorInput.getText();
      var filterRules = Filter.createFilterRule(view._filterInput.getText());
      return searchFn(selector, filterRules);
    case ESC_KEY:
      clear(event);
      return false;
    default:
      return;
  };
}

function searchFn(query, filterRules) {
  // console.dir(filterRules);
  if (crawler) {
    crawler.next();
  } else {
    // matches is an array of start points
    var matches = watcher.searchFiles(query, filterRules);
    crawler = new HighlightCrawler(matches, function inputCallback() {
      view._selectorInput.element.focus();
    });
  }

  return matches;
}

////////////////////////////////////////////////////////////////////////////////

function updateCompiledSelectorView(selection) {
  // console.log(selection);//.getText());
  var show = selection && selection.getText();
  compiledSelector = show ? getCompiledSelector(selection) : '';
  view._display.text(compiledSelector);
}

function onSelectionChange(event) {
  try {
    updateCompiledSelectorView(event.selection);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function getCompiledSelector(selection) {
  var file = watcher.getSourceFileByPath(selection.editor.getPath());
  var compiledSelector = '';
  if (file) {
    compiledSelector = _getCompiledSelector(file, selection.getBufferRange())
  }

  return compiledSelector;
}

function addSelectionListener(editor) {
  return editor.onDidChangeSelectionRange(onSelectionChange);
}

var app = {
  activate: function activate() {
    view.createView(true);
    watcher = new FileWatcher(paths);
    addHandlers();
    subscriptions.add(atom.workspace.observeTextEditors(addSelectionListener));

    // view._display.element.addEventListener('dblclick', function() {
    //   if (compiledSelector) {
    //     atom.clipboard.write(compiledSelector);
    //   }
    // });
  },

  deactivate: function deactivate() {
    console.log('CLEARING');
    watcher.clear();
    subscriptions.dispose();
    removeHandlers();
    destroyView();
  }
};

module.exports = app;
