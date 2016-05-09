Function = require('loophole').Function;
var app = require('./controller').app;
var setPaths = require('./controller').setPaths;
var setPaths = require('./highlights/crawler-instance').setPaths;
var paths = require('./paths').getPaths();

setPaths(paths);

// create watcher here for the paths, and feed them into the controller to update
// also create port watchers here

module.exports = app;
