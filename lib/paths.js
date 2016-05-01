var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');

var config = jsonfile.readFileSync(__dirname + '/paths.json');

// paths can be either an array of strings or a function that returns an array of strings
var configPaths = _.result(config, 'paths');

// var c = {
//   "input": {
//     "paths": [],
//     "ports": ["1337"]
//   }
// };
//
// var configData =
//   _(config)
//     .result('input')
//     .pick(['paths', 'ports'])
//     .value();
//
// configData.ports = _.uniqBy(configData.ports, function(port) {
//   return port.path;
// });

// configData.paths =
//   _(configData.ports)
//     .thru(function(arr) {
//       return Array.isArray(arr) ? arr : [];
//     })
//     .differenceBy(function(path) {
//       console.log(path);
//       var some = _.some(configData.ports, function(port) {
//         return port.path === path;
//       });
//
//       return !some;
//     })
//     .value();
//
// configData.paths = _.differenceBy(configData, function(path) {
//   console.log(path);
//   var some = _.some(configData.ports, function(port) {
//     return port.path === path;
//   });
//
//   return !some;
// });

var paths = _.isArray(configPaths) ? configPaths : [];

if (!paths.length) {
  console.log('No input paths specified!');
}

function globPath(path) {
  if (typeof path !== 'string') {
    return '';
  }

  var globbed = glob.sync(path, {
    cwd: process.cwd(),
    silent: false,
    strict: false,
    nodir: true
  });

  // console.log(path, '-->', globbed);
  return globbed;
}

window.g = glob.sync;

function globPaths(newPaths) {
  var inputPaths =
    Array.isArray(newPaths) && newPaths ||
    Array.isArray(paths) && paths ||
    [];
  // console.dir(inputPaths);
  var globbedPaths =
    _(inputPaths)
      .map(globPath)
      .flatten()
      .value();

  return globbedPaths;
}

console.dir(globPaths(paths));
module.exports.globPath = globPath;
module.exports.globPaths = globPaths;
