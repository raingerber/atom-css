var _ = require('lodash');
var SourceFile = require('./source-file');

// it watches multiple files
function FileWatcher(paths, callbacks) {
  this.paths = _.uniq(paths);
  this.callbacks = callbacks || {};
  this.files = getSourceFiles(this.paths, this.callbacks);
}

FileWatcher.prototype.getFiles = function getFiles() {
  return this.files;
};

FileWatcher.prototype.getSourceFileByPath = function getSourceFileByPath(targetPath) {
  if (stylusFile(targetPath)) {
    return _.find(this.getFiles(), function filePathIsTargetPath(file) {
      var a = hack(file.getPath()) === hack(targetPath);
      return a;
    });
  }
  return false;
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
  console.log(path);
  // var removed = _.remove(this.files, function(file) {
  //   return file.getPath() === path; // there's a function that does this
  // });

  // console.log(removed.length + ' file(s) were removed');
};

function getSourceFiles(paths, callbacks) {
  // try catch for this? test with invalid path, directory path, etc.

  var createSourceFile = function createSourceFile(path) {
    return new SourceFile(path, callbacks);
  };

  return paths
    .map(createSourceFile)
    .filter(_.method('exists'));
}

function pathIsBeingWatched(files, path) {
  return _.some(files, function(file) {
    file.path === path;
  });
}

function hack(str) {
  if (str.charAt(0) === '/') {
    return str.substring(1);
  }
  return str;
}

function stylusFile(path) {
  return _.endsWith(path, '.styl')
}

module.exports = FileWatcher;
