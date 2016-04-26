var _ = require('lodash');
var AtomFile = require('atom').File;
var CompositeDisposable = require('atom').CompositeDisposable;
var StyleMap = require('./style-map');

function SourceFile(path, callbacks) {
  this.callbacks = callbacks || {};
  this.file = new AtomFile(path, false);
  this.subscriptions = new CompositeDisposable();
  if (this.exists()) {
    this.addListeners(this.callbacks);
    this.createMappings(path);
  } else {
    console.log("The file does not exist:", path);
  }
}

SourceFile.prototype.getPath = function getPath() {
  return this.exists() ? this.file.getPath() || '' : '';
};

// when will this be used? does it do enough?
SourceFile.prototype.clear = function clear() {
  this.subscriptions.dispose();
};

// is there a listener for existence?
SourceFile.prototype.exists = function exists() {
  return this.file && this.file.existsSync(); // ALSO CHECK IT'S A FILE AND NOT A DIRECTORY
};

SourceFile.prototype.addCallback = function addCallback(callbacks, name) {
  if (callbacks[name]) {
    var debounced = _.debounce(callbacks[name], 50);
    this.subscriptions.add(this.file[name](debounced));
  }
}

SourceFile.prototype.addListeners = function addListeners(callbacks) {
  // this.subscriptions.add(
  //   this.file.onDidChange(_.bind(callbacks.onDidChange, this))
  // );
  this.addCallback(callbacks, 'onDidChange');
  this.addCallback(callbacks, 'onDidRename');
  this.addCallback(callbacks, 'onDidDelete');
};

// outputPath should be in a separate directory! --- avoid polluting the working folder
SourceFile.prototype.createMappings = function createMappings(inputPath, outputPath) {
  this.inputPath = inputPath || this.getPath();
  this.outputPath = outputPath || this.getOutputPath(inputPath);
  this.map = new StyleMap(this.inputPath, this.outputPath);
};

SourceFile.prototype.getOutputPath = function getOutputPath(inputPath) {
  return this.outputPath || generateOutputPath(inputPath);
};

function generateOutputPath(path) {
  return path.replace(/\.\S+$/, '.css'); // don't include .
}

module.exports = SourceFile;
