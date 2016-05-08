Function = require('loophole').Function;
var app = require('./controller');
var paths = require('./paths').getPaths();

// create watcher here for the paths, and feed them into the controller to update
// also create port watchers here

module.exports = app;
