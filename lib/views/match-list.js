var render = require('./render');

var t = [
  '<div class=\'pre-preview-search-header\'>',
    // 'Source Search',
  '</div>',
  '<ul class=\'list-tree has-collapsable-children preprocessor-preview-tree-panel\'>',
  '</ul>'
].join('');

var element = document.createElement('div');
element.innerHTML = t;

var list = element.querySelector('ul');

var searchHeader = element.querySelector('.pre-preview-search-header');

// console.log(element);

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
//   crawler.setCurrentMatch(match.path, match.match.line, match.match.column);
// });

function getListTreeHTML(emitter, path, matchSelections) {
  // console.log(path);
  // console.log(matches);
  var tree = document.createElement('ul');
  tree.classList.add('list-tree');

  matchSelections.forEach(function(match) {
    // console.log(match); // range[0][0]
    var html = '<span>' + match.get('start', 'row')+ ':&nbsp;&nbsp;<a title=\'' + match.text + '\'>' + match.text + '</a></span>';
    var el = getItemHTML('li', html);
    // console.log(el.querySelector);
    el.querySelector('a').addEventListener('click', function() {
      // console.log(JSON.stringify(match, null, 2));
      emitter.emit('match-clicked', {
        path: path,
        match: match
      });
    });

    tree.appendChild(el);
  });

  return tree;
}

function clear() {
  list.innerHTML = '';
}

function getMatchHTML(emitter, match) {
  var path = match.file.getPath();
  var pathHTML = getPathHTML(path);
  var header = getItemHTML('div', pathHTML);
  var el = getNestedItemHTML('li');
  var tree = getListTreeHTML(emitter, path, match.matches);
  el.appendChild(header);
  el.appendChild(tree);
  return el;
}

function setFileMatches(emitter, matches) {
  list.innerHTML = '';
  matches.forEach(function(match) {
    var el = getMatchHTML(emitter, match);
    list.appendChild(el);
  });

  return element;
}

function onSearchEvent(data) {
  searchHeader.innerHTML =
    data.type === 'source' && 'Source Search' ||
    data.type === 'output' && 'Output Search' ||
    '';
}

module.exports.clear = clear;
module.exports.setFileMatches = setFileMatches;
module.exports.element = element;
module.exports.onSearchEvent = onSearchEvent;
