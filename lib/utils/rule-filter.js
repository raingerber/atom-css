var fs = require('fs');
var SourceFile = require('../file-utils/source-file');

function createFilterRule(text) {
  var input = 'Users/armstroma/github/atom-stylus/css/temp.styl';
  var content = 'root {' + text + '}';
  fs.writeFileSync(input, content); // make async?
  var sourceFile = new SourceFile(input);
  // console.log(sourceFile);
  var filterRules = _.filter(sourceFile.rules, { type: 'rule' });
  return filterRules;
}

function hasQueryRules(queryRules, definedRules) {
  var _rules = parseRules([definedRules])[0].properties;
  if (_.isEmpty(_rules)) {
    return _.size(queryRules) === 0;
  }

  return _.findKey({'root': _rules}, queryRules) === 'root';
}

function gummy(arr) {
  return arr.map(function(obj) {
    return obj.properties;
  });
}

function filter(rules, filterRules) {
  var _filterRules = gummy(parseRules(filterRules))[0];
  return rules.filter(_.partial(hasQueryRules, _filterRules));
}

function parseRules(rules) {

  var parsedRules =
    _(rules)
      .filter({ type: 'rule' }) // ALSO MEDIA
      .map(function(rule) {
        return {
          selectors: rule.selectors || [],
          properties: getRuleProperties(rule) || {}
        };
      })
      .value();

  return parsedRules;
}

function getRuleProperties(rule) {
  return rule.declarations.reduce(addRuleProperty, {});
}

function addRuleProperty(obj, declaration) {
  obj[declaration.property] = declaration.value;
  return obj;
}

module.exports.createFilterRule = createFilterRule;
module.exports.hasQueryRules = hasQueryRules;
module.exports.parseRules = parseRules;
module.exports.filter = filter;
