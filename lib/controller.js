// FOR THE PATHS, CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE
var paths = require('./paths').getPaths();

var View = require('./views/main');
var FileSearch = require('./file-utils/file-search');
var Emitter = require('atom').Emitter;
var HighlightCrawler = require('./highlights/highlight-crawler');
var crawler;
var fileSearch;
var emitter;

var compiledSelector = '';
var showTogetherWithFindPanel = true;

var CompositeDisposable = require('atom').CompositeDisposable;

var createOutputString = require('./utils/output-string');
var addSelectionListener = require('./utils/selector-preview').addSelectionListener;
var Filter = require('./utils/rule-filter');

function addSubscription(subscriptions, mapping) {
  subscriptions.add(atom.commands.add('atom-workspace', mapping));
}

function addCommandSubscriptions(subscriptions, mappings) {
  mappings.forEach(function(mapping) {
    addSubscription(subscriptions, mapping);
  });

  return subscriptions;
}

function addEmitterEvent(emitter, evt, fn) {
  emitter.on(evt, fn)
  var diposable = {
    dispose: function dispose() {
      emitter.off(evt, fn);
    }
  };

  return diposable;
}

function addTextEditorObserver(view, editor) {
  addSelectionListener(editor, fileSearch, function onSelectorUpdate(compiledSelectors) {
    // console.dir(compiledSelectors);
    var x = createOutputString(compiledSelectors);
    view.text(x);
  });
}

function addEvents(displayView) {

  var emitter = new Emitter;
  var subscriptions = new CompositeDisposable();

  var mappings = [
    { 'find-and-replace:show': onFindCommand },
    { 'project-find:show': onFindCommand },
    { 'atom-stylus:toggle': togglePanel },
    { 'core:cancel': cancel }
  ];

  var _addTextEditorObserver = _.partial(addTextEditorObserver, displayView);

  subscriptions.add(atom.workspace.observeTextEditors(_addTextEditorObserver));

  subscriptions.add(addEmitterEvent(emitter, 'match-clicked', onMatchClicked));
  subscriptions.add(addEmitterEvent(emitter, 'search', onSearch));

  addCommandSubscriptions(subscriptions, mappings);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function togglePanel() {
  // console.log('TOGGLE PANEL');
  var panelIsVisible = View.togglePanel('bottom');
  panelIsVisible && View._selectorInput.editor.element.focus();
}
// match.selection.range.start
function onMatchClicked(selection) {
  // console.log(selection);
  crawler && crawler.setCurrentMatch(selection.path, selection.range.start);
}

function onSearch(data) {
  var forward = typeof data.forward === 'boolean' ? data.forward : true;
  // console.log(forward);
  crawler = updateSearch(data, forward);
  console.log(crawler);
}

function cancel() {
  destroyCrawler();
  View.togglePanel('bottom', false);
}

function onFindCommand() {
  console.log('onFindCommand');
  if (showTogetherWithFindPanel) {
    // console.log(View)
    View.togglePanel('bottom', true);
  }
}

var emitter;
var subscriptions;

function activate() {
  // console.log('ACTIVATE');
  var obj = addEvents(View._display);
  // console.log(obj);
  emitter = obj.emitter;
  subscriptions = obj.subscriptions;
  View.initialize(emitter, true); // visible = true (replace this second parameter with options object)
  fileSearch = new FileSearch(paths); // put in a function so you can change the paths dynamically
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
  console.log('crawler', crawler);
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

module.exports.activate = activate;
module.exports.deactivate = deactivate;
