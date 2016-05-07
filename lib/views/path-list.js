var _ = require('lodash');

var element = document.createElement('ul');
element.classList.add('list-group');
// function animate(path) {
//   var el = getPathElement(path);
//
//   if (!el) {
//     return;
//   }
//
//   el.classList.add('animate-class');
// }
//
// function getPathElement(path) {
//   if (!element) {
//     return null;
//   }
//
//   var match = _.find(element.children, function(child) {
//     return child.textContent === path;
//   });
//
//   return match || null;
// }

// <ul class='list-group'>
//     <li class='list-item'>Normal item</li>
//     <li class='list-item selected'>This is the Selected item</li>
//     <li class='list-item text-subtle'>Subtle</li>
//     <li class='list-item text-info'>Info</li>
//     <li class='list-item text-success'>Success</li>
//     <li class='list-item text-warning'>Warning</li>
//     <li class='list-item text-error'>Error</li>
// </ul>

function setPaths(paths) {
  clear();
  paths.forEach(function(path) {
    var node = document.createElement('li');
    node.classList.add('list-item');
    node.innerHTML = path;
    // element.appendChild(node);
    // var node = document.createTextNode(path);
    // element.appendChild(node);
  });
}

function clear() {
  element.innerHTML = '';
}

module.exports.element = element;
module.exports.setPaths = setPaths;
