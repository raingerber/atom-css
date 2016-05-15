var _ = require('lodash');
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
    // console.log(query);
    oldText = View._selectorInput.editor.getText();

    View._selectorInput.editor.setText(query);
    View.togglePanel('bottom', true);
    View._selectorInput.focus();

    // add key listener to clear the query and restore the oldText
  });

  var textEditorObserver = function textEditorObserver(editor) {
    console.error(Crawler.getFiles());
    addTextEditorObserver(editor, emitter, Crawler.getFiles(), View._display.element);
  };

  subscriptions.add(atom.workspace.observeTextEditors(textEditorObserver));
  // console.log(mappings);
  subscriptions = addCommandSubscriptions(subscriptions, emitter, mappings.commands);
  subscriptions = addEmitterSubscriptions(subscriptions, emitter, mappings.emitter);

  return {
    emitter: emitter,
    subscriptions: subscriptions
  };
}

function onCommand(mapping, emitter, subscriptions) {
  // redirect the same command to the emitter as well
  // by overwriting the callback in the mapping to the command
  var ping = _.mapValues(mapping, function(value, key) {
    var command = key;
    return function emitCommand() {
      emitter.emit(command);
    };
  });

  subscriptions.add(addWorkspaceCommand(mapping));
  subscriptions.add(addWorkspaceCommand(ping));
}

function addCommandSubscriptions(subscriptions, emitter, mappings) {
  // console.log(mappings);
  mappings.forEach(function(mapping) {
    // console.log(mapping);
    onCommand(mapping, emitter, subscriptions);
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
