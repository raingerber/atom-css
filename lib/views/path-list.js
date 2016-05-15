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

var _ = require('lodash');
var Emitter = require('atom').Emitter;

var emitter = new Emitter();

var element = document.createElement('ul');
element.classList.add('list-group');
element.classList.add('preprocessor-preview-path-list');
// var element = document.createElement('div');
// element.innerHTML = [
//   '<ul class="list-group preprocessor-preview-path-list">',
//   '</ul>'
// ].join('');
// var list = element.querySelector('ul');

function setPaths(paths) {
  clear();
  paths.forEach(function(path) {
    var node = document.createElement('li');
    node.classList.add('list-item');
    node.innerHTML = path + "<span class='icon icon-remove-close' style='float: right; cursor: pointer;'></span>";
    element.appendChild(node);
  });
}

element.addEventListener('click', function(event) {
  var text;
  var target = event.target;
  // console.log(event);
  // window.e = event;
  if (target.matches('.icon-remove-close')) {
    text = target.closest('li').textContent;
    console.log(text);
    // window.t = target;
    // emitter.emit()
  };
});

function toggle(show) {
  element.classList.toggle('hidden', !show);
}

function clear() {
  element.innerHTML = '';
}

module.exports.element = element;
module.exports.setPaths = setPaths;
module.exports.toggle = toggle;
