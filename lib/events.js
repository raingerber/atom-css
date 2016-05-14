var Emitter = require('atom').Emitter;
var CompositeDisposable = require('atom').CompositeDisposable;
var Crawler = require('./highlights/crawler-instance');
var addTextEditorObserver = require('./utils/selector-preview').addTextEditorObserver;

var oldText = '';
var newText = '';

function addEvents(mappings, View) {
  // console.log(arguments);
  var emitter = new Emitter;
  var subscriptions = new CompositeDisposable();

  emitter.on('prefill-search-input', function(query) {
    console.log(query);
    oldText = View._selectorInput.editor.getText();

    View._selectorInput.editor.setText(query);
    View._selectorInput.focus();
  });

  var textEditorObserver = function textEditorObserver(editor) {
    addTextEditorObserver(editor, emitter, Crawler.getFiles(), View._display.element);
  };

  subscriptions.add(atom.workspace.observeTextEditors(textEditorObserver));
  // console.log(mappings);
  subscriptions = addCommandSubscriptions(subscriptions, null, mappings.commands);
  subscriptions = addEmitterSubscriptions(subscriptions, emitter, mappings.emitter);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function addCommandSubscriptions(subscriptions, emitter, mappings) {
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
  // console.log(mappings);
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

module.exports.addEvents = addEvents;
