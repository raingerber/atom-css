var Emitter = require('atom').Emitter;
var CompositeDisposable = require('atom').CompositeDisposable;
var Crawler = require('./highlights/crawler-instance');

var mappings = {
  commands: {
    'project-find:show': onFindCommand,
    'find-and-replace:show': onFindCommand,
    'atom-stylus:toggle': toggleSearchPanel,
    'core:cancel': cancel
  },
  emitter: {
    'match-clicked': onMatchClicked,
    'search': onSearch
  }
};

function addEvents(mappings, displayView) {

  var emitter = new Emitter;
  var subscriptions = new CompositeDisposable();

  var textEditorObserver = function textEditorObserver(editor) {
    addTextEditorObserver(editor, Crawler.getFiles(), displayView);
  };

  subscriptions.add(atom.workspace.observeTextEditors(textEditorObserver));

  subscriptions = addCommandSubscriptions(subscriptions, mappings.commands);
  subscriptions = addEmitterSubscriptions(subscriptions, emitter, mappings.emitter);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function addCommandSubscriptions(subscriptions, mappings) {
  mappings.forEach(function(mapping) {
    subscriptions.add(addWorkspaceCommand(mapping)); // IT IS NOT A 'MAPPING' IT A VALUE AND A KEY IN FOREACH
  });

  return subscriptions;
}

function addWorkspaceCommand(mapping) {
  return atom.commands.add('atom-workspace', mapping);
}

function addEmitterSubscriptions(subscriptions, emitter, mappings) {
  mappings.forEach(function(mapping) {
    subscriptions.add(addEmitterEvent(emitter, mapping));
  });

  return subscriptions;
}

function addEmitterEvent(emitter, mapping) {
  var name = mapping.name;
  var callback = mapping.callback;
  emitter.on(name, callback)
  var diposable = {
    dispose: function dispose() {
      emitter.off(name, callback);
    }
  };

  return diposable;
}


module.exports.addEvents = addEvents;
