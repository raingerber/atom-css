var fs = require('fs');

var paths = require('./paths');
// var getCompiledSelector = require('./selector-compiler').getCompiledSelector;
var addSelectionListener = require('./selector-preview').addSelectionListener;
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
      var selector = View._selectorInput.getText();
      var filterRules = Filter.createFilterRule(View._filterInput.getText());
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
      View._selectorInput.element.focus();
    });
  }

  return matches;
}

////////////////////////////////////////////////////////////////////////////////

function onSelectorViewCompiled(compiledSelector) {
  View._display.text(compiledSelector);
}

var app = {
  activate: function activate() {
    View.createView(true);
    files = new ProjectFiles(paths);
    subscriptions.add(View.emitter.on('keyup', onKeyUp));
    subscriptions.add(View.emitter.on('document:keyup', onKeyUpDocument));
    var onSelection = _.partial(addSelectionListener, onSelectorViewCompiled);
    subscriptions.add(atom.workspace.observeTextEditors(onSelection));
    // View._display.element.addEventListener('dblclick', function() {
    //   if (compiledSelector) {
    //     atom.clipboard.write(compiledSelector);
    //   }
    // });
  },

  deactivate: function deactivate() {
    files.destroyCrawler();
    subscriptions.dispose();
    View.destroyView();
  }
};

module.exports = app;
