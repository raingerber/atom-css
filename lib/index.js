var fs = require('fs');

var paths = require('./paths').globPaths();
var addSelectionListener = require('./utils/selector-preview').addSelectionListener;
var FileSearch = require('./file-utils/file-search');
var HighlightCrawler = require('./highlights/highlight-crawler');

var Filter = require('./utils/rule-filter');
var CompositeDisposable = require('atom').CompositeDisposable;

var ESC_KEY = 27;
var ENTER_KEY = 13;

var subscriptions = new CompositeDisposable();

var View = require('./views/main');

var fileSearch;
var crawler;
var compiledSelector = '';

////////////////////////////////////////////////////////////////////////////////

var disposable;

var app = {
  activate: function activate() {
    View.initialize(true); // visible = true
    fileSearch = new FileSearch(paths); // put in a function so you can change the paths dynamically
    subscriptions.add(atom.workspace.observeTextEditors(
      _.partial(addTextEditorObserver, View._display)
    ));

    subscriptions.add(View.emitter.on('keyup', onKeyUp));
    subscriptions.add(View.emitter.on('document:keyup', onKeyUpDocument));;
  },

  deactivate: function deactivate() {
    crawler && crawler.destroy();
    subscriptions.dispose();
    View.destroy();
  }
};

function onKeyUp(keycode) {
  switch (keycode) {
    case ENTER_KEY:
      updateSearch(View._selectorInput, View._filterInput);
      return false;
    case ESC_KEY:
      crawler && crawler.destroy();
      return false;
    default:
      return;
  };
}

function updateSearch(selectorInput, filterInput) {
  var filterQuery = filterInput.getText();
  var selectorQuery = selectorInput.getText();
  var filterRules = Filter.createFilterRules(filterQuery);
  createSearchHighlights(selectorQuery, filterRules);
}

function onKeyUpDocument(keycode) {
  keycode == ESC_KEY && crawler && crawler.destroy();
}

function createSearchHighlights(query, filterRules) {
  // console.dir(filterRules);
  if (crawler) {
    crawler.next();
  } else {
    // matches is an array of start points
    var matches = fileSearch.searchFiles(query, filterRules);
    if (!matches || !matches.length) {
      console.log('No matches found; crawler not initialized.');
      return crawler = null;
    }

    crawler = new HighlightCrawler(matches, function inputCallback() {
      View._selectorInput.element.focus();
    });
  }
}

////////////////////////////////////////////////////////////////////////////////


function createOutputString(lines) {
  if (!lines.length) {
    return '';
  }

  if (lines.length === 1) {
    return lines[0];
  }

  return lines.join('<br />');
}

function addTextEditorObserver(view, editor) {
  addSelectionListener(editor, fileSearch, function onSelectorUpdate(compiledSelectors) {
    // console.dir(compiledSelectors);
    var x = createOutputString(compiledSelectors);
    view.text(x);
  });
}

module.exports = app;
