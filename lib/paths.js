var _ = require('lodash');
var jsonfile = require('jsonfile');
var glob = require('glob');

var config = jsonfile.readFileSync(__dirname + './config.json');

// paths can be either an array of strings or a function that returns an array of strings
var configPaths = _.result(config, 'paths');

var paths = _.isArray(configPaths) ? configPaths : [];

if (!paths.length) {
  console.log('No input paths specified!');
}

var paths = paths.map(function(path) {
  if (typeof path !== 'string') {
    return '';
  }

  var globbed = glob.sync(path, {

  });

  return globbed;
});

module.exports = paths;
