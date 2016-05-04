var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');
// console.log(__dirname + '/paths.json');
var config = jsonfile.readFileSync(__dirname + '/paths.json');

// paths can be either an array of strings or a function that returns an array of strings
var input = _.result(config, 'input');

input.paths = globPaths(input.cwd || '', input.paths);

input.paths = uniqArr(input.paths);
input.ports = uniqArr(input.ports);

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
      return '/Users/armstroma/Desktop/atom-css' + '/' + g;
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
  return globPaths(input.cwd, input.paths);
}

module.exports.getPaths = getPaths;
