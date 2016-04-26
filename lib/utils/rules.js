var cssParser = require('css');

function isPropertyRule(rule) {
  return rule.type === 'rule'; // rule.type === 'media'
}

// ONLY FINDS EXACT MATCHES
function ruleHasSelector(query, rule) {
  return rule.selectors && rule.selectors.indexOf(query) > -1;
}

function keepRule(query, rule) {
  return isPropertyRule(rule) && ruleHasSelector(query, rule);
}

function filterRules(rules, query) {
  return rules.filter(_.partial(keepRule, query));
}

function getRules(css, sourcePath) {
  // css = css.replace(/(\r\n|\n|\r|\s)/gm, '');
  var ast = cssParser.parse(css, { source: sourcePath });
  return ast.stylesheet.rules || [];
}

module.exports.filterRules = filterRules;
module.exports.getRules = getRules;
