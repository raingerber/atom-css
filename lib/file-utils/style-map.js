var fs = require('fs');
var SourceMapConsumer = require('source-map').SourceMapConsumer;

// var render = require('../renderers/stylus');
var Rules = require('../utils/rules');
// var filterRules = require('../utils/rules');
var getRenderFnUsingPath = require('../renderers').getRenderFnUsingPath;

// this.consumer.computeColumnSpans();
function StyleMap(sourcePath, outputPath, css) {
  this.sourcePath = sourcePath;
  this.outputPath = outputPath;
  this.css = getCSS(css, sourcePath);
  // console.log(this.css, sourcePath);
  this.render = getRenderFnUsingPath(sourcePath);
  this.render(sourcePath, outputPath, this.css, _.bind(createMappings, this));
}

function getCSS(css, inputPath) {
  return css || fs.readFileSync(inputPath, { encoding: 'utf8' }) || '';
}

function createMappings(css, sourcemap) {
  this.css = css;
  this.sourcemap = sourcemap;
  this.consumer = new SourceMapConsumer(this.sourcemap);
  this.rules = Rules.getRules(this.css, this.sourcePath);
}

function search(query, _filterRules) {
  var filteredRules = Rules.filterRules(this.rules, query); // filter out the media and rule beforehand, just one time
  // filteredRules = Filter.filter(filteredRules, filterRules);
  // return filteredRules.map(_.bind(this.getOriginalPositionForRule, this));
  return getOriginalPositionsForRule(filteredRules);
}

function getOriginalPositionsForRule(filteredRules) {
  return filteredRules.map(_.bind(getOriginalPositionForRule, this));
}

function getOriginalPositionForRule(rule) {
  return this.getOriginalPosition(rule.position.start);
}

function getOriginalPosition(position) {
  return this.consumer ? this.consumer.originalPositionFor(position) : null;
}

function getGeneratedPositions(position) {
  return this.consumer ? this.consumer.allGeneratedPositionsFor(position) : null;
}

StyleMap.prototype.search = search;
StyleMap.prototype.createMappings = createMappings;
StyleMap.prototype.getOriginalPosition = getOriginalPosition;
StyleMap.prototype.getGeneratedPositions = getGeneratedPositions;
StyleMap.prototype.getOriginalPositionForRule = getOriginalPositionForRule;

module.exports = StyleMap;
