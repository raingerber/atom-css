var Hogan = require('hogan.js');

function render(tpl, data) {
  if (Array.isArray(tpl)) {
    tpl = tpl.join('');
  } else if (typeof tpl !== 'string') {
    tpl = '';
  }

  var template = Hogan.compile(tpl);
  var output = template.render(data);

  return output;
}

module.exports.render = render;
