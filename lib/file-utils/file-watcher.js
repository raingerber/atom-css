var _ = require('lodash');
var SourceFile = require('./source-file');

function SourceFileException(badFiles) {
  this.name = 'SourceFileException';
  this.badFiles = badFiles;
}

var supportedExtensions = require('../renderers/index').supportedExtensions;

// it watches multiple files
function FileWatcher(paths, callbacks) {
  // console.log(paths);
  this.paths = _.uniq(paths);
  this.callbacks = callbacks || {};
  this.allFiles = getSourceFiles(this.paths, this.callbacks);
  this.files = this.allFiles.filter(_.method('exists'));
  // console.log(this.paths);
  // console.log(this.files);
}

FileWatcher.prototype.getFiles = function getFiles() {
  return this.files || [];
};

FileWatcher.prototype.confirmThatFilesExist = function confirmThatFilesExist() {
  var badFiles = _.reject(this.allFiles, _.method('exists'));
  if (!badFiles.length) {
    return true;
  }

  console.log(badFiles);

  throw new SourceFileException(badFiles);
}


FileWatcher.prototype.pathIsSupported = function pathIsSupported(path) {
  var match = _.some(supportedExtensions, function(extension) {
    return _.endsWith(path, '.' + extension);
  });

  return !!match;
};

FileWatcher.prototype.getSourceFileByPath = function getSourceFileByPath(targetPath) {
  if (this.pathIsSupported(targetPath)) {
    return _.find(this.getFiles(), function filePathIsTargetPath(file) {
      var a = hack(file.getPath()) === hack(targetPath);
      return a;
    });
  }

  return null;
};

FileWatcher.prototype.clear = function clear() {
  this.files.forEach(_.method('clear'));
  this.files = [];
};

FileWatcher.prototype.addFile = function addFile(path) {
  if (pathIsBeingWatched(this.files, path)) {
    return false;
  }

  var file = new SourceFile(path, this.callbacks);
  this.files.push(file);
};

FileWatcher.prototype.removeFile = function removeFile(path) {
  // console.log(path);
  var removed = _.remove(this.files, function(file) {
    return file.getPath() === path; // there's a function that does this
  });

  // console.log(removed.length + ' file(s) were removed');
};

function getSourceFiles(paths, callbacks) {
  // try catch for this? test with invalid path, directory path, etc.
  paths = paths || [];
  var createSourceFile = function createSourceFile(path) {
    return new SourceFile(path, callbacks);
  };

  return paths.map(createSourceFile);
}

function pathIsBeingWatched(files, path) {
  var match = _.some(files, function pathCompare(file) {
    file.path === path;
  });

  return !!match;
}

function hack(str) {
  if (str.charAt(0) === '/') {
    return str.substring(1);
  }

  return str;
}

module.exports = FileWatcher;
