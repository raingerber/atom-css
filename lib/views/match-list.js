var element = document.createElement('ul');
element.classList.add('list-tree');
element.classList.add('has-collapsable-children');

function createElement(tagName, className, html) {
  var el = document.createElement(tagName);
  el.classList.add(className);
  el.innerHTML = html || '';
  return el;
}

function getNestedItemHTML(html) {
  var item = createElement('li', 'list-nested-item', html || '');
  return item;
}

function getItemHTML(html) {
  var item = createElement('div', 'list-item', html);
  return item;
}

function getPathHTML(path) {
  var html = '<span class=\'icon icon-file-text\'>' + path + '</span>';
  return html;
}



function getListTreeHTML(matches) {
  var tree = document.createElement('ul');
  tree.classList.add('list-tree');
  matches.forEach(function(match) {
    var html = '<span>' + match.line + ':&nbsp;&nbsp;' + match.content + '</span>';
    var el = getItemHTML(html);
    tree.appendChild(el);
  });

  return tree;
}

function clear() {
  element.innerHTML = '';
}

function setFileMatches(path, matches) {
  var pathHTML = getPathHTML(path);
  var header = getItemHTML(pathHTML);
  var el = getNestedItemHTML();
  var tree = getListTreeHTML(matches);
  el.appendChild(header);
  el.appendChild(tree);
  return el;
}

// console.log(setFileMatches('<URL>', [
//   {
//     line: 25,
//     content: 'HELLO'
//   },
//   {
//     line: 26,
//     content: 'WORLD'
//   }
// ]));

module.exports.clear = clear;
module.exports.setFileMatches = setFileMatches;
module.exports.element = element;

//div.list-item
//li.list-item
//li.list-nested-item
//ul.list-tree
//
// <ul class='list-tree has-collapsable-children'>
//     <li class='list-nested-item'>
//         <div class='list-item'>
//             <span class='icon icon-file-directory'>A Directory</span>
//         </div>
//
//         <ul class='list-tree'>
//             <li class='list-nested-item'>
//                 <div class='list-item'>
//                     <span class='icon icon-file-directory'>Nested Directory</span>
//                 </div>
//
//                 <ul class='list-tree'>
//                     <li class='list-item'>
//                         <span class='icon icon-file-text'>File one</span>
//                     </li>
//                 </ul>
//             </li>
//
//             <li class='list-nested-item collapsed'>
//                 <div class='list-item'>
//                     <span class='icon icon-file-directory'>Collapsed Nested Directory</span>
//                 </div>
//
//                 <ul class='list-tree'>
//                     <li class='list-item'>
//                         <span class='icon icon-file-text'>File one</span>
//                     </li>
//                 </ul>
//             </li>
//
//             <li class='list-item'>
//                 <span class='icon icon-file-text'>File one</span>
//             </li>
//
//             <li class='list-item selected'>
//                 <span class='icon icon-file-text'>File three .selected!</span>
//             </li>
//         </ul>
//     </li>
//
//     <li class='list-item'>
//         <span class='icon icon-file-text'>.icon-file-text</span>
//     </li>
//
//     <li class='list-item'>
//         <span class='icon icon-file-symlink-file'>.icon-file-symlink-file</span>
//     </li>
// </ul>
