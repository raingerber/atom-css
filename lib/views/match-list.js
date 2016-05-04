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

emitter.on('match-clicked', function(a) {
  console.log(a);
});

function getListTreeHTML(path, matches) {
  console.log(path);
  // console.log(matches);
  var tree = document.createElement('ul');
  tree.classList.add('list-tree');
  matches.forEach(function(match) {
    // console.log(match);
    var html = '<span>' + match.line + ':&nbsp;&nbsp;<a title=\'' + match.content + '\'>' + match.content + '</a></span>';
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
  // console.log(match);
  var path = match.file.getPath();
  var pathHTML = getPathHTML(path);
  var header = getItemHTML('div', pathHTML);
  var el = getNestedItemHTML('li');
  var tree = getListTreeHTML(path, match.matches);
  el.appendChild(header);
  el.appendChild(tree);
  return el;
}

function setFileMatches(matches) {
  // console.log(JSON.stringify(matches, null, 2));
  _.forEach(matches, function(match) {
    var el = getMatchHTML(match);
    element.appendChild(el);
  });

  return element;
}

module.exports.clear = clear;
module.exports.setFileMatches = setFileMatches;
module.exports.element = element;
module.exports.emitter = emitter;
