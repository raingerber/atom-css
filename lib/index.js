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

var showTogetherWithFindPanel = true;

subscriptions.add(atom.commands.add('atom-workspace', {
  'find-and-replace:show': onFindCommand
}));

subscriptions.add(atom.commands.add('atom-workspace', {
  'project-find:show': onFindCommand
}));

subscriptions.add(atom.commands.add('atom-workspace', {
  'atom-stylus:toggle': togglePanel
}));

subscriptions.add(atom.commands.add('atom-workspace', {
  'core:cancel': function() {
    destroyCrawler();
    View.toggleSearchInputPanel(false)
  }
}));


function togglePanel() {
  console.log('TOGGLE PANEL');
  if (View.toggleSearchInputPanel()) {
    // console.log(element.querySelector('.text-input'));
    // window.v = View;
    View._selectorInput.editor.element.focus();

    // View._selectorInput.element.focus();
  }
}

function onFindCommand() {
  console.log('onFindCommand');
  if (showTogetherWithFindPanel) {
    View.toggleSearchInputPanel(true);
  }
}

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
  var forward = typeof data.forward === 'boolean' ? data.forward : true;
  // console.log(forward);
  updateSearch(data, forward);
});

function stepHighlights(forward) {
  if (forward) {
    crawler.next();
  } else {
    crawler.prev();
  }
}

function makeCrawler(searchType, query, filterRules) {
  // matches is an array of start points
  var matches = fileSearch.searchFiles(searchType, query, filterRules);

  // console.log(matches);

  if (!matches || !matches.length) {
    console.log('No matches found; crawler not initialized.');
    return null;
  }

  // console.log(matches);
  View._matchList.setFileMatches(emitter, matches);
  View.toggleSearchPanel(true);

  return new HighlightCrawler(matches, function inputCallback() {
    View._selectorInput.editor.element.focus();
  });

}


// CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE
function updateSearch(data, forward) {
  if (crawler) {
    return stepHighlights(forward);
  }

  var queries = View.getQueries();
  var filterRules = Filter.createFilterRules(queries.filter);

  crawler = makeCrawler(data.type, queries.selector, filterRules);
  // createSearchHighlights(data.type, queries.selector, filterRules);
}

emitter.on('match-clicked', function(match) {
  crawler && crawler.setCurrentMatch(match.path, match.match.range.start);
});

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
