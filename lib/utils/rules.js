var cssParser = require('css');

function isPropertyRule(rule) {
  return rule.type === 'rule'; // rule.type === 'media'
}

// ONLY FINDS EXACT MATCHES
function ruleHasSelector(rule) {
  return rule.selectors && rule.selectors.indexOf(query) > -1;
}

function keepRule(rule) {
  return isPropertyRule(rule) && ruleHasSelector(rule);
}

function filterRules(rules) {
  return rules.filter(keepRule);
}

function getRules(css, sourcePath) {
  console.log(arguments);
  var ast = cssParser.parse(css, { source: sourcePath });
  console.log('dfsajkdfsdslkafjdslk');
  return ast.stylesheet.rules || [];
}

module.exports.filterRules = filterRules;
module.exports.getRules = getRules;
