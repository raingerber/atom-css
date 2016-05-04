var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');
// console.log(__dirname + '/paths.json');
var config = jsonfile.readFileSync(__dirname + '/paths.json');

// paths can be either an array of strings or a function that returns an array of strings
var input = _.result(config, 'input');

input.paths = globPaths(input.paths, input.cwd || '');

input.paths = uniqArr(input.paths);
input.ports = uniqArr(input.ports);

console.log(input);

function uniqArr(input) {
  input = Array.isArray(input) ? input : [];
  input = _.uniq(input);
  input = _.compact(input);
  return input;
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

  // console.log(globbed);
  return globbed;
}

function globPathFn(cwd) {
  cwd = cwd || '';
  return function globCwdPath(path) {
    return globPath(path, cwd);
  }
}

function globPaths(newPaths, cwd) {
  var inputPaths =
    Array.isArray(newPaths) && newPaths ||
    // Array.isArray(paths) && paths ||
    [];

  var globbedPaths =
    _(inputPaths)
      .map(globPathFn(cwd))
      .flatten()
      .uniq()
      .value();

  // console.log(globbedPaths);
  return globbedPaths;
}

module.exports.globPath = globPath;
module.exports.globPaths = globPaths;
