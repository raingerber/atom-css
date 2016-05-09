var fs = require('fs');
var SourceMapConsumer = require('source-map').SourceMapConsumer;

// var render = require('../renderers/stylus');
var Rules = require('../utils/rules');
// var filterRules = require('../utils/rules');
var getRenderFnUsingPath = require('../renderers').getRenderFnUsingPath;

// this.consumer.computeColumnSpans();
function StyleMap(sourcePath, outputPath, rawCSS, sourcemap) {
  // console.log('say');
  var render;
  this.sourcePath = sourcePath;
  this.outputPath = outputPath;
  this.rawCSS = rawCSS || readFile(sourcePath);
  // console.error('XXXXXX', rawCSS ? rawCSS.length : '');
  if (sourcemap) {
    console.error('WRONG');
    this.createMappings(this.rawCSS, sourcemap);
  } else {
    this.render();
  }
}

// HAVE OPTION TO READ CSS FROM THE FILE
function updateMappings(_rawCSS, _sourcemap) {
  var rawCSS;
  var sourcemap;
  if (_rawCSS && _sourcemap) {
    // console.error('updating');
    rawCSS = _rawCSS;
    sourcemap = _sourcemap;
  } else {
    rawCSS = this.rawCSS;
    // console.error('updating (NOT)');
    sourcemap = this.sourcemap;
  }

  if (!rawCSS || !sourcemap) {
    console.log('No css and/or sourcemap provided.');
    return;
  }

  this.createMappings(rawCSS, sourcemap);
}

function render() {
  var render = getRenderFnUsingPath(this.sourcePath);
  try {
    render(this.sourcePath, this.outputPath, this.rawCSS, _.bind(createMappings, this));
  } catch(e) {
    console.log(e);
  }
}

function readFile(inputPath) {
  return fs.readFileSync(inputPath, { encoding: 'utf8' }) || '';
}

// need to clear this stuff before making a new stylemap?
function createMappings(css, sourcemap) {;
  if (!css || !sourcemap) {
    // console.log('No css and/or sourcemap provided.');
    return;
  }

  // console.error(arguments);

  this.css = css;
  this.sourcemap = sourcemap;
  this.consumer = sourcemap ? new SourceMapConsumer(sourcemap) : null;
  this.rules = Rules.getRules(this.css, this.sourcePath);
}

function search(query, _filterRules) {
  var filteredRules = Rules.filterRules(this.rules, query); // filter out the media and rule beforehand, just one time
  // filteredRules = Filter.filter(filteredRules, filterRules);
  // return filteredRules.map(_.bind(this.getOriginalPositionForRule, this));
  return this.getOriginalPositionsForRule(filteredRules);
}

function getOriginalPositionsForRule(filteredRules) {
  var consumer = this.consumer;
  return filteredRules.map(function(rule) {
    return getOriginalPositionForRule(consumer, rule);
  });
}

function getOriginalPositionForRule(consumer, rule) {
  return getOriginalPosition(consumer, rule.position.start);
}

function getOriginalPosition(consumer, position) {
  return consumer ? consumer.originalPositionFor(position) : null;
}

function getGeneratedPositions(consumer, position) {
  // console.dir(arguments);
  return consumer ? consumer.allGeneratedPositionsFor(position) : null;
}

StyleMap.prototype.updateMappings = updateMappings;
StyleMap.prototype.render = render;
StyleMap.prototype.search = search;
StyleMap.prototype.createMappings = createMappings;
StyleMap.prototype.getOriginalPosition = getOriginalPosition;
StyleMap.prototype.getGeneratedPositions = getGeneratedPositions;
StyleMap.prototype.getOriginalPositionForRule = getOriginalPositionForRule;
StyleMap.prototype.getOriginalPositionsForRule = getOriginalPositionsForRule;

module.exports = StyleMap;
