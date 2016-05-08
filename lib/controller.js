// FOR THE PATHS, CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE

var View = require('./views/main');
var FileSearch = require('./file-utils/file-search');
var Emitter = require('atom').Emitter;

var crawler;
var fileSearch;
var subscriptions;
var emitter;

var compiledSelector = '';
var showTogetherWithFindPanel = true;

var CompositeDisposable = require('atom').CompositeDisposable;

var createOutputString = require('./utils/output-string');
var addSelectionListener = require('./utils/selector-preview').addSelectionListener;

function addSubscription(subscriptions, mapping) {
  subscriptions.add(atom.commands.add('atom-workspace', mapping));
}

function addSubscriptions(subscriptions, mappings) {
  mappings.forEach(function(mapping) {
    addSubscription(subscriptions, mapping);
  });
}

function addTextEditorObserver(view, editor) {
  addSelectionListener(editor, fileSearch, function onSelectorUpdate(compiledSelectors) {
    // console.dir(compiledSelectors);
    var x = createOutputString(compiledSelectors);
    view.text(x);
  });
}

function addEvents(emitter, crawler, controller) {

  var emitter = new Emitter;
  var subscriptions = new CompositeDisposable();

  emitter.on('search', onSearch); // add these to the disposable as well
  emitter.on('match-clicked', onMatchClicked);

  var mappings = [
    { 'find-and-replace:show': onFindCommand },
    { 'project-find:show': onFindCommand },
    { 'atom-stylus:toggle': togglePanel },
    { 'core:cancel': cancel }
  ];

  addSubscriptions(subscriptions, mappings);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function togglePanel() {
  // console.log('TOGGLE PANEL');
  var panelIsVisible = View.toggleSearchInputPanel();
  panelIsVisible && View._selectorInput.editor.element.focus();
}

function onSearch(data) {
  var forward = typeof data.forward === 'boolean' ? data.forward : true;
  // console.log(forward);
  updateSearch(data, forward);
}

function onMatchClicked(match) {
  crawler && crawler.setCurrentMatch(match.path, match.match.range.start);
}

function cancel() {
  destroyCrawler();
  View.toggleSearchInputPanel(false)
}

function onFindCommand() {
  console.log('onFindCommand');
  if (showTogetherWithFindPanel) {
    View.toggleSearchInputPanel(true);
  }
}

function activate() {
  View.initialize(emitter, true); // visible = true (replace this second parameter with options object)
  fileSearch = new FileSearch(paths); // put in a function so you can change the paths dynamically

  subscriptions.add(atom.workspace.observeTextEditors(
    function(editor) {
      addTextEditorObserver(View._display, editor);
    }
  ));
}

function deactivate() {
  crawler && crawler.destroy();
  subscriptions && subscriptions.dispose();
  View && View.destroy();
}

function destroyCrawler() {
  View.togglePanel('bottom', false);
  crawler && crawler.destroy();
  crawler = null;
}

function updateSearch(data, forward) {
  if (crawler) {
    stepHighlights(forward);
    return crawler;
  }

  var queries = View.getQueries();
  var filterRules = Filter.createFilterRules(queries.filter);

  return makeCrawler(data.type, queries.selector, filterRules);
}

function stepHighlights(forward) {
  if (forward) {
    crawler.next();
  } else {
    crawler.prev();
  }
}

function makeCrawler(searchType, query, filterRules) {
  var matches = fileSearch.searchFiles(searchType, query, filterRules); // matches is an array of start points

  // console.log(matches);
  if (!matches || !matches.length) {
    console.log('No matches found; crawler not initialized.');
    return null;
  }

  View._matchList.setFileMatches(emitter, matches);
  View.togglePanel('bottom', true, true);

  return new HighlightCrawler(matches, function inputCallback() {
    View._selectorInput.editor.element.focus();
  });
}

module.exports.activate = active;
module.exports.deactivate = deactivate;
