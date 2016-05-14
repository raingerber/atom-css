var Emitter = require('atom').Emitter;

var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');
// console.log(__dirname + '/paths.json');
var config = jsonfile.readFileSync(__dirname + '/paths.json');

// paths can be either an array of strings or a function that returns an array of strings
var input = _.result(config, 'input');

input.paths = formatPaths(input.paths);
input.ports = uniqArr(input.ports);


function formatPaths(paths) {
  var _paths = globPaths(input.cwd || '', paths);
  _paths = uniqArr(_paths);
  return _paths;
}



function uniqArr(_input) {
  _input = Array.isArray(_input) ? _input : [];
  _input = _.uniq(_input);
  _input = _.compact(_input);
  return _input;
}



function globPath(path, cwd) {
  if (typeof path !== 'string' || !path.length) {
    return [];
  }

  if (!glob.hasMagic(path)) {
    return path ? [path] : [];
  }

  // !cwd covers the empty string case
  if (!cwd || typeof cwd !== 'string') {
    cwd = process.cwd();
  }

  var globbed =
    glob.sync(path, {
      cwd: cwd,
      silent: false,
      strict: false,
      nodir: false
    })
    .map(function(g) {
      return '/Users/armstroma/github/atom-stylus' + '/' + g;
    });

  // console.log(path, globbed);
  return globbed;
}



function globPathFn(cwd) {
  cwd = cwd || '';
  return function globCwdPath(path) {
    return globPath(path, cwd);
  }
}



function globPaths(cwd, newPaths) {
  var inputPaths =
    Array.isArray(newPaths) && newPaths ||
    // Array.isArray(paths) && paths ||
    [];
  // console.log(newPaths);
  var globbedPaths =
    _(inputPaths)
      .map(globPathFn(cwd))
      .flatten()
      .uniq()
      .value();

  // console.log(globbedPaths);
  return globbedPaths;
}



function getPaths() {
  // console.log('inputting');
  // console.log(input.cwd, input.paths);
  var paths = globPaths(input.cwd, input.paths);
  // console.log(paths);
  return paths;
}




function addNewPath(path) {
  if (typeof path !== 'string' || !path.length) {
    return;
  }

  input.paths.push(path);
  input.paths = formatPaths(input.paths);

  console.log(input.paths);
  emitter.emit('paths-updated', input.paths);
}

module.exports.emitter = emitter;
module.exports.getPaths = getPaths;
module.exports.addNewPath = addNewPath;
