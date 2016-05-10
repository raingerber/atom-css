var Emitter = require('atom').Emitter;
var CompositeDisposable = require('atom').CompositeDisposable;
var Crawler = require('./highlights/crawler-instance');
var addTextEditorObserver = require('./utils/selector-preview').addTextEditorObserver;

function addEvents(mappings, displayView) {
  // console.log(arguments);
  var emitter = new Emitter;
  var subscriptions = new CompositeDisposable();

  var textEditorObserver = function textEditorObserver(editor) {
    addTextEditorObserver(editor, Crawler.getFiles(), displayView);
  };

  subscriptions.add(atom.workspace.observeTextEditors(textEditorObserver));
  // console.log(mappings);
  subscriptions = addCommandSubscriptions(subscriptions, mappings.commands);
  subscriptions = addEmitterSubscriptions(subscriptions, emitter, mappings.emitter);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function addCommandSubscriptions(subscriptions, mappings) {
  // console.log(mappings);
  mappings.forEach(function(mapping) {;
    subscriptions.add(addWorkspaceCommand(mapping));
  });

  return subscriptions;
}

function addWorkspaceCommand(mapping) {
  return atom.commands.add('atom-workspace', mapping);
}

function addEmitterSubscriptions(subscriptions, emitter, mappings) {
  console.log(mappings);
  _.forEach(mappings, function(value, key) {
    subscriptions.add(addEmitterEvent(emitter, key, value));
  });

  return subscriptions;
}

function addEmitterEvent(emitter, name, callback) {
  emitter.on(name, callback)
  var diposable = {
    dispose: function dispose() {
      emitter.off(name, callback);
    }
  };

  return diposable;
}

function clearEvents() {

}

module.exports.addEvents = addEvents;
module.exports.clearEvents = clearEvents;
