var fs = require('fs');

var paths = require('./paths');
var getCompiledSelector = require('./selector-compiler').getCompiledSelector;
var ProjectFiles = require('./file-utils/project-files');
var HighlightCrawler = require('./highlights/highlight-crawler');

var Filter = require('./utils/rule-filter');
var CompositeDisposable = require('atom').CompositeDisposable

var subscriptions = new CompositeDisposable();

var view = require('./views/main');

var element;
var files;
var crawler;
var compiledSelector = '';

var ENTER_KEY = 13;
var ESC_KEY = 27;
////////////////////////////////////////////////////////////////////////////////

var disposable;

function onKeyUp(keycode) {
  switch (keycode) {
    case ENTER_KEY:
      var selector = view._selectorInput.getText();
      var filterRules = Filter.createFilterRule(view._filterInput.getText());
      return searchFn(selector, filterRules);
    case ESC_KEY:
      destroyCrawler(event);
      return false;
    default:
      return;
  };
}

function onKeyUpDocument(keycode) {
  if (keycode === ESC_KEY && crawler) {
    destroyCrawler();
  }
}

function searchFn(query, filterRules) {
  // console.dir(filterRules);
  if (crawler) {
    crawler.next();
  } else {
    // matches is an array of start points
    var matches = files.searchFiles(query, filterRules);
    crawler = new HighlightCrawler(matches, function inputCallback() {
      view._selectorInput.element.focus();
    });
  }

  return matches;
}

////////////////////////////////////////////////////////////////////////////////

function updateCompiledSelectorView(selection) {
  // console.log(selection);//.getText());
  var hasText = selectionHasText(selection);
  compiledSelector = hasText ? getCompiledSelector(selection) : '';
  view._display.text(compiledSelector);
}

function selectionHasText(selection) {
  return selection && selection.getText();
}

function onSelectionChange(event) {
  try {
    updateCompiledSelectorView(event.selection);
  } catch (e) {
    console.log('UNCAUGHT ERROR:', e);
  }
}

function addSelectionListener(editor) {
  return editor.onDidChangeSelectionRange(onSelectionChange);
}

var app = {
  activate: function activate() {
    view.createView(true);
    files = new ProjectFiles(paths);
    subscriptions.add(view.emitter.on('keyup', onKeyUp));
    subscriptions.add(view.emitter.on('document:keyup', onKeyUpDocument));
    subscriptions.add(atom.workspace.observeTextEditors(addSelectionListener));

    // view._display.element.addEventListener('dblclick', function() {
    //   if (compiledSelector) {
    //     atom.clipboard.write(compiledSelector);
    //   }
    // });
  },

  deactivate: function deactivate() {
    files.destroyCrawler();
    subscriptions.dispose();
    view.destroyView();
  }
};

module.exports = app;
