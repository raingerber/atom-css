var Emitter = require('atom').Emitter;

// when does this get cleaned up?
var emitter = new Emitter();

var element = document.createElement('ul');
element.classList.add('list-tree');
element.classList.add('has-collapsable-children');

element.classList.add('preprocessor-preview-tree-panel')

function createElement(tagName, className, html) {
  var el = document.createElement(tagName);
  el.classList.add(className);
  el.innerHTML = html || '';
  return el;
}

function getNestedItemHTML(tagName, html) {
  var item = createElement(tagName, 'list-nested-item', html || '');
  return item;
}

function getItemHTML(tagName, html) {
  html = html || '';
  var item = createElement(tagName, 'list-item', html);
  return item;
}

function getPathHTML(path) {
  path = path || '';
  var html = '<span class="disclosure-arrow"></span>';
  html += '<span class=\'icon icon-file-text\'><span title=\'' + path + '\'>' + path + '</span></span>';
  // var html = '<span class="disclosure-arrow"></span><span title=\'' + path + '\' class=\'icon icon-file-text\'>' + path + '</span>';
  return html;
}

// emitter.on('match-clicked', function(match) {
//   if (!crawler) {
//     return;
//   }
//
//   // console.log(match);
//   crawler.setCurrentMatch(match.path, match.match.line, match.match.column);
// });

function getListTreeHTML(path, matches) {
  // console.log(path);
  // console.log(matches);
  var tree = document.createElement('ul');
  tree.classList.add('list-tree');
  matches.forEach(function(match) {
    // console.log(match);
    var html = '<span>' + match.range[0][0] + ':&nbsp;&nbsp;<a title=\'' + match.text + '\'>' + match.text + '</a></span>';
    var el = getItemHTML('li', html);
    // console.log(el.querySelector);
    el.querySelector('a').addEventListener('click', function() {
      // console.log(JSON.stringify(match, null, 2));
      emitter.emit('match-clicked', { path: path, match: match });
    });

    tree.appendChild(el);
  });

  return tree;
}

function clear() {
  element.innerHTML = '';
}

function getMatchHTML(match) {
  var path = match.file.getPath();
  // console.log(path);
  var pathHTML = getPathHTML(path);
  var header = getItemHTML('div', pathHTML);
  var el = getNestedItemHTML('li');
  // console.log(match);
  var tree = getListTreeHTML(path, match.matches);
  el.appendChild(header);
  el.appendChild(tree);
  return el;
}

function setFileMatches(matches) {
  // console.error('APPLE-APPLE-APPLE-APPLE');
  // console.error(matches);
  element.innerHTML = '';
  // console.log(JSON.stringify(matches, null, 2));
  matches.forEach(function(match) {
    var el = getMatchHTML(match);
    element.appendChild(el);
  });

  return element;
}

module.exports.clear = clear;
module.exports.setFileMatches = setFileMatches;
module.exports.element = element;
module.exports.emitter = emitter;
