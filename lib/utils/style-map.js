var fs = require('fs');
var SourceMapConsumer = require('source-map').SourceMapConsumer;

// var render = require('../renderers/stylus');
var Rules = require('../utils/rules');
// var filterRules = require('../utils/rules');
var getRenderFnUsingPath = require('../renderers').getRenderFnUsingPath;

// this.consumer.computeColumnSpans();
function StyleMap(sourcePath, outputPath, css, sourcemap) {
  var render;
  this.sourcePath = sourcePath;
  this.outputPath = outputPath;
  this.css = getCSS(css, sourcePath);
  // console.log(this.css, sourcePath);
  if (sourcemap) {
    this.createMappings(this.css, sourcemap);
  } else {
    this.render();
  }
}

function updateMappings(_css, _sourcemap) {
  var css = _css;
  var sourcemap = _sourcemap;
  if (!css || !sourcemap) {
    console.log('No css and/or sourcemap provided.');
    css = this.css;
    sourcemap = this.sourcemap;
  }

  this.createMappings(css, sourcemap);
}

function render() {
  var render = getRenderFnUsingPath(this.sourcePath);
  render(this.sourcePath, this.outputPath, this.css, _.bind(createMappings, this));
}

function getCSS(css, inputPath) {
  return css || fs.readFileSync(inputPath, { encoding: 'utf8' }) || '';
}

// need to clear this stuff before making a new stylemap?
function createMappings(css, sourcemap) {
  if (!css || !sourcemap) {
    console.log('No css and/or sourcemap provided.');
    return;
  }

  this.css = css;
  this.sourcemap = sourcemap;
  this.consumer = new SourceMapConsumer(this.sourcemap);
  this.rules = Rules.getRules(this.css, this.sourcePath);
}

function search(query, _filterRules) {
  var filteredRules = Rules.filterRules(this.rules, query); // filter out the media and rule beforehand, just one time
  // filteredRules = Filter.filter(filteredRules, filterRules);
  // return filteredRules.map(_.bind(this.getOriginalPositionForRule, this));
  return this.getOriginalPositionsForRule(filteredRules);
}

function getOriginalPositionsForRule(filteredRules) {
  return filteredRules.map(_.partial(getOriginalPositionForRule, this.consumer));
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
