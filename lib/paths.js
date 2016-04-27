var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');

var config = jsonfile.readFileSync(__dirname + '/config.json');
console.dir(config);
// paths can be either an array of strings or a function that returns an array of strings
var configPaths = _.result(config, 'paths');

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
    nodir: false
  });

  // console.log(path, '-->', globbed);
  return globbed;
}

function globPaths(newPaths) {
  var inputPaths =
    Array.isArray(newPaths) && newPaths ||
    Array.isArray(paths) && paths ||
    [];

  var globbedPaths =
    _(inputPaths)
      .map(globPath)
      .flatten()
      .value();

  return globbedPaths;
}

// console.dir(globbedPaths);
module.exports.globPath = globPath;
module.exports.globPaths = globPaths;
