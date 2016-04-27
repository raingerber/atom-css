var fs = require('fs');

var paths = require('./paths');
var addSelectionListener = require('./selector-preview').addSelectionListener;
var FileSearch = require('./file-utils/file-search');
var HighlightCrawler = require('./highlights/highlight-crawler');

var Filter = require('./utils/rule-filter');
var CompositeDisposable = require('atom').CompositeDisposable

var ESC_KEY = 27;
var ENTER_KEY = 13;

var subscriptions = new CompositeDisposable();

var View = require('./views/main');

var files;
var crawler;
var compiledSelector = '';

////////////////////////////////////////////////////////////////////////////////

var disposable;

function onKeyUp(keycode) {
  switch (keycode) {
    case ENTER_KEY:
      var selectorQuery = View._selectorInput.getText();
      var filterQuery = View._filterInput.getText();
      var filterRules = Filter.createFilterRules(filterQuery);
      createSearchHighlights(selectorQuery, filterRules);
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

function createSearchHighlights(query, filterRules) {
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
}

////////////////////////////////////////////////////////////////////////////////

function addTextEditorObserver(view, editor) {
  addSelectionListener(editor, function onSelectionUpdate() {
    // view.text(compiledSelector);
  });
}

var app = {
  activate: function activate() {
    View.initialize(true);
    files = new FileSearch(paths);
    subscriptions.add(atom.workspace.observeTextEditors(
      _.partial(addTextEditorObserver, View._display)
    ));

    subscriptions.add(View.emitter.on('keyup', onKeyUp));
    subscriptions.add(View.emitter.on('document:keyup', onKeyUpDocument));;
  },

  deactivate: function deactivate() {
    files.destroyCrawler();
    subscriptions.dispose();
    View.destroy();
  }
};

module.exports = app;
