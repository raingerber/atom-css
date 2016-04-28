var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');

var config = jsonfile.readFileSync(__dirname + '/paths.json');

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
    nodir: true
  });

  // console.log(path, '-->', globbed);
  return globbed;
}
window.g=glob.sync;
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
