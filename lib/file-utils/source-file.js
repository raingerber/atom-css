var _ = require('lodash');
var AtomFile = require('atom').File;
var CompositeDisposable = require('atom').CompositeDisposable;
var StyleMap = require('../utils/style-map');

// remove emitter
// listener for when a file is created?
function SourceFile(path, callbacks, emitter) {
  this.callbacks = callbacks || {};
  this.file = new AtomFile(path, false);
  this.subscriptions = new CompositeDisposable();
  if (this.exists()) {
    this.addListeners(this.callbacks, emitter);
    this.createMappings(path);
  } else {
    console.log("The file does not exist:", path);
  }
}

SourceFile.prototype.getRawPath = function getRawPath() {
  return this.file.getPath();
};

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

SourceFile.prototype.addCallback = function addCallback(callbacks, name, emitter) {
  if (!callbacks[name]) {
    return;
  }

  var fn =
    _(callbacks[name])
      .debounce(50)
      .bind(this)
      .value();

  var file = emitter ? emitter : this.file;
  var sub = file[name](fn);

  this.subscriptions.add(sub);
}

SourceFile.prototype.addListeners = function addListeners(callbacks, emitter) {
  this.addCallback(callbacks, 'onDidChange', emitter);
  this.addCallback(callbacks, 'onDidRename', emitter);
  this.addCallback(callbacks, 'onDidDelete', emitter);
};

// outputPath should be in a separate directory! --- avoid polluting the working folder
SourceFile.prototype.createMappings = function createMappings(inputPath, outputPath, css, sourcemap) {
  this.inputPath = inputPath || this.getPath();
  this.outputPath = outputPath || this.getOutputPath(inputPath);
  // console.log(this.inputPath, this.outputPath, css, sourcemap);
  this.map = new StyleMap(this.inputPath, this.outputPath, css, sourcemap);
};

SourceFile.prototype.getOutputPath = function getOutputPath(inputPath) {
  return this.outputPath || generateOutputPath(inputPath);
};

function generateOutputPath(path) {
  return path.replace(/\.\S+$/, '.css'); // don't include .
}

module.exports = SourceFile;
