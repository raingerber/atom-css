var _ = require('lodash');

var element;

function animate(path) {
  var el = getPathElement(path);

  if (!el) {
    return;
  }

  el.classList.add('animate-class');
}

function getPathElement(path) {
  if (!element) {
    return null;
  }

  var match = _.find(element.children, function(child) {
    return child.textContent === path;
  });

  return match || null;
}

function setPaths(paths) {
  clear();
  paths.forEach(function(path) {
    var node = document.createTextNode(path);
    element.appendChild(node);
  });
}

function clear() {
  element.innerHTML = '';
}

module.exports.element = element;
module.exports.setPaths = setPaths;
