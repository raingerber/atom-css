var fs = require('fs');
var SourceFile = require('../file-utils/source-file');

function createFilterRules(text) {
  var input = 'Users/armstroma/github/atom-stylus/css/temp.styl';
  var content = 'root {' + text + '}';
  fs.writeFileSync(input, content); // make async?
  var sourceFile = new SourceFile(input);
  // console.log(sourceFile);
  var filterRules = _.filter(sourceFile.rules, { type: 'rule' });
  return filterRules;
}

function hasQueryRules(queryProperties, definedProperties) {
  if (_.isEmpty(definedProperties)) {
    return _.size(queryProperties) === 0;
  }

  return _.findKey({'root': definedProperties}, queryProperties) === 'root';
}

function getPropertiesFromRules(arr) {
  return arr.map(function getProperties(obj) {
    return obj.properties;
  });
}

function getParsedProperties(rules) {
  return _(rules)
    .thru(parseRules)
    .thru(getPropertiesFromRules)
    .value();
}

function filter(rules, filterRules) {
  var queryProperties = getParsedProperties(filterRules)[0];//[0]?
  var hasQueryRulesPartial = _.partial(hasQueryRules, properties);
  var definedProperties = getParsedProperties(rules);
  return definedProperties.filter(_.partial(hasQueryRules, queryProperties));
}

function filterByTypeGetter(types) {
  var types =
    Array.isArray(types) && types.filter(_.isString)
    || [];
  return function filterByTypes(rules) {
    return rules.filter()
  }
}

function parseRules(rules) {

  var parsedRules =
    _(rules)
      .filter(filterByTypeGetter(['rule', 'media'])) // ALSO MEDIA
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

module.exports.createFilterRules = createFilterRules;
module.exports.hasQueryRules = hasQueryRules;
module.exports.parseRules = parseRules;
module.exports.filter = filter;
