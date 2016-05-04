var fs = require('fs');
var SourceFile = require('../file-utils/source-file');

function createFilterRules(text) {
  var input = 'Users/armstroma/Desktop/atom-css/css/temp.styl';
  var content = 'root {' + text + '}';
  // console.log('writing', input, content);
  fs.writeFileSync(input, content); // make async?
  var sourceFile = new SourceFile(input);

  // console.log(sourceFile);
  var filterRules = _.filter(sourceFile.rules, function(rule) {
    return rule.type === 'rule' || rule.type === 'media';
  });
  return filterRules;
}

function hasQueryRules(queryProperties, definedProperties) {
  if (_.isEmpty(definedProperties)) {
    return _.size(queryProperties) === 0;
  }

  return _.findKey({ 'root': definedProperties }, queryProperties) === 'root';
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
  // debugger;
  var queryProperties = getParsedProperties(filterRules)[0];//[0]?
  var hasQueryRulesPartial = _.partial(hasQueryRules, properties);
  var definedProperties = getParsedProperties(rules);
  return definedProperties.filter(_.partial(hasQueryRules, queryProperties));
}

function getFilterByType(types) {
  var types =
    typeof types === 'string' && [types]
    || Array.isArray(types) && types.filter(_.isString)
    || [];
  return function filterByTypes(rules) {
    return rules.filter(function(rule) {
      console.log(rule.type);
      return _.includes(types, rule.type);
    });
  }
}

function parseRules(rules) {
  console.dir(rules);
  var parsedRules =
    _(rules)
      .filter(getFilterByType(['rule', 'media']))
      .map(function(rule) {
        if (rule)
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
