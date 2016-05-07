Function = require('loophole').Function;

var fs = require('fs');

var paths = require('./paths').getPaths();
var addSelectionListener = require('./utils/selector-preview').addSelectionListener;
var FileSearch = require('./file-utils/file-search');
var HighlightCrawler = require('./highlights/highlight-crawler');

var Filter = require('./utils/rule-filter');
var CompositeDisposable = require('atom').CompositeDisposable;
var Emitter = require('atom').Emitter;

var subscriptions = new CompositeDisposable();
var emitter = new Emitter();

var View = require('./views/main');

var fileSearch;
var crawler;
var compiledSelector = '';

////////////////////////////////////////////////////////////////////////////////

var disposable;

// subscriptions.add(atom.commands.add('atom-workspace', {
//   'atom-stylus:esc': destroyCrawler
// }));

var app = {
  activate: function activate() {
    View.initialize(emitter, true); // visible = true
    fileSearch = new FileSearch(paths); // put in a function so you can change the paths dynamically
    subscriptions.add(atom.workspace.observeTextEditors(
      _.partial(addTextEditorObserver, View._display)
    ));
  },

  deactivate: function deactivate() {
    crawler && crawler.destroy();
    subscriptions.dispose();
    View.destroy();
  }
};

function destroyCrawler() {
  View.toggleSearchPanel(false);
  crawler && crawler.destroy();
  crawler = null;
}

emitter.on('search', function(data) {
  // console.log(data);
  updateSearch(data);
});

function updateSearch(data, _selectorInput, _filterInput) {
  // _selectorInput = View._selectorInput;
  // _filterInput = View._filterInput;
  // console.log(data);
  var queries = View.getQueries();
  // var filterQuery = _filterInput.editor.getText();
  // var selectorQuery = _selectorInput.editor.getText();
  var filterRules = Filter.createFilterRules(queries.filter);
  createSearchHighlights(data.type, queries.selector, filterRules);
}

// function onKeyUpDocument(keycode) {
//   console.log(keycode);
//   keycode == ESC_KEY && crawler && crawler.destroy();
// }

emitter.on('match-clicked', function(match) {
  // console.log(match);
  if (!crawler) {
    return;
  }

  // console.log(match);
  crawler.setCurrentMatch(match.path, match.match.line, match.match.column);
});

function createSearchHighlights(searchType, query, filterRules) {


  if (crawler) {
    crawler.next();
  } else {

    // matches is an array of start points
    var matches = fileSearch.searchFiles(searchType, query, filterRules);

    // console.log(matches);

    if (!matches || !matches.length) {
      console.log('No matches found; crawler not initialized.');
      return crawler = null;
    }

    // console.log(matches);

    View._matchList.setFileMatches(emitter, matches);
    View.toggleSearchPanel(true);

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
