// FOR THE PATHS, CHECK IF IT'S A NEW PATH OR WHATEVER ELSE MIGHT CHANGE
var paths = require('./paths').getPaths();

var Emitter = require('atom').Emitter;
var CompositeDisposable = require('atom').CompositeDisposable;
var View = require('./views/main');

var emitter;
var subscriptions;

var compiledSelector = '';
var showTogetherWithFindPanel = true;

var Crawler = require('./highlights/crawler-instance');

var addTextEditorObserver = require('./utils/selector-preview').addTextEditorObserver;

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

function addEvents(displayView) {

  var emitter = new Emitter;
  var subscriptions = new CompositeDisposable();

  var mappings = [
    { 'find-and-replace:show': onFindCommand },
    { 'project-find:show': onFindCommand },
    { 'atom-stylus:toggle': toggleSearchPanel },
    { 'core:cancel': cancel }
  ];

  var textEditorObserver = function textEditorObserver(editor) {
    addTextEditorObserver(editor, Crawler.getFiles(), displayView);
  };

  subscriptions.add(atom.workspace.observeTextEditors(textEditorObserver));

  subscriptions.add(addEmitterEvent(emitter, 'match-clicked', onMatchClicked));
  subscriptions.add(addEmitterEvent(emitter, 'search', onSearch));

  addCommandSubscriptions(subscriptions, mappings);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function toggleSearchPanel() {
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
  Crawler.makeOrUpdateCrawler(emitter, data, forward);
}

function onFindCommand() {
  console.log('onFindCommand');
  if (showTogetherWithFindPanel) {
    // console.log(View)
    View.togglePanel('bottom', true);
  }
}

function cancel() {
  Crawler.destroyCrawler();
  View.togglePanel('all', false);
}

function setPaths(paths) {
  Crawler.setPaths(paths);
}

var app = {
  activate: function activate() {
    // console.log('ACTIVATE');
    var obj = addEvents(View._display);
    // console.log(obj);
    emitter = obj.emitter;
    subscriptions = obj.subscriptions;
    View.initialize(emitter, true); // visible = true (replace this second parameter with options object)
    Crawler.setPaths(paths); // this can be used to update the thing
  },

  deactivate: function deactivate() {
    Crawler.destroyCrawler();
    subscriptions && subscriptions.dispose();
    View && View.destroy();
  }
};

module.exports.setPaths = setPaths;
module.exports.app = app;
