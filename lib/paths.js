var _ = require('lodash');
var jsonfile = require('jsonfile');

var config = jsonfile.readFileSync(__dirname + './config.json');

// paths can be either an array of strings or a function that returns an array of strings
var configPaths = _.result(config, 'paths');

var paths = _.isArray(configPaths) ? configPaths : [];

if (!paths.length) {
  console.log('No input paths specified!');
}

module.exports = paths;
