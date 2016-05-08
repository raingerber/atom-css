// FOR THE PATHS, CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE
var paths = require('./paths').getPaths();

var View = require('./views/main');
var Emitter = require('atom').Emitter;

var emitter;

var compiledSelector = '';
var showTogetherWithFindPanel = true;

var CompositeDisposable = require('atom').CompositeDisposable;

var createOutputString = require('./utils/output-string');
var addSelectionListener = require('./utils/selector-preview').addSelectionListener;
var Filter = require('./utils/rule-filter');

var Crawler = require('./highlights/crawler-instance');

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
  addSelectionListener(editor, Crawler.getFiles(), function onSelectorUpdate(compiledSelectors) {
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
  // var panelIsVisible = View.togglePanel('bottom', null, true);
  // panelIsVisible && View._selectorInput.editor.element.focus();
  View.togglePanel('bottom', null, true);
}
// match.selection.range.start
function onMatchClicked(selection) {
  // console.log(selection);
  Crawler.setCurrentMatch(selection.path, selection.range.start);
}

function onSearch(data) {
  var forward = typeof data.forward === 'boolean' ? data.forward : true;
  // console.log(forward);
  Crawler.makeOrUpdateCrawler(data, forward);
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
  Crawler.setPaths(paths); // this can be used to update the thing
}

function deactivate() {
  Crawler.destroyCrawler();
  subscriptions && subscriptions.dispose();
  View && View.destroy();
}

function cancel() {
  Crawler.destroyCrawler();
  View.togglePanel('all', false);
}

module.exports.activate = activate;
module.exports.deactivate = deactivate;
